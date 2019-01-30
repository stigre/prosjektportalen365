import { override } from '@microsoft/decorators';
import { BaseTask, OnProgressCallbackFunction } from '../BaseTask';
import { Logger, LogLevel } from '@pnp/logging';
import { IBaseTaskParams } from '../IBaseTaskParams';
import { BaseTaskError } from '../BaseTaskError';
import SpEntityPortalService from 'sp-entityportal-service';

export default class SetupProjectInformation extends BaseTask {
    constructor() {
        super('SetupProjectInformation');
    }

    @override
    public async execute(params: IBaseTaskParams, _onProgress: OnProgressCallbackFunction): Promise<IBaseTaskParams> {
        try {
            const { groupId } = params.context.pageContext.legacyPageContext;
            const spEntityPortalService = new SpEntityPortalService({
                webUrl: params.data.hub.url,
                listName: params.properties.projectsList,
                groupIdFieldName: 'GtGroupId',
                siteUrlFieldName: 'GtSiteUrl',
            });
            Logger.log({ message: `(ProjectSetupApplicationCustomizer) SetupProjectInformation: Adding project to list '${params.properties.projectsList}' at ${params.data.hub.url}`, data: { groupId: groupId }, level: LogLevel.Info });
            const entity = await spEntityPortalService.newEntity(params.context.pageContext, params.data.hub.url);
            return { ...params, entity };
        } catch (error) {
            throw new BaseTaskError('SetupProjectInformation', 'Unknown error');
        }
    }
}