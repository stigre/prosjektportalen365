
import IPortfolioOverviewColumnConfig from './IPortfolioOverviewColumnConfig';
import IPortfolioOverviewRefinerConfig from './IPortfolioOverviewRefinerConfig';
import IPortfolioOverviewViewConfig from './IPortfolioOverviewViewConfig';
import IStatusFieldsConfig from '../../../common/models/config/IStatusFieldsConfig';

export default interface IPortfolioOverviewConfig {
  columns: IPortfolioOverviewColumnConfig[];
  refiners: IPortfolioOverviewRefinerConfig[];
  views: IPortfolioOverviewViewConfig[];
  statusFields: IStatusFieldsConfig;
}

export {
    IPortfolioOverviewColumnConfig,
    IPortfolioOverviewRefinerConfig,
    IPortfolioOverviewViewConfig,
    IStatusFieldsConfig,
};
