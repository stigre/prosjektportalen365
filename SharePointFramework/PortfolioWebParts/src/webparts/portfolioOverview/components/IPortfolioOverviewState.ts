import IGroupByOption from '../../../common/interfaces/IGroupByOption';
import { IPortfolioOverviewColumnConfig, IPortfolioOverviewConfig, IPortfolioOverviewViewConfig } from '../config/PortfolioOverviewConfig';
import { IPortfolioOverviewFilter } from './PortfolioOverviewFilterPanel/PortfolioOverviewFilterPanel';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export interface IPortfolioOverviewErrorMessage {
  message: string;
  type: MessageBarType;
}

export interface IPortfolioOverviewState {
  isLoading?: boolean;
  searchTerm?: string;
  items?: any[];
  filteredItems?: any[];
  config?: IPortfolioOverviewConfig;
  filters?: IPortfolioOverviewFilter[];
  currentView?: IPortfolioOverviewViewConfig;
  fieldNames?: string[];
  groupBy?: IGroupByOption;
  currentFilters?: { [key: string]: string[] };
  selectedColumns?: IPortfolioOverviewColumnConfig[];
  errorMessage?: IPortfolioOverviewErrorMessage;
  canUserManageWeb?: boolean;
}
