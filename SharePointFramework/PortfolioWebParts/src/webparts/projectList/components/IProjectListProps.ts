import { Web } from "@pnp/sp";
import { PageContext } from "@microsoft/sp-page-context";
import { SPHttpClient } from "@microsoft/sp-http";

export interface IProjectListProps {
  absoluteUrl: string;
  web: Web;
  serverRelativeUrl: string;
  pageContext: PageContext;
  spHttpClient: SPHttpClient;
  projectsEntity: {
    listName: string;
    contentTypeId: string;
    fieldsGroupName: string;
    groupIdFieldName: string;
  };
}
