import { Web } from '@pnp/sp';
import { IProjectPhasesWebPartProps } from "../IProjectPhasesWebPartProps";

export interface IProjectPhasesProps extends IProjectPhasesWebPartProps {
  currentUserManageWeb: boolean;
  webAbsoluteUrl: string;
  domElement: HTMLElement;
  web: Web;
}
