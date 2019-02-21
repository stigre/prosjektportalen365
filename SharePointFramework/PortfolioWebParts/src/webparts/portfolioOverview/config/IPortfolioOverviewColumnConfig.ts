import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';

export default interface IPortfolioOverviewColumnConfig extends IColumn {
    readOnly: boolean;
    render: 'Date' | 'Note' | 'Currency' | 'Status' | 'Default';
    groupBy?: boolean;
}
