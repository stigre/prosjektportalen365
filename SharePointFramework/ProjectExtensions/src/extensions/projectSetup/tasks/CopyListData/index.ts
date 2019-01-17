import { sp, Web } from '@pnp/sp';
import { override } from '@microsoft/decorators';
import { BaseTask } from '../BaseTask';
import * as strings from 'ProjectSetupApplicationCustomizerStrings';
import * as stringFormat from 'string-format';
import { IBaseTaskParams } from '../IBaseTaskParams';
import { BaseTaskError } from '../BaseTaskError';
import ListContentConfig from '../../models/ListContentConfig';

export default class CopyListData extends BaseTask {
    constructor() {
        super('CopyListData');
    }

    @override
    public async execute(params: IBaseTaskParams, onProgress: (status: string) => void): Promise<IBaseTaskParams> {
        try {
            for (let i = 0; i < params.data.selectedListConfig.length; i++) {
                onProgress(stringFormat(strings.CopyListDataText, params.data.selectedListConfig[i].sourceList, params.data.selectedListConfig[i].destinationLibrary || params.data.selectedListConfig[i].destinationList));
                await this.processListItems(params.data.selectedListConfig[i]);
            }
            return params;
        } catch (error) {
            throw new BaseTaskError('CopyListData', 'Unknown error');
        }
    }

    private async processListItems(listConfig: ListContentConfig) {
        let sourceItems = await (listConfig.web as Web).lists.getByTitle(listConfig.sourceList).get<any[]>();
        let destList = sp.web.lists.getByTitle(listConfig.destinationList);
        let destListItemEntityTypeFullName = (await destList.select('ListItemEntityTypeFullName').get<{ ListItemEntityTypeFullName: string }>()).ListItemEntityTypeFullName;

        for (var i = 0; i < sourceItems.length; i++) {
            let properties = listConfig.fields.reduce((_properties, fieldName) => {
                _properties[fieldName] = sourceItems[0][fieldName];
                return _properties;
            }, {});
            await destList.items.add(properties, destListItemEntityTypeFullName);
        }
    }

    private delaySeconds(seconds: number) {
        return new Promise(resolve => {
            window.setTimeout(() => {
                resolve();
            }, seconds * 1000);
        });
    }
}
