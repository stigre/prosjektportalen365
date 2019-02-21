import IPortfolioOverviewFilter from './PortfolioOverviewFilter/IPortfolioOverviewFilter';

export default interface IPortfolioOverviewFilterPanelProps {
  filters: IPortfolioOverviewFilter[];
  onFilterChange: (filter: IPortfolioOverviewFilter) => void;
  onDismiss: () => void;
  isOpen: boolean;
  showIcons?: boolean;
}
