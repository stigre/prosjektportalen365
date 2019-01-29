
import { IModalProps } from 'office-ui-fabric-react/lib/Modal';
import IProjectSetupApplicationCustomizerData from '../../IProjectSetupApplicationCustomizerData';

export interface ITemplateSelectModalProps extends IModalProps {
    data: IProjectSetupApplicationCustomizerData;
    onSubmit: (data: IProjectSetupApplicationCustomizerData) => void;
}
