import IGroupByOption from "../../../common/interfaces/IGroupByOption";

export interface IPortfolioOverviewState {
  isLoading: boolean;
  searchTerm?: string;
  items?: any[];
  groupBy: IGroupByOption;
  currentFilters?: { [key: string]: string[] };
}
