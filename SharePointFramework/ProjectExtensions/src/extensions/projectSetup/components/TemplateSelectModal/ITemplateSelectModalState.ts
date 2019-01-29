
import ProjectTemplate from '../../models/ProjectTemplate';
import ListContentConfig from '../../models/ListContentConfig';

export interface ITemplateSelectModalState {
    selectedTemplate: ProjectTemplate;
    selectedExtensions: ProjectTemplate[];
    selectedListConfig: ListContentConfig[];
    listContentHidden: boolean;
    extensionsHidden: boolean;
}
