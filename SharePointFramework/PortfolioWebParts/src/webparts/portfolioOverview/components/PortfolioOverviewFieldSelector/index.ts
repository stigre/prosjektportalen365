import * as strings from 'PortfolioOverviewWebPartStrings';
import { IPortfolioOverviewFilter } from '../PortfolioOverviewFilterPanel/PortfolioOverviewFilter/PortfolioOverviewFilter';

const DynamicPortfolioFieldSelector: IPortfolioOverviewFilter = {
    fieldName: "Fields",
    name: strings.FieldSelectorName,
    key: "Fields",
    emptyMessage: strings.FieldSelectorEmptyMessage,
    multi: true,
    defaultHidden: false,
    iconName: "ShowResults",
    items: [],
};

export default DynamicPortfolioFieldSelector;
