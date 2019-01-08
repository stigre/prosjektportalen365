import { override } from '@microsoft/decorators';
import { BaseTask, IBaseTaskParams } from '../BaseTask';
import { sp, ClientSideWebpart } from '@pnp/sp';
import { Logger, LogLevel } from '@pnp/logging';
import { GetSetupPagesConfiguration, ISetupPagesConfiguration } from './SetupPagesConfiguration';

export class SetupPages extends BaseTask {
    @override
    public async execute(params: IBaseTaskParams) {
        super.execute(params);
        Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupPages', level: LogLevel.Info });
        let lists = await sp.web.lists.select('Title', 'Id').get();
        let listsMap = lists.reduce((map, list) => {
            map[list.Title] = list.Id;
            return map;
        }, {});
        Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupPages: Retrieved lists', data: { listsMap }, level: LogLevel.Info });

        // let [home, benefitsOverview, projectStatus] = await Promise.all([
        //     sp.web.addClientSidePage('Hjem.aspx', 'Hjem'),
        //     sp.web.addClientSidePage('Gevinstoversikt.aspx', 'Gevinstoversikt'),
        //     sp.web.addClientSidePage('Prosjektstatus.aspx', 'Prosjektstatus'),
        // ]);
        // const homeSection = home.addSection();
        // homeSection.addColumn(8).addControl(new ClientSideWebpart('Documents', null, { isDocumentLibrary: true, selectedListId: listsMap['Prosjektdokumenter'], webpartHeightKey: 4 }, 'f92bf067-bc19-489e-a556-7fe95f508720'));
        // homeSection.addColumn(4).addControl(new ClientSideWebpart('List', null, { isDocumentLibrary: false, selectedListId: listsMap['Usikkerhet'], webpartHeightKey: 4 }, 'f92bf067-bc19-489e-a556-7fe95f508720'));
        // await home.save();

        // benefitsOverview.addSection().addColumn(12).addControl(new ClientSideWebpart('Custom', null, {}, 'c7ff77cd-07e3-435e-971a-8845fa28ba8e'));
        // await benefitsOverview.save();

        // projectStatus.addSection().addColumn(12).addControl(new ClientSideWebpart('Custom', null, {}, '681ad0dc-ddb5-4dba-a5d6-a42f6d1c90a6'));
        // await projectStatus.save();

        // let [homeItem, benfitsOverviewItem, projectStatusItem] = await Promise.all([
        //     home.getItem(),
        //     benefitsOverview.getItem(),
        //     projectStatus.getItem(),
        // ]);

        // await Promise.all([
        //     homeItem.update({ PageLayoutType: 'Home' }),
        //     benfitsOverviewItem.update({ PageLayoutType: 'SingleWebPartAppPage' }),
        //     projectStatusItem.update({ PageLayoutType: 'SingleWebPartAppPage' }),
        // ]);
        const config = GetSetupPagesConfiguration(listsMap);
        await this.createPages(config);
        await this.setWelcomePage(config);
    }

    private async setWelcomePage(config: ISetupPagesConfiguration) {
        await sp.web.rootFolder.update({ WelcomePage: config.WelcomePage });
    }

    private async createPages(config: ISetupPagesConfiguration) {
        const pageNames = Object.keys(config.Pages);
        const clientSidePages = await Promise.all(pageNames.map(async (name) => {
            Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupPages: Adding client side page', data: { name }, level: LogLevel.Info });
            return await sp.web.addClientSidePage(`${name}.aspx`, name);
        }));
        await Promise.all(pageNames.map(async (name, index) => {
            const { Sections } = config.Pages[name];
            const clientSidePage = clientSidePages[index];
            for (let i = 0; i < Sections.length; i++) {
                Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupPages: Adding section to client side page', data: { name, i }, level: LogLevel.Info });
                const { Columns } = Sections[i];
                const section = clientSidePage.addSection();
                for (let j = 0; j < Columns.length; j++) {
                    Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupPages: Adding column to client side page', data: { name, i, j }, level: LogLevel.Info });
                    const { Factor, Controls } = Columns[j];
                    const column = section.addColumn(Factor);
                    for (let k = 0; k < Controls.length; k++) {
                        Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupPages: Adding control to client side page', data: { name, i, j, k }, level: LogLevel.Info });
                        column.addControl(Controls[k]);
                    }
                }
            }
            await clientSidePage.save();
        }));
        await Promise.all(pageNames.map(async (name, index) => {
            const { PageLayoutType } = config.Pages[name];
            Logger.log({ message: '(ProjectSetupApplicationCustomizer) SetupPages: Setting PageLayoutType for client side page', data: { name, PageLayoutType }, level: LogLevel.Info });
            const item = await clientSidePages[index].getItem();
            await item.update({ PageLayoutType });
        }));
    }
}

export default new SetupPages;