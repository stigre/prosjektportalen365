import IPortfolioOverviewFilter from '../PortfolioOverviewFilter/IPortfolioOverviewFilter';
import IPortfolioOverviewFilterItem from "./IPortfolioOverviewFilterItem";

export default interface IDynamicPortfolioFilterItemProps {
    filter: IPortfolioOverviewFilter;
    item: IPortfolioOverviewFilterItem;
    className: string;
    padding?: number | string;
    marginBottom?: number;
    onChange: (item: any, checked: boolean) => void;
}

export { IPortfolioOverviewFilter };

