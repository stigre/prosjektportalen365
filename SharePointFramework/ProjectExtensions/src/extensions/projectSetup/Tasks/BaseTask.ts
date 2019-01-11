import { ApplicationCustomizerContext } from '@microsoft/sp-application-base';
import { IProjectSetupApplicationCustomizerProperties } from '../IProjectSetupApplicationCustomizerProperties';
import { IHubSite } from 'sp-hubsite-service';

export interface IBaseTaskParams {
    context: ApplicationCustomizerContext;
    properties: IProjectSetupApplicationCustomizerProperties;
    groupId: string;
    hub: IHubSite;
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

    constructor() {
        this.params = null;
    }

    public async execute(params: IBaseTaskParams): Promise<void> {
        this.params = params;
    }
}