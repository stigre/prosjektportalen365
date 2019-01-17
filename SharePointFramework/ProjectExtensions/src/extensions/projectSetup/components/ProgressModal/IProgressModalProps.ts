
import { IModalProps } from 'office-ui-fabric-react/lib/Modal';
import { IProgressIndicatorProps } from 'office-ui-fabric-react/lib/ProgressIndicator';
import { IBaseTaskParams } from '../../tasks/IBaseTaskParams';

export interface IProgressModalProps extends IModalProps {
    progressIndicatorProps: IProgressIndicatorProps;
    taskParams: IBaseTaskParams;
}
