import IGroupByOption from "../../interfaces/IGroupByOption";

export interface IListState {
  searchTerm?: string;
  groupBy: IGroupByOption;
}
