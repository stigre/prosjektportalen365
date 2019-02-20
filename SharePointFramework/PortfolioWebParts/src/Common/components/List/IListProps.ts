import IGroupByOption from "../../interfaces/IGroupByOption";
import IExcelExportConfig from "../../interfaces/IExcelExportConfig";
import { IColumn } from "office-ui-fabric-react/lib/DetailsList";
import { PageContext } from "@microsoft/sp-page-context";

export interface IListProps {
  items?: Array<any>;
  columns?: Array<IColumn>;
  showCommandBar?: boolean;
  showSearchBox?: boolean;
  pageContext: PageContext;
  groupByOptions?: IGroupByOption[];
  defaultGroupBy?: IGroupByOption;
  excelExportEnabled?: boolean;
  excelExportConfig?: IExcelExportConfig;
  entity?: {
    listName: string;
    contentTypeId: string;
    fieldsGroupName: string;
    siteIdFieldName: string;
  };
}
