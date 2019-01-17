import { IBaseTaskParams } from './IBaseTaskParams';

export class BaseTask {
    public params: IBaseTaskParams;

    constructor(public name?: string) {
        this.name = name;
        this.params = null;
    }

    public async execute(params: IBaseTaskParams, onProgress: (status: string) => void): Promise<IBaseTaskParams> {
        onProgress('BaseTask');
        return params;
    }
}