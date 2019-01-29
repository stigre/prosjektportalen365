import * as React from 'react';
import styles from './ProjectList.module.scss';
import * as strings from 'ProjectListWebPartStrings';
import { IProjectListProps } from './IProjectListProps';
import { IProjectListState, IProjectListData } from './IProjectListState';
import ProjectListModel from '../../../Common/models/ProjectListModel';
import { Spinner, SpinnerType } from "office-ui-fabric-react/lib/Spinner";
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { MessageBar } from 'office-ui-fabric-react/lib/MessageBar';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import ProjectCard from './ProjectCard/ProjectCard';
import { sp, SearchQuery, QueryPropertyValueType, SearchQueryBuilder, ISearchQueryBuilder } from '@pnp/sp';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { taxonomy } from '@pnp/sp-taxonomy';
import Phase from '../models/Phase';
import ProjectInfo from '../../../Common/components/ProjectInfo/ProjectInfo';

export default class ProjectList extends React.Component<IProjectListProps, IProjectListState> {

  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      phases: [],
      isLoading: true,
      data: undefined,
      showProjectInfo: undefined
    };
  }

  public async componentDidMount() {
    await this.fetchData();
  }

  public render(): React.ReactElement<IProjectListProps> {
    if (this.state.isLoading) return <Spinner label={strings.LoadingProjectsLabel} type={SpinnerType.large} />;
    return (
      <div className={styles.projectListWebPartContainer}>
        {(this.state.showProjectInfo) ?
          <ProjectInfo
            projectsEntity={this.props.projectsEntity}
            pageContext={this.props.pageContext}
            showProjectInfo={this.state.showProjectInfo}
            onDismiss={e => this.setState({ showProjectInfo: undefined })} /> : null}
        <div className={styles.projectListSearchBox}>
          <SearchBox placeholder={strings.SearchBoxPlaceholderText} onChanged={this.onSearch} />
        </div>
        <div className={styles.projectList}>
          <div className={styles.projectsContainer}>
            {this.renderCards()}
          </div>
        </div>
      </div>
    );
  }

  private renderCards() {
    const { projects } = this.getFilteredData();
    return (
      <div className={styles.ppCardContainer}>
        {projects.length === 0 ? <MessageBar>{strings.NoSearchResults}</MessageBar> :
          projects.map(project => (
            <ProjectCard
              project={project}
              onClickHref={project.Url}
              showProjectInfo={e => this.setState({ showProjectInfo: project })}
              absoluteUrl={this.props.absoluteUrl}
            />
          ))}
      </div>
    );
  }

  private getFilteredData(): IProjectListData {
    const { data, searchTerm } = this.state;
    if (searchTerm) {
      const projects = data.projects
        .filter(project => {
          const matches = Object.keys(project).filter(key => {
            const value = project[key];
            return value && typeof value === "string" && value.toLowerCase().indexOf(searchTerm) !== -1;
          }).length;
          return matches > 0;
        })
        .sort((a, b) => a.Title > b.Title ? 1 : -1);
      return { ...data, projects };
    } else return { ...data };
  }

  @autobind
  private onSearch(searchTerm: string) {
    this.setState({ searchTerm: searchTerm.toLowerCase() });
  }

  private async fetchData() {
    const projectListItems: ProjectListModel[] = [];
    let projects = await sp.web.lists.getByTitle('Prosjekter').items.get();
    let users = await sp.web.siteUsers.get();

    const phaseField = await this.props.web.fields.getByInternalNameOrTitle('Fase').select('TermSetId').get();
    const terms = await taxonomy.getDefaultSiteCollectionTermStore().getTermSetById(phaseField.TermSetId).terms.get();
    const phases = terms.filter(term => term.LocalCustomProperties.ShowOnFrontPage !== 'false').map(term => new Phase(term, {}));

    let queryText = `DepartmentId:${this.props.pageContext.legacyPageContext.siteId} contentclass:STS_Site`;

    const _searchQuerySettings: SearchQuery = {
      TrimDuplicates: false,
      RowLimit: 500,
      SelectProperties: ['Title', 'Path', 'DepartmentId', 'SiteId', 'SiteLogo', 'ViewsLifetime'],
      Properties: [{
        Name: "EnableDynamicGroups",
        Value: {
          BoolVal: true,
          QueryPropertyValueTypeIndex: QueryPropertyValueType.BooleanType
        }
      }
      ]
    };

    const query: ISearchQueryBuilder = SearchQueryBuilder(queryText, _searchQuerySettings);
    let result = await sp.search(query);
    let associatedSites = result.PrimarySearchResults.filter(site => this.props.pageContext.legacyPageContext.siteId.indexOf(site['SiteId']) === -1);

    associatedSites.forEach(site => {
      let currentProject = projects.filter(p => site.Title === p.Title)[0];
      let owner = users.filter(user => user.Id === currentProject.GtProjectOwnerId)[0];
      let manager = users.filter(user => user.Id === currentProject.GtProjectManagerId)[0];
      let phase = phases.filter(p => p.id === currentProject.GtProjectPhase.TermGuid)[0].term.PathOfTerm;

      let project: ProjectListModel = {
        Logo: site.SiteLogo,
        Manager: manager ? `${manager.Email}|${manager.Title}`: null,
        Owner: owner ? `${owner.Email}|${owner.Title}` : null,
        Phase: phase,
        ServiceArea: null,
        Title: site.Title,
        Type: null,
        Url: site.Path,
        Views: site.ViewsLifetime,
        RawObject: currentProject
      };
      projectListItems.push(project);
    });

    const testData: IProjectListData = {
      projects: projectListItems
    };

    this.setState({
      data: testData,
      phases: phases,
      projects: projects,
      isLoading: false
    });

  }
}

