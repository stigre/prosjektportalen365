import IPortfolioOverviewFilterItem from '../PortfolioOverviewFilterItem/IPortfolioOverviewFilterItem';
import IPortfolioOverviewRefinerConfig from '../../../config/IPortfolioOverviewRefinerConfig';

export default interface IPortfolioOverviewFilter extends IPortfolioOverviewRefinerConfig {
    emptyMessage: string;
    items: IPortfolioOverviewFilterItem[];
    selected?: string[];
}
