import { DisplayMode } from '@microsoft/sp-core-library';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IProjectStatusWebPartProps } from '../ProjectStatusWebPart';

export interface IProjectStatusProps extends IProjectStatusWebPartProps {
    context: WebPartContext;
    displayMode: DisplayMode;
    updateTitle: (title: string) => void;
}
