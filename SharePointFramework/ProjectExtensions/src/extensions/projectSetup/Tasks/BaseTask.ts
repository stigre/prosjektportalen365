import { ApplicationCustomizerContext } from '@microsoft/sp-application-base';
import { IProjectSetupApplicationCustomizerProperties } from '../ProjectSetupApplicationCustomizer';

export interface IBaseTaskConfig {
    context: ApplicationCustomizerContext;
    properties: IProjectSetupApplicationCustomizerProperties;
}

export class BaseTask {
    public async execute(config: IBaseTaskConfig): Promise<void> {
        return;
    }
}