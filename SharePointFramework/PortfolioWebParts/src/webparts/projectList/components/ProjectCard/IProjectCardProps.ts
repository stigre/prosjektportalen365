import ProjectListModel from "../../../../common/models/ProjectListModel";

interface IProjectCardProps {
  project: ProjectListModel;
  onClickHref: string;
  showProjectInfo: () => void;
}

export default IProjectCardProps;
