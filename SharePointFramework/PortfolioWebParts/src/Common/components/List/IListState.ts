import IGroupByOption from "../../interfaces/IGroupByOption";
import { ExcelExportStatus } from "../../ExportToExcel";

export interface IListState {
  searchTerm?: string;
  groupBy: IGroupByOption;
  excelExportStatus?: ExcelExportStatus;
}
