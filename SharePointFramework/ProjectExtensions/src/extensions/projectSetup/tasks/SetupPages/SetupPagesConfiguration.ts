import { ClientSideWebpart, CanvasColumnFactorType } from '@pnp/sp';

export interface IClientSidePageColumn {
    Factor: CanvasColumnFactorType;
    Controls: ClientSideWebpart[];
}

export interface IClientSidePageSection {
    Columns: IClientSidePageColumn[];
}

export interface IClientSidePage {
    PageLayoutType: string;
    Sections: IClientSidePageSection[];
}

export interface ISetupPagesConfiguration {
    Pages: { [key: string]: IClientSidePage };
}

export function GetSetupPagesConfiguration(listsMap: { [key: string]: string }): ISetupPagesConfiguration {
    const Pages: { [key: string]: IClientSidePage } = {
        "Hjem": {
            PageLayoutType: 'Home',
            Sections: [
                {
                    Columns: [
                        {
                            Factor: 12,
                            Controls: [new ClientSideWebpart('Custom', null, {
                                description: "",
                                phaseSubTextProperty: "",
                                phaseField: "GtProjectPhase",
                                automaticReload: true,
                                confirmPhaseChange: true,
                                reloadTimeout: 2,
                                updateViewsDocuments: false,
                                updateViewsTasks: false,
                                updateViewsRisks: false,
                                gutter: 10,
                                fontSize: 12
                            }, '4449d3dc-fa58-4982-b87c-5a893114e7b7')]
                        },
                    ],
                },
                {
                    Columns: [
                        {
                            Factor: 8,
                            Controls: [new ClientSideWebpart('Documents', null, { isDocumentLibrary: true, selectedListId: listsMap['Prosjektdokumenter'], webpartHeightKey: 4 }, 'f92bf067-bc19-489e-a556-7fe95f508720')]
                        },
                        {
                            Factor: 4,
                            Controls: [
                                new ClientSideWebpart('Custom', null, { title: 'Prosjektinformasjon' }, 'b8bec0be-2354-443d-a3ca-24b36e8ea7dc'),
                                new ClientSideWebpart('List', null, { isDocumentLibrary: false, selectedListId: listsMap['Usikkerhet'], webpartHeightKey: 4 }, 'f92bf067-bc19-489e-a556-7fe95f508720'),
                            ]
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
    return { Pages };
}