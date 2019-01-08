import { override } from '@microsoft/decorators';
import { BaseTask, IBaseTaskParams } from '../BaseTask';
import { Logger, LogLevel } from '@pnp/logging';

export class SetupViews extends BaseTask {
    @override
    public async execute(params: IBaseTaskParams) {
        super.execute(params);
        Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupViews', level: LogLevel.Info });
    }
}

export default new SetupViews;