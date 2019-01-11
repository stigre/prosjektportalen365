import { override } from '@microsoft/decorators';
import { Dialog } from '@microsoft/sp-dialog';
import { BaseTask, IBaseTaskParams, BaseTaskError } from "../BaseTask";

export default class CheckHubAssosication extends BaseTask {
    @override
    public async execute(params: IBaseTaskParams) {
        super.execute(params);
        if (!params.context.pageContext.legacyPageContext.hubSiteId) {
            throw new BaseTaskError('CheckHubAssosication', 'Missing hub site association.');
        }
    }
}