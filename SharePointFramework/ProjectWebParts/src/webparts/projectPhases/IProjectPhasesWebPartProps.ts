export interface IProjectPhasesWebPartProps {
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