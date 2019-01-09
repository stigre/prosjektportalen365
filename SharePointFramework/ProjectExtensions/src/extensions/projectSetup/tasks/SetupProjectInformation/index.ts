import { override } from '@microsoft/decorators';
import { BaseTask, IBaseTaskParams } from '../BaseTask';
import { Logger, LogLevel } from '@pnp/logging';
import HubSiteService from 'sp-hubsite-service';
import SpEntityPortalService from 'sp-entityportal-service';

export class SetupProjectInformation extends BaseTask {
    @override
    public async execute(params: IBaseTaskParams) {
        super.execute(params);
        Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupProjectInformation', level: LogLevel.Info });
        const { pageContext } = params.context;
        const { hubSiteId, groupId } = pageContext.legacyPageContext;
        Logger.log({ message: `(ProjectSetupApplicationCustomizer) SetupProjectInformation: Retrieving hub site`, data: { webAbsoluteUrl: pageContext.web.absoluteUrl, hubSiteId }, level: LogLevel.Info });
        const hubSite = await HubSiteService.GetHubSiteById(pageContext.web.absoluteUrl, hubSiteId);
        Logger.log({ message: `(ProjectSetupApplicationCustomizer) SetupProjectInformation: Retrieved hub site`, data: { hubSite }, level: LogLevel.Info });
        const spEntityPortalService = new SpEntityPortalService(hubSite.SiteUrl, 'Prosjekter', 'GtGroupId');
        Logger.log({ message: `(ProjectSetupApplicationCustomizer) SetupProjectInformation: Adding project to list 'Prosjekter' at ${hubSite.SiteUrl}`, data: { groupId }, level: LogLevel.Info });
        await spEntityPortalService.NewEntity(pageContext.web.title, groupId);
    }
}

export default new SetupProjectInformation;