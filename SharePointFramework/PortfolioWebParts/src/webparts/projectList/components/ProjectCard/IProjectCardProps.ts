import ProjectListModel from "../ProjectListModel";

interface IProjectCardProps {
  project: ProjectListModel;
  onClickHref: string;
  showProjectInfo: (evt: any) => void;
  rootUrl: string;
  // fields: { [key: string]: string };
}

export default IProjectCardProps;
