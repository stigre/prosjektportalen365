import { Web } from '@pnp/sp';
import { Schema } from 'pnp-js-provisioning';


export default class ProjectTemplate {
    constructor(
        public title: string,
        public serverRelativeUrl: string,
        public web: any
    ) { }

    public async getSchema(): Promise<Schema> {
        return await this.web.getFileByServerRelativeUrl(this.serverRelativeUrl).getJSON();
    }
}