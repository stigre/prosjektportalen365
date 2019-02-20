import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IDeliveriesOverviewProps {
    dataSource: string;
    context: WebPartContext;
    columns?: IColumn[];
}

export const DeliveriesOverviewDefaultProps: Partial<IDeliveriesOverviewProps> = {
    columns: [{
        key: 'Title',
        fieldName: 'Title',
        name: 'Tittel',
        minWidth: 220,
        maxWidth: 300,
        isMultiline: true,
        isResizable: true,
    },
    {
        key: 'SiteTitle',
        fieldName: 'SiteTitle',
        name: 'Prosjekt',
        minWidth: 220,
        isMultiline: true,
        isResizable: true,
    },
    {
        key: 'GtProductDescriptionOWSMTXT',
        fieldName: 'GtProductDescriptionOWSMTXT',
        name: 'Leveransebeskrivelse',
        minWidth: 220,
        isMultiline: true,
        isResizable: true,
    },
    {
        key: 'GtProductStartTimeOWSDATE',
        fieldName: 'GtProductStartTimeOWSDATE',
        name: 'Starttidspunkt',
        minWidth: 100,
        isMultiline: false,
        isResizable: true,
    },
    {
        key: 'GtProductEndTimeOWSDATE',
        fieldName: 'GtProductEndTimeOWSDATE',
        name: 'Sluttidspunkt',
        minWidth: 100,
        isMultiline: false,
        isResizable: true,
    },
    {
        key: 'GtProductStatusOWSCHCS',
        fieldName: 'GtProductStatusOWSCHCS',
        name: 'Leveransestatus',
        minWidth: 100,
        isMultiline: false,
        isResizable: true,
    },
    {
        key: 'GtProductStatusCommentOWSMTXT',
        fieldName: 'GtProductStatusCommentOWSMTXT',
        name: 'Kommentar, leveransestatus',
        minWidth: 220,
        isMultiline: true,
        isResizable: true,
    }],
};
