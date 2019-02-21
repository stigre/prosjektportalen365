import IGroupByOption from "../../../common/interfaces/IGroupByOption";
import { PageContext } from "@microsoft/sp-page-context";
import { IPortfolioOverviewConfig } from "../config/PortfolioOverviewConfig";

export interface IPortfolioOverviewProps {
  pageContext: PageContext;
  groupByOptions?: IGroupByOption[];
  defaultGroupBy?: IGroupByOption;
  defaultView?: IPortfolioOverviewConfig;
}
