
import { IModalProps } from 'office-ui-fabric-react/lib/Modal';
import IProjectSetupApplicationCustomizerData from '../../IProjectSetupApplicationCustomizerData';
import { ITemplateSelectModalState } from './ITemplateSelectModalState';

export interface ITemplateSelectModalProps extends IModalProps {
    data: IProjectSetupApplicationCustomizerData;
    onSubmit: (state: ITemplateSelectModalState) => void;
}
