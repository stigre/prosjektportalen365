import { INewStatusReportModalField } from "./NewStatusReportModal/INewStatusReportModalProps";

export interface IProjectStatusState {
    showNewStatusReportModal?: boolean;
    fields: INewStatusReportModalField[];
}
