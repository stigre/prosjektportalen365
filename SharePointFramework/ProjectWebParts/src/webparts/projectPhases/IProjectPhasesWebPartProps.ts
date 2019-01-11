import  { IBaseWebPartProps } from '../baseWebPart';

export interface IProjectPhasesWebPartProps extends IBaseWebPartProps {
    phaseField: string;
    automaticReload: boolean;
    reloadTimeout: number;
    confirmPhaseChange: boolean;
    fontSize: number;
    gutter: number;
    updateViewsDocuments: boolean;
    updateViewsTasks: boolean;
    updateViewsRisks: boolean;
    phaseSubTextProperty: string;
}