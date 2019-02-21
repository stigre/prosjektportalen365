import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import IGroupByOption from '../../../common/interfaces/IGroupByOption';

export interface IRiskOverviewProps {
    columns?: IColumn[];
    groupByOptions?: IGroupByOption[];
    excelExportEnabled?: boolean;
}

export const RiskOverviewDefaultProps: Partial<IRiskOverviewProps> = {
    columns: [{
        key: 'Title',
        fieldName: 'Title',
        name: 'Tittel',
        minWidth: 220,
        maxWidth: 300,
        isMultiline: true,
        isResizable: true,
    }],
    excelExportEnabled: true,
};