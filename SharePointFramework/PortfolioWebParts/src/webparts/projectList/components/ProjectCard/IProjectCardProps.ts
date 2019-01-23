import ProjectListModel from "../../../../Common/models/ProjectListModel";
import Phase from "../../models/Phase";

interface IProjectCardProps {
  project: ProjectListModel;
  onClickHref: string;
  showProjectInfo: (evt: any) => void;
  absoluteUrl: string;
}

export default IProjectCardProps;
