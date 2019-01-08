import { ClientSideWebpart } from '@pnp/sp';

export interface ISetupPagesConfiguration {
    Pages: { [key: string]: any };
    WelcomePage: string;
}

export function GetSetupPagesConfiguration(listsMap: { [key: string]: string }): ISetupPagesConfiguration {
    const Pages = {
        "Hjem": {
            PageLayoutType: 'Home',
            Sections: [
                {
                    Columns: [
                        {
                            factor: 8,
                            controls: [new ClientSideWebpart('Documents', null, { isDocumentLibrary: true, selectedListId: listsMap['Prosjektdokumenter'], webpartHeightKey: 4 }, 'f92bf067-bc19-489e-a556-7fe95f508720')]
                        },
                        {
                            Factor: 4,
                            Controls: [new ClientSideWebpart('List', null, { isDocumentLibrary: false, selectedListId: listsMap['Usikkerhet'], webpartHeightKey: 4 }, 'f92bf067-bc19-489e-a556-7fe95f508720')]
                        }
                    ]
                }
            ],
        },
        "Gevinstoversikt": {
            PageLayoutType: 'SingleWebPartAppPage',
            Sections: [
                {
                    Columns: [
                        {
                            Factor: 12,
                            Controls: [new ClientSideWebpart('Custom', null, {}, 'c7ff77cd-07e3-435e-971a-8845fa28ba8e')]
                        },
                    ]
                }
            ],
        },
        "Prosjektstatus": {
            PageLayoutType: 'SingleWebPartAppPage',
            Sections: [
                {
                    Columns: [
                        {
                            Factor: 12,
                            Controls: [new ClientSideWebpart('Custom', null, {}, '681ad0dc-ddb5-4dba-a5d6-a42f6d1c90a6')]
                        },
                    ]
                }
            ],
        }
    };
    const WelcomePage = 'SitePages/Hjem.aspx';
    return { Pages, WelcomePage };
}