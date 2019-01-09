import { INewStatusReportModalField } from "./NewStatusReportModal/INewStatusReportModalProps";
import ProjectStatusReport from "../models/ProjectStatusReport";

export interface IProjectStatusState {
    showNewStatusReportModal?: boolean;
    fields: INewStatusReportModalField[];
    reports: ProjectStatusReport[];
}
