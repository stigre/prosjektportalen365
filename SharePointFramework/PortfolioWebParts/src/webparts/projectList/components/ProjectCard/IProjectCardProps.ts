import ProjectListModel from "../../../../common/models/ProjectListModel";

interface IProjectCardProps {
  project: ProjectListModel;
  onClickHref: string;
  showProjectInfo: () => void;
  fallbackPreviewImage: string;
}

export default IProjectCardProps;
