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
                            Controls: [new ClientSideWebpart('Fasevelger', null, {
                                description: "",
                                phaseSubTextProperty: "",
                                phaseField: "Fase",
                                automaticReload: true,
                                confirmPhaseChange: true,
                                reloadTimeout: 0,
                                updateViewsDocuments: false,
                                updateViewsTasks: false,
                                updateViewsRisks: false,
                                gutter: 15,
                                fontSize: 12
                            }, '4449d3dc-fa58-4982-b87c-5a893114e7b7')]
                        },
                    ],
                },
                {
                    Columns: [
                        {
                            Factor: 8,
                            Controls: [new ClientSideWebpart('Prosjektdokumenter', null, { isDocumentLibrary: true, selectedListId: listsMap['Prosjektdokumenter'], webpartHeightKey: 4 }, 'f92bf067-bc19-489e-a556-7fe95f508720')]
                        },
                        {
                            Factor: 4,
                            Controls: [
                                new ClientSideWebpart('Prosjektinformasjon', null, {
                                    title: 'Prosjektinformasjon',
                                    entityListName: 'Prosjekter',
                                    entityCtId: '0x0100805E9E4FEAAB4F0EABAB2600D30DB70C',
                                    entityFieldsGroup: 'Prosjektportalenkolonner',
                                }, 'b8bec0be-2354-443d-a3ca-24b36e8ea7dc'),
                                new ClientSideWebpart('Usikkerhet', null, { isDocumentLibrary: false, selectedListId: listsMap['Usikkerhet'], webpartHeightKey: 4 }, 'f92bf067-bc19-489e-a556-7fe95f508720')
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
                            Controls: [new ClientSideWebpart('Gevinstoversikt', null, {}, 'c7ff77cd-07e3-435e-971a-8845fa28ba8e')]
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
                            Controls: [new ClientSideWebpart('Prosjektstatus', null, {
                                title: "Prosjektstatus",
                                reportListName: "Prosjektstatus",
                                reportCtId: "0x010022252E35737A413FB56A1BA53862F6D5",
                                projectInformation: {
                                    entityListName: 'Prosjekter',
                                    entityCtId: '0x0100805E9E4FEAAB4F0EABAB2600D30DB70C',
                                    entityFieldsGroup: 'Prosjektportalenkolonner',
                                },
                            }, '681ad0dc-ddb5-4dba-a5d6-a42f6d1c90a6')]
                        },
                    ]
                }
            ],
        }
    };
    return { Pages };
}