import * as React from 'react';
import * as strings from 'PortfolioOverviewWebPartStrings';
import {
    Panel,
    PanelType,
} from 'office-ui-fabric-react/lib/Panel';
import PortfolioOverviewFilter, { IPortfolioOverviewFilter } from './PortfolioOverviewFilter/PortfolioOverviewFilter';
import IPortfolioOverviewFilterPanelProps from './IPortfolioOverviewFilterPanelProps';

/**
 * PortfolioOverviewFilter Panel
 *
 * @param {IPortfolioOverviewFilterPanelProps} props Props
 */
const PortfolioOverviewFilterPanel = ({ filters, onFilterChange, onDismiss, isOpen, showIcons }: IPortfolioOverviewFilterPanelProps) => {
    return (
        <Panel
            isOpen={isOpen}
            isBlocking={true}
            onDismiss={onDismiss}
            headerText={strings.FiltersString}
            type={PanelType.smallFixedFar}>
            <div className='ms-Grid'>
                {filters
                    .filter(filter => filter.items.length > 1)
                    .map((filter, idx) => (
                        <PortfolioOverviewFilter
                            key={idx}
                            filter={filter}
                            onFilterChange={onFilterChange} />
                    ))}
            </div>
        </Panel>);
};

export default PortfolioOverviewFilterPanel;
export { IPortfolioOverviewFilter };
