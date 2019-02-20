import IGroupByOption from "../../interfaces/IGroupByOption";
import { ExcelExportStatus } from "../../ExportToExcel";

export interface IListState {
  showProjectInfo?: any;
  searchTerm?: string;
  groupBy: IGroupByOption;
  excelExportStatus?: ExcelExportStatus;
  showModalDialog?: boolean;
}
