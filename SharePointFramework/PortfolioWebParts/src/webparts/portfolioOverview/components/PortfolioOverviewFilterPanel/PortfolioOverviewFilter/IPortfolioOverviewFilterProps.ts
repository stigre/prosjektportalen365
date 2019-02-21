import IPortfolioOverviewFilter from './IPortfolioOverviewFilter';

export default interface IDynamicPortfolioFilterProps {
    filter?: IPortfolioOverviewFilter;
    onFilterChange?: (filter: IPortfolioOverviewFilter) => void;
}
