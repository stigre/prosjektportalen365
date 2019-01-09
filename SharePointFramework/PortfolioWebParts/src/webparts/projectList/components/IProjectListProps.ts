import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IProjectListProps {
  absoluteUrl: string;
  serverRelativeUrl: string;
  context: WebPartContext;
}
