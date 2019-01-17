import { ApplicationCustomizerContext } from '@microsoft/sp-application-base';
import { IProjectSetupApplicationCustomizerProperties } from '../IProjectSetupApplicationCustomizerProperties';
import IProjectSetupApplicationCustomizerData from '../IProjectSetupApplicationCustomizerData';

export interface IBaseTaskParams {
    context: ApplicationCustomizerContext;
    properties: IProjectSetupApplicationCustomizerProperties;
    data: IProjectSetupApplicationCustomizerData;
}

export class BaseTaskError {
    constructor(
        public task: string,
        public message: string,
    ) {
        this.task = task;
        this.message = message;
    }
}

export class BaseTask {
    public params: IBaseTaskParams;

    constructor(public name?: string) {
        this.name = name;
        this.params = null;
    }

    public async execute(params: IBaseTaskParams, _onProgress?: (status: string) => void): Promise<void> {
        this.params = params;
    }
}