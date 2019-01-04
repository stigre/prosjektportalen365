import { override } from '@microsoft/decorators';
import { BaseTask, IBaseTaskConfig } from "./BaseTask";
import { sp } from "@pnp/sp";

export class SetQuickLaunch extends BaseTask {
    @override
    public async execute(config: IBaseTaskConfig) {
        super.execute(config);
        return;
    }
}

export default new SetQuickLaunch;