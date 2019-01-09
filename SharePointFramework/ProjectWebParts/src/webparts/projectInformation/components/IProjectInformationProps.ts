import { DisplayMode } from '@microsoft/sp-core-library';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IProjectInformationProps {
  title: string;
  displayMode: DisplayMode;
  updateTitle: (title: string) => void;
  entityListName?: string;
  entityCtId?: string;
  entityFieldsGroup?: string;
  context?: WebPartContext;
}
