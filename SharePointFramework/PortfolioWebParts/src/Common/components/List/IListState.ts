import IGroupByOption from "../../interfaces/IGroupByOption";
import { ExcelExportStatus } from "../../ExportToExcel";

export interface IListState {
  groupBy: IGroupByOption;
  excelExportStatus?: ExcelExportStatus;
}
