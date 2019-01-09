import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ILatestProjectsProps {
  absoluteUrl: string;
  serverRelativeUrl: string;
  context: WebPartContext;
}
