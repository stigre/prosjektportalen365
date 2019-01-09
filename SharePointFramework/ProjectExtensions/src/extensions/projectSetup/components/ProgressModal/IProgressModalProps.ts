
import { IModalProps } from 'office-ui-fabric-react/lib/Modal';
import { IProgressIndicatorProps } from 'office-ui-fabric-react/lib/ProgressIndicator';

export interface IProgressModalProps extends IModalProps {
    progressIndicatorProps: IProgressIndicatorProps;
}
