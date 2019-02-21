import IGroupByOption from "../../../common/interfaces/IGroupByOption";

export interface IPortfolioOverviewState {
  isLoading: boolean;
  searchTerm?: string;
  groupBy: IGroupByOption;
}
