import ProjectTemplate from "./models/ProjectTemplate";
import { IHubSite } from 'sp-hubsite-service';

export default interface IProjectSetupApplicationCustomizerData {
    templates?: ProjectTemplate[];
    selectedTemplate?: ProjectTemplate;
    hub?: IHubSite;
}