import { DisplayMode } from '@microsoft/sp-core-library';

export interface IProjectInformationProps {
  title: string;
  displayMode: DisplayMode;
  updateTitle: (title: string) => void;
}
