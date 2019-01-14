import ProjectListModel from "../ProjectListModel";
import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IProjectInfoProps {
  showProjectInfo?: ProjectListModel;
  onDismiss: any;
  context: WebPartContext;
  projectsEntity: {
    listName: string;
    contentTypeId: string;
    fieldsGroupName: string;
    groupIdFieldName: string;
  };
}
