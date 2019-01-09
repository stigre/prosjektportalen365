import { DisplayMode } from '@microsoft/sp-core-library';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IProjectInformationProps {
  title: string;
  displayMode: DisplayMode;
  updateTitle: (title: string) => void;
  listName?: string;
  contentTypeId?: string;
  fieldsGroup?: string;
  context?: WebPartContext;
}
