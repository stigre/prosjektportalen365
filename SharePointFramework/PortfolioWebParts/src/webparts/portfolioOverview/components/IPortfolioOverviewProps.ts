import IGroupByOption from "../../../common/interfaces/IGroupByOption";
import { PageContext } from "@microsoft/sp-page-context";

export interface IPortfolioOverviewProps {
  pageContext: PageContext;
  groupByOptions?: IGroupByOption[];
  defaultGroupBy?: IGroupByOption;
}
