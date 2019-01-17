import { override } from '@microsoft/decorators';
import { BaseTask } from '../BaseTask';
import { Logger, LogLevel } from '@pnp/logging';
import { IBaseTaskParams } from '../IBaseTaskParams';

export default class PlannerConfiguration extends BaseTask {
    constructor() {
        super('PlannerConfiguration');
    }

    @override
    public async execute(params: IBaseTaskParams, _onProgress: (status: string) => void): Promise<IBaseTaskParams> {
        Logger.log({ message: '(ProjectSetupApplicationCustomizer) PlannerConfiguration', level: LogLevel.Info });
        return params;
    }
}
