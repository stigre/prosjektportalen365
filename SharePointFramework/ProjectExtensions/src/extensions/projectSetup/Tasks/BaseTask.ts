import { ApplicationCustomizerContext } from '@microsoft/sp-application-base';
import { IProjectSetupApplicationCustomizerProperties } from '../IProjectSetupApplicationCustomizerProperties';

export interface IBaseTaskParams {
    context: ApplicationCustomizerContext;
    properties: IProjectSetupApplicationCustomizerProperties;
}

export class BaseTask {
    public params: IBaseTaskParams;

    constructor() {
        this.params = null;
    }

    public async execute(params: IBaseTaskParams): Promise<void> {
        this.params = params;
    }
}