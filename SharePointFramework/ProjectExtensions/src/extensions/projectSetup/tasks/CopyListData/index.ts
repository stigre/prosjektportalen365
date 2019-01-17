import { override } from '@microsoft/decorators';
import { BaseTask } from '../BaseTask';
import * as strings from 'ProjectSetupApplicationCustomizerStrings';
import * as stringFormat from 'string-format';
import { IBaseTaskParams } from '../IBaseTaskParams';
import { BaseTaskError } from '../BaseTaskError';

export default class CopyListData extends BaseTask {
    constructor() {
        super('CopyListData');
    }

    @override
    public async execute(params: IBaseTaskParams, onProgress: (status: string) => void): Promise<IBaseTaskParams> {
        try {
            for (let i = 0; i < params.data.selectedListConfig.length; i++) {
                onProgress(stringFormat(strings.CopyListDataText, params.data.selectedListConfig[i].sourceList, params.data.selectedListConfig[i].destinationLibrary || params.data.selectedListConfig[i].destinationList));
                await this.delaySeconds(5);
            }
            return params;
        } catch (error) {
            throw new BaseTaskError('CopyListData', 'Unknown error');
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
