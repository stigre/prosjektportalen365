import ProjectListModel from "../ProjectListModel";
import Phase from "../../models/Phase";

interface IProjectCardProps {
  project: ProjectListModel;
  onClickHref: string;
  showProjectInfo: (evt: any) => void;
  absoluteUrl: string;
  phases: Phase[];
  projectsData: any[];
}

export default IProjectCardProps;
