import { DisplayMode } from '@microsoft/sp-core-library';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IProjectInformationWebPartProps } from '../ProjectInformationWebPart';

export interface IProjectInformationProps extends IProjectInformationWebPartProps {
  context: WebPartContext;
  displayMode?: DisplayMode;
  updateTitle?: (title: string) => void;
  hideEditPropertiesButton?: boolean;
}
