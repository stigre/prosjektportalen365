import * as React from 'react';
import styles from './ProjectList.module.scss';
import * as strings from 'ProjectListWebPartStrings';
import { IProjectListProps } from './IProjectListProps';
import { IProjectListState, IProjectListData } from './IProjectListState';
import ProjectListModel, { IUserDetails } from './ProjectListModel';
import { Spinner, SpinnerType } from "office-ui-fabric-react/lib/Spinner";
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { MessageBar } from 'office-ui-fabric-react/lib/MessageBar';
import ProjectCard from './ProjectCard/ProjectCard';
import { autobind } from '@uifabric/utilities/lib';

export default class ProjectList extends React.Component<IProjectListProps, IProjectListState> {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      data: undefined
    };
  }

  public componentDidMount() {
    let projectData: IProjectListData = this.fetchData();
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
              rootUrl={this.props.rootUrl}
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

  private fetchData() {
    const testProjects: ProjectListModel[] = [];
    let logo = `${this.props.rootUrl}/SiteAssets/pp/img/ICO-Global-Project-11.png`;

    let project1: ProjectListModel = {
      Logo: logo,
      Manager: 'stian@pzlpart.onmicrosoft.com|Stian Grepperud',
      Owner: 'stian@pzlpart.onmicrosoft.com|Stian Grepperud',
      Phase: 'Konsept',
      ServiceArea: 'N/A',
      Title: `Stian's prosjekt`,
      Type: 'Type',
      Url: '/sites/prosjekt-1',
      Views: 5,
      RawObject: undefined
    };

    let project2: ProjectListModel = {
      Logo: logo,
      Manager: 'stian@pzlpart.onmicrosoft.com|Stian Grepperud',
      Owner: 'stian@pzlpart.onmicrosoft.com|Stian Grepperud',
      Phase: 'Gjennomføre',
      ServiceArea: 'N/A',
      Title: 'Et testprosjekt',
      Type: 'Type',
      Url: '/sites/prosjekt-2',
      Views: 36,
      RawObject: undefined
    };

    let project3: ProjectListModel = {
      Logo: logo,
      Manager: 'stian@pzlpart.onmicrosoft.com|Stian Grepperud',
      Owner: 'stian@pzlpart.onmicrosoft.com|Stian Grepperud',
      Phase: 'Planlegge',
      ServiceArea: 'N/A',
      Title: 'Koseprosjekt',
      Type: 'Type',
      Url: '/sites/prosjekt-3',
      Views: 589,
      RawObject: undefined
    };

    testProjects.push(project1);
    testProjects.push(project2);
    testProjects.push(project3);

    const testData: IProjectListData = {
      projects: testProjects
    };

    return testData;
  }


}

