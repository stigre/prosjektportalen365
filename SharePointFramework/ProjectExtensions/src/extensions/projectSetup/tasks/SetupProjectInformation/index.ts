import { override } from '@microsoft/decorators';
import { BaseTask, IBaseTaskParams } from '../BaseTask';
import { sp } from '@pnp/sp';
import { Logger, LogLevel } from '@pnp/logging';

export class SetupProjectInformation extends BaseTask {
    @override
    public async execute(params: IBaseTaskParams) {
        super.execute(params);
        Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupProjectInformation', level: LogLevel.Info });
        const list = sp.web.lists.getByTitle('Prosjektegenskaper');
        const { ListItemEntityTypeFullName } = await list.select('ListItemEntityTypeFullName').get();
        await list.items.add({ ContentTypeId: '0x0100BE5932D2FEE7174E8638FF16FB5AC913' }, ListItemEntityTypeFullName);
    }
}

export default new SetupProjectInformation;