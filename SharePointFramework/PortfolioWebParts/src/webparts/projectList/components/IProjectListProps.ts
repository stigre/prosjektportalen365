import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Web } from "@pnp/sp";

export interface IProjectListProps {
  absoluteUrl: string;
  web: Web;
  serverRelativeUrl: string;
  context: WebPartContext;
}
