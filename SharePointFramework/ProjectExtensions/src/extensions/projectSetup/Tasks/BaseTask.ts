import { ApplicationCustomizerContext } from '@microsoft/sp-application-base';
import { IProjectSetupApplicationCustomizerProperties } from '../IProjectSetupApplicationCustomizerProperties';

export interface IBaseTaskParams {
    context: ApplicationCustomizerContext;
    properties: IProjectSetupApplicationCustomizerProperties;
}

export class BaseTask {
    public async execute(config: IBaseTaskParams): Promise<void> {
        return;
    }
}