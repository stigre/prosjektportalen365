import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IDeliveriesOverviewProps {
    dataSource: string;
    context: WebPartContext;
    columns?: IColumn[];
}

export const DeliveriesOverviewDefaultProps: Partial<IDeliveriesOverviewProps> = {
    columns: [{
        key: "Title",
        fieldName: "Title",
        name: "Title",
        minWidth: 220,
        isMultiline: true,
    },
    {
        key: "SiteTitle",
        fieldName: "SiteTitle",
        name: "SiteTitle",
        minWidth: 220,
        isMultiline: true,
        isResizable: true,
    },
    {
        key: "GtProductDescriptionOWSMTXT",
        fieldName: "GtProductDescriptionOWSMTXT",
        name: "GtProductDescriptionOWSMTXT",
        minWidth: 220,
        isMultiline: true,
        isResizable: true,
    },
    {
        key: "GtProductStartTimeOWSDATE",
        fieldName: "GtProductStartTimeOWSDATE",
        name: "GtProductStartTimeOWSDATE",
        minWidth: 100,
        isMultiline: false,
        isResizable: true,
    },
    {
        key: "GtProductEndTimeOWSDATE",
        fieldName: "GtProductEndTimeOWSDATE",
        name: "GtProductEndTimeOWSDATE",
        minWidth: 100,
        isMultiline: false,
        isResizable: true,
    },
    {
        key: "GtProductStatusOWSCHCS",
        fieldName: "GtProductStatusOWSCHCS",
        name: "GtProductStatusOWSCHCS",
        minWidth: 100,
        isMultiline: false,
        isResizable: true,
    },
    {
        key: "GtProductStatusCommentOWSMTXT",
        fieldName: "GtProductStatusCommentOWSMTXT",
        name: "GtProductStatusCommentOWSMTXT",
        minWidth: 220,
        isMultiline: true,
        isResizable: true,
    }],
};
