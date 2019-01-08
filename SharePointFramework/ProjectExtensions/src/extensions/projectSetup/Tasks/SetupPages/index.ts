import { override } from '@microsoft/decorators';
import { BaseTask, IBaseTaskParams } from '../BaseTask';
import { sp, ClientSidePage } from '@pnp/sp';
import { Logger, LogLevel } from '@pnp/logging';
import { GetSetupPagesConfiguration, ISetupPagesConfiguration } from './SetupPagesConfiguration';

export class SetupPages extends BaseTask {
    constructor() {
        super();
    }

    @override
    public async execute(params: IBaseTaskParams) {
        super.execute(params);
        Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupPages/execute', level: LogLevel.Info });
        let lists = await sp.web.lists.select('Title', 'Id').get();
        let listsMap = lists.reduce((map, list) => {
            map[list.Title] = list.Id;
            return map;
        }, {});
        Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupPages/execute: Retrieved lists', data: {}, level: LogLevel.Info });
        const config = GetSetupPagesConfiguration(listsMap);
        await this.createPages(config);
    }

    /**
     *  Create pages
     * 
     * @param {ISetupPagesConfiguration} config Configuration
     */
    private async createPages(config: ISetupPagesConfiguration) {
        const pageNames = Object.keys(config.Pages);
        const clientSidePages = await Promise.all(pageNames.map(async (name) => {
            const fileServerRelativeUrl = `${this.params.context.pageContext.web.serverRelativeUrl}/SitePages/${name}.aspx`;
            Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupPages/createPages: Fetching client side page', data: { name, fileServerRelativeUrl }, level: LogLevel.Info });
            const file = await sp.web.getFileByServerRelativeUrl(fileServerRelativeUrl);
            const clientSidePage = await ClientSidePage.fromFile(file);
            return clientSidePage;
        }));
        Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupPages/createPages: Client side pages fetched', level: LogLevel.Info });
        await Promise.all(pageNames.map(async (name, index) => {
            const { Sections } = config.Pages[name];
            const clientSidePage = clientSidePages[index];
            for (let i = 0; i < Sections.length; i++) {
                Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupPages/createPages: Adding section to client side page', data: { name, i }, level: LogLevel.Info });
                const { Columns } = Sections[i];
                const section = clientSidePage.addSection();
                for (let j = 0; j < Columns.length; j++) {
                    Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupPages/createPages: Adding column to client side page', data: { name, i, j }, level: LogLevel.Info });
                    const { Factor, Controls } = Columns[j];
                    const column = section.addColumn(Factor);
                    for (let k = 0; k < Controls.length; k++) {
                        Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupPages/createPages: Adding control to client side page', data: { name, i, j, k }, level: LogLevel.Info });
                        column.addControl(Controls[k]);
                    }
                }
            }
            Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupPages/createPages: Saving client side page', data: { name }, level: LogLevel.Info });
            await clientSidePage.save();
            await clientSidePage.disableComments();
        }));
        await Promise.all(pageNames.map(async (name, index) => {
            const { PageLayoutType } = config.Pages[name];
            Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupPages/createPages: Setting PageLayoutType for client side page', data: { name, PageLayoutType }, level: LogLevel.Info });
            const item = await clientSidePages[index].getItem();
            await item.update({ PageLayoutType });
        }));
    }
}

export default new SetupPages;