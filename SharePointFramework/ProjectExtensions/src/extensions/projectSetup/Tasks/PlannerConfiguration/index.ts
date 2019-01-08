import { override } from '@microsoft/decorators';
import { BaseTask, IBaseTaskParams } from '../BaseTask';
import { sp } from '@pnp/sp';
import { Logger, LogLevel } from '@pnp/logging';

export class PlannerConfiguration extends BaseTask {
    @override
    public async execute(params: IBaseTaskParams) {
        super.execute(params);
        Logger.log({ message: '(ProjectSetupApplicationCustomizer) PlannerConfiguration', level: LogLevel.Info });
    }
}

export default new PlannerConfiguration;