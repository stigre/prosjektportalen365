import { override } from '@microsoft/decorators';
import { Dialog } from '@microsoft/sp-dialog';
import { BaseTask, IBaseTaskParams } from "../BaseTask";

export class CheckHubAssosication extends BaseTask {
    @override
    public async execute(params: IBaseTaskParams) {
        super.execute(params);
        // if (params.context.pageContext.legacyPageContext.hubSiteId) {
            
        // }
    }
}

export default new CheckHubAssosication;