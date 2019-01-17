import { override } from '@microsoft/decorators';
import { BaseTask, IBaseTaskParams, BaseTaskError } from '../BaseTask';
import { WebProvisioner, Web, Schema } from 'pnp-js-provisioning';
import ApplyTemplateStatusMap from './ApplyTemplateStatusMap';

export default class ApplyTemplate extends BaseTask {
    constructor() {
        super('ApplyTemplate');
    }

    @override
    public async execute(params: IBaseTaskParams, onProgress: (status: string) => void) {
        super.execute(params);
        try {
            const web = new Web(params.context.pageContext.web.absoluteUrl);
            const provisioner = new WebProvisioner(web);
            provisioner.setup({
                spfxContext: params.context,
                logging: {
                    prefix: '(ProjectSetupApplicationCustomizer) (ApplyTemplate)',
                    activeLogLevel: 1
                },
                parameters: { fieldsgroup: "Prosjektportalenkolonner" },
            });
            const template = await params.data.selectedTemplate.getSchema();
            await provisioner.applyTemplate(template, null, status => onProgress(ApplyTemplateStatusMap[status]));
        } catch (error) {
            console.log(error);
            throw new BaseTaskError('ApplyTemplate', 'Unknown error');
        }
    }
}
