import { override } from '@microsoft/decorators';
import { BaseTask, IBaseTaskParams, BaseTaskError } from '../BaseTask';
import { WebProvisioner, Web } from 'pnp-js-provisioning';
import ApplyTemplateStatusMap from './ApplyTemplateStatusMap';
import * as strings from 'ProjectSetupApplicationCustomizerStrings';
import * as stringFormat from 'string-format';

export default class ApplyTemplate extends BaseTask {
    constructor() {
        super('ApplyTemplate');
    }

    @override
    public async execute({ context, data }: IBaseTaskParams, onProgress: (status: string) => void) {
        try {
            const web = new Web(context.pageContext.web.absoluteUrl);
            const provisioner = new WebProvisioner(web);
            provisioner.setup({
                spfxContext: context,
                logging: {
                    prefix: '(ProjectSetupApplicationCustomizer) (ApplyTemplate)',
                    activeLogLevel: 1
                },
                parameters: { fieldsgroup: "Prosjektportalenkolonner" },
            });
            let template = await data.selectedTemplate.getSchema();
            await provisioner.applyTemplate(template, null, status => onProgress(ApplyTemplateStatusMap[status]));
            for (let i = 0; i < data.selectedExtensions.length; i++) {
                template = await data.selectedExtensions[i].getSchema();
                onProgress(stringFormat(strings.ApplyExtensionText, data.selectedExtensions[i].title));
                await provisioner.applyTemplate(template, null);
            }
        } catch (error) {
            console.log(error);
            throw new BaseTaskError('ApplyTemplate', 'Unknown error');
        }
    }
}
