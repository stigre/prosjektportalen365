import { override } from '@microsoft/decorators';
import { BaseTask, IBaseTaskParams, BaseTaskError } from '../BaseTask';
import { Logger, LogLevel } from '@pnp/logging';
import HubSiteService from 'sp-hubsite-service';
import SpEntityPortalService from 'sp-entityportal-service';

export default class SetupProjectInformation extends BaseTask {
    @override
    public async execute(params: IBaseTaskParams) {
        super.execute(params);
        try {
            Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupProjectInformation', level: LogLevel.Info });
            const spEntityPortalService = new SpEntityPortalService({ webUrl: params.hub.url, listName: 'Prosjekter', groupIdFieldName: 'GtGroupId' });
            Logger.log({ message: `(ProjectSetupApplicationCustomizer) SetupProjectInformation: Adding project to list 'Prosjekter' at ${params.hub.url}`, data: { groupId: params.groupId }, level: LogLevel.Info });
            await spEntityPortalService.NewEntity(params.context.pageContext.web.title, params.groupId);
        } catch (error) {
            throw new BaseTaskError('SetupProjectInformation', 'Unknown error');
        }
    }
}