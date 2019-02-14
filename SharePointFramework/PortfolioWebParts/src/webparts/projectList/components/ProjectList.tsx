import * as React from 'react';
import styles from './ProjectList.module.scss';
import * as strings from 'ProjectListWebPartStrings';
import { IProjectListProps } from './IProjectListProps';
import { IProjectListState, IProjectListData } from './IProjectListState';
import { Spinner, SpinnerType } from "office-ui-fabric-react/lib/Spinner";
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { MessageBar } from 'office-ui-fabric-react/lib/MessageBar';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import ProjectCard from './ProjectCard/ProjectCard';
import { sp, QueryPropertyValueType } from '@pnp/sp';
import { taxonomy } from '@pnp/sp-taxonomy';
import ProjectInfo from '../../../common/components/ProjectInfo/ProjectInfo';

export default class ProjectList extends React.Component<IProjectListProps, IProjectListState> {
  constructor(props: IProjectListProps) {
    super(props);
    this.state = { projects: [], isLoading: true };
  }

  public async componentDidMount() {
    await this.fetchData();
  }

  public render(): React.ReactElement<IProjectListProps> {
    if (this.state.isLoading) return <Spinner label={strings.LoadingProjectsLabel} type={SpinnerType.large} />;
    return (
      <div className={styles.projectListWebPartContainer}>
        {this.state.showProjectInfo &&
          <ProjectInfo
            entity={this.props.entity}
            pageContext={this.props.pageContext}
            showProjectInfo={this.state.showProjectInfo}
            onDismiss={(_event: any) => this.setState({ showProjectInfo: null })} />}
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
              showProjectInfo={() => this.setState({ showProjectInfo: project })}
              fallbackPreviewImage={`${this.props.webAbsoluteUrl}/SiteAssets/pp/img/ICO-Global-Project-11.png`} />
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
    let [projectListItems, users, phaseTerms, { PrimarySearchResults: associatedSites }] = await Promise.all([
      sp.web.lists.getByTitle(this.props.entity.listName).items.usingCaching().get(),
      sp.web.siteUsers.usingCaching().get(),
      taxonomy.getDefaultSiteCollectionTermStore().getTermSetById(this.props.phaseTermSetId).terms.usingCaching().get(),
      sp.search({
        Querytext: `DepartmentId:${this.props.pageContext.legacyPageContext.siteId} contentclass:STS_Site`,
        TrimDuplicates: false,
        RowLimit: 500,
        SelectProperties: ['Title', 'Path', 'DepartmentId', 'SiteId', 'SiteLogo', 'ViewsLifetime'],
        Properties: [{
          Name: "EnableDynamicGroups",
          Value: {
            BoolVal: true,
            QueryPropertyValueTypeIndex: QueryPropertyValueType.BooleanType
          }
        }]
      }),
    ]);
    let projects = associatedSites
      .map(site => {
        let [item] = projectListItems.filter(p => site['SiteId'] === p.GtSiteId);
        if (item) {
          let [owner] = users.filter(user => user.Id === item.GtProjectOwnerId);
          let [manager] = users.filter(user => user.Id === item.GtProjectManagerId);
          let phase = item.GtProjectPhase ? phaseTerms.filter(p => p.Id.indexOf(item.GtProjectPhase.TermGuid) !== -1)[0].Name : '';

          return {
            Logo: site.SiteLogo,
            Manager: manager,
            Owner: owner,
            Phase: phase,
            ServiceArea: null,
            Title: site.Title,
            Type: null,
            Url: site.Path,
            Views: site.ViewsLifetime,
            RawObject: item,
          };
        }
        return null;
      })
      .filter(p => p);

    const data: IProjectListData = { projects };

    this.setState({ data, projects, isLoading: false });
  }
}

