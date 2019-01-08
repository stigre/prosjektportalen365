import { override } from '@microsoft/decorators';
import { BaseTask, IBaseTaskParams } from '../BaseTask';
import { sp } from '@pnp/sp';
import { Logger, LogLevel } from '@pnp/logging';
import SetupPagesDefaultConfig from './SetupPagesDefaultConfig';

export class SetupPages extends BaseTask {
    @override
    public async execute(params: IBaseTaskParams) {
        super.execute(params);
        Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupPages', level: LogLevel.Info });
        const sitePages = sp.web.getList(`${params.context.pageContext.web.serverRelativeUrl}/SitePages`);
        for (let i = 0; i < SetupPagesDefaultConfig.SitePages.length; i++) {
            const {Id,Properties} = SetupPagesDefaultConfig.SitePages[i];
            await sitePages.items.getById(Id).update(Properties);
        }
    }
}

export default new SetupPages;