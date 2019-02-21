import IPortfolioOverviewFilter from './IPortfolioOverviewFilter';

export default interface IDynamicPortfolioFilterState {
    isCollapsed: boolean;
    filter?: IPortfolioOverviewFilter;
}
