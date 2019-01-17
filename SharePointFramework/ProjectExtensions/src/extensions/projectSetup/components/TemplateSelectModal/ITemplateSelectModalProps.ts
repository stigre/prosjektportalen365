
import { IModalProps } from 'office-ui-fabric-react/lib/Modal';
import ProjectTemplate from '../../models/ProjectTemplate';

export interface ITemplateSelectModalProps extends IModalProps {
    templates: ProjectTemplate[];
    onTemplateSelected: (template: any) => void;
}
