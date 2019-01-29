import ProjectListModel from "../../../../common/models/ProjectListModel";

interface IProjectCardProps {
  project: ProjectListModel;
  onClickHref: string;
  showProjectInfo: (evt: any) => void;
  absoluteUrl: string;
}

export default IProjectCardProps;
