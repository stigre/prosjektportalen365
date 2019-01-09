import { Web } from '@pnp/sp';
import { IProjectPhasesWebPartProps } from "../IProjectPhasesWebPartProps";
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IProjectPhasesProps extends IProjectPhasesWebPartProps {
  currentUserManageWeb: boolean;
  webAbsoluteUrl: string;
  domElement: HTMLElement;
  web: Web;
  context: WebPartContext;
  entityListName?: string;
}
