import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { IRiskOverviewWebPartProps } from '../IRiskOverviewWebPartProps';

export interface IRiskOverviewProps extends IRiskOverviewWebPartProps {
    columns?: IColumn[];
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
};