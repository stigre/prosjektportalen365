import { override } from '@microsoft/decorators';
import { Dialog } from '@microsoft/sp-dialog';
import { BaseTask, IBaseTaskConfig } from "./BaseTask";

export class CheckHubAssosication extends BaseTask {
    @override
    public async execute(config: IBaseTaskConfig) {
        super.execute(config);
        if (config.context.pageContext.legacyPageContext.hubSiteId) {
            await Dialog.alert(config.context.pageContext.legacyPageContext.hubSiteId);
        }
        return;
    }
}

export default new CheckHubAssosication;