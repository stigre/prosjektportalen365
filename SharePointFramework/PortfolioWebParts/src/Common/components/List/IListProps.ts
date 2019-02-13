import IGroupByOption from "../../interfaces/IGroupByOption";
import IExcelExportConfig from "../../interfaces/IExcelExportConfig";
import { IColumn } from "office-ui-fabric-react/lib/DetailsList";

export interface IListProps {
  items?: Array<any>;
  columns?: Array<IColumn>;
  showCommandBar?: boolean;
  showSearchBox?: boolean;
  groupByOptions?: IGroupByOption[];
  defaultGroupBy?: IGroupByOption;
  excelExportEnabled?: boolean;
  excelExportConfig?: IExcelExportConfig;
}
