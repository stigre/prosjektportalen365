import ProjectListModel from "../ProjectListModel";
import { PageContext } from "@microsoft/sp-page-context";
export interface IProjectInfoProps {
  showProjectInfo?: ProjectListModel;
  onDismiss: any;
  pageContext: PageContext;
  projectsEntity: {
    listName: string;
    contentTypeId: string;
    fieldsGroupName: string;
    groupIdFieldName: string;
  };
}
