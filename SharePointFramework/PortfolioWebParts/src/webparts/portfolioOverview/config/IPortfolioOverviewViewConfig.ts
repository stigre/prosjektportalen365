export default interface IPortfolioOverviewViewConfig {
  id?: number;
  name?: string;
  queryTemplate: string;
  iconName?: any;
  default?: boolean;
  fields?: any[];
  refiners?: any[];
  groupBy?: string;
}
