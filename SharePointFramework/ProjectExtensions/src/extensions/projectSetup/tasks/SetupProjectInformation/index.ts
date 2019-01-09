import { override } from '@microsoft/decorators';
import { BaseTask, IBaseTaskParams } from '../BaseTask';
import { Web } from '@pnp/sp';
import { Logger, LogLevel } from '@pnp/logging';
import HubSiteService from '../../../../../../services/HubSiteService';

export class SetupProjectInformation extends BaseTask {
    @override
    public async execute(params: IBaseTaskParams) {
        super.execute(params);
        Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupProjectInformation', level: LogLevel.Info });
        const { pageContext } = params.context;
        const hubSite = await HubSiteService.GetHubSiteById(pageContext.web.absoluteUrl, pageContext.legacyPageContext.hubSiteId);
        Logger.log({ message: `(ProjectSetupApplicationCustomizer) SetupProjectInformation: Retrieved hub site at ${hubSite.SiteUrl}`, level: LogLevel.Info });
        const hubSiteRootWeb = new Web(hubSite.SiteUrl);
        const projectsList = hubSiteRootWeb.lists.getByTitle('Prosjekter');
        const projectItem = { Title: pageContext.web.title, GtGroupId: pageContext.legacyPageContext.groupId };
        Logger.log({ message: `(ProjectSetupApplicationCustomizer) SetupProjectInformation: Adding project to list 'Prosjekter' at ${hubSite.SiteUrl}`, data: { projectItem }, level: LogLevel.Info });
        await projectsList.items.add(projectItem);
    }
}

export default new SetupProjectInformation;