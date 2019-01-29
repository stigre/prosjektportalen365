import IGroupByOption from "../../interfaces/IGroupByOption";
import IExcelExportConfig from "../../interfaces/IExcelExportConfig";

export interface IListProps {
  showCommandBar?: boolean;
  showSearchBox?: boolean;
  groupByOptions?: IGroupByOption[];
  defaultGroupBy?: IGroupByOption;
  excelExportEnabled?: boolean;
  excelExportConfig?: IExcelExportConfig;
}
