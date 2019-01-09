import { INewStatusReportModalField } from "./NewStatusReportModal/INewStatusReportModalProps";
import ProjectStatusReport from "../models/ProjectStatusReport";

export interface IProjectStatusState {
    showNewStatusReportModal?: boolean;
    reportFields: INewStatusReportModalField[];
    entityFields: any[];
    entityItem: any;
    reports: ProjectStatusReport[];
    selectedReport: ProjectStatusReport;
}
