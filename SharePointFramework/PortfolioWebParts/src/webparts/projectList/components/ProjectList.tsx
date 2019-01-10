import * as React from 'react';
import styles from './ProjectList.module.scss';
import * as strings from 'ProjectListWebPartStrings';
import { IProjectListProps } from './IProjectListProps';
import { IProjectListState, IProjectListData } from './IProjectListState';
import ProjectListModel, { IUserDetails } from './ProjectListModel';
import { Spinner, SpinnerType } from "office-ui-fabric-react/lib/Spinner";
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { MessageBar } from 'office-ui-fabric-react/lib/MessageBar';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import ProjectCard from './ProjectCard/ProjectCard';
import { sp, SearchQuery, QueryPropertyValueType, SearchQueryBuilder, ISearchQueryBuilder } from '@pnp/sp';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export default class ProjectList extends React.Component<IProjectListProps, IProjectListState> {


  constructor(props) {
    super(props);
    this.state = { isLoading: true, data: undefined };
  }

  public async componentDidMount() {
    let projectData: IProjectListData = await this.fetchData();
    this.setState({ data: projectData, isLoading: false, searchTerm: undefined });
  }

  public render(): React.ReactElement<IProjectListProps> {

    if (this.state.isLoading) return <Spinner label={strings.LoadingProjectsLabel} type={SpinnerType.large} />;

    return (
      <div className={styles.projectListWebPartContainer}>
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
    const { projects, fields } = this.getFilteredData();

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
    const testProjects: ProjectListModel[] = [];
    let id = await this.getHubId();
    let queryText = `DepartmentId:{${id}} contentclass:STS_Site`;

    const _searchQuerySettings: SearchQuery = {
      TrimDuplicates: false,
      RowLimit: 500,
      SelectProperties: ['Title', 'Path', 'DepartmentId', 'SiteId', 'SiteLogo'],
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
    let associatedSites = result.PrimarySearchResults.filter(site => id !== site['SiteId']);

    associatedSites.forEach(site => {
      let logo = site.SiteLogo;
      if (site.SiteLogo.indexOf('GetGroupImage') > 0) logo = undefined;

      let project: ProjectListModel = {
        Logo: logo,
        Manager: 'stian@pzlpart.onmicrosoft.com|Stian Grepperud',
        Owner: 'stian@pzlpart.onmicrosoft.com|Stian Grepperud',
        Phase: 'Planlegge',
        ServiceArea: 'N/A',
        Title: site.Title,
        Type: 'N/A',
        Url: site.Path,
        Views: 5,
        RawObject: undefined
      };

      testProjects.push(project);
    });

    const testData: IProjectListData = {
      projects: testProjects
    };

    return testData;
  }

  private getHubId() {
    let rootUrl = this.props.absoluteUrl.replace(this.props.serverRelativeUrl, '');
    let url = `${rootUrl}/_api/HubSites?$filter=SiteUrl eq '${this.props.absoluteUrl}'`;
    let id: string = '';

    return this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1, {
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'odata-version': '',
      }
    }).then((response: SPHttpClientResponse) => {
      return response.json();
    }).then((responseJSON) => {
      let responseItems = responseJSON.value;
      if (responseItems.length > 0) {
        id = responseItems[0].ID;
      }
      return id;
    });
  }

}

