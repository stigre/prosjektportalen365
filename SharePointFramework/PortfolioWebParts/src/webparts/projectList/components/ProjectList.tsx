import * as React from 'react';
import styles from './ProjectList.module.scss';
import { IProjectListProps } from './IProjectListProps';
import { IProjectListState, IProjectListData } from './IProjectListState';
import ProjectListModel from './ProjectListModel';
import { Spinner, SpinnerType } from "office-ui-fabric-react/lib/Spinner";
import ProjectCard from './ProjectCard/ProjectCard';

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
    this.setState({ data: projectData, isLoading: false });
  }

  public render(): React.ReactElement<IProjectListProps> {

    if (this.state.isLoading) return <Spinner label='Loading projects...' type={SpinnerType.large} />;

      return (
        <div className={styles.projectList}>
          <div className={styles.projectsContainer}>
            {this.renderCards()}
          </div>
        </div>
      );
  }

  private renderCards() {
    const data = this.state.data;

    return (
      <div className={styles.ppCardContainer}>
        {data.projects.map(project => (
          <ProjectCard
          project={project}
          onClickHref='https://google.com/'
          showProjectInfo={e => this.setState({ showProjectInfo: project })}
          />
        ))}
      </div>
    );
  }

  private fetchData() {

    const testProjects: ProjectListModel[] = [];

    let logo = this.props.rootUrl + '/SiteAssets/pp/img/ICO-Global-Project-11.png';

    let project: ProjectListModel = {
      Logo: logo,
      Manager: 'Stian Grepperud',
      Owner: 'Stian Grepperud',
      Phase: 'Gjennomføre',
      ServiceArea: 'N/A',
      Title: 'TestProsjekt',
      Type: 'Type',
      Url: '/sites/prosjekt-1',
      Views: 1,
      RawObject: undefined
    };
    for (let index = 0; index < 5; index++) {
      testProjects.push(project);
    }


    const testData: IProjectListData = {
      projects: testProjects
    };

    return testData;
  }

}
