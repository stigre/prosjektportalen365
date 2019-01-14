import { override } from '@microsoft/decorators';
import { BaseTask, IBaseTaskParams, BaseTaskError } from '../BaseTask';
import { Logger, LogLevel } from '@pnp/logging';
import { WebProvisioner, Web, Schema } from 'pnp-js-provisioning';

export default class ApplyTemplate extends BaseTask {
    @override
    public async execute(params: IBaseTaskParams) {
        super.execute(params);
        try {
            Logger.log({ message: '(ProjectSetupApplicationCustomizer) ApplyTemplate', level: LogLevel.Info });
            const templatesLibrary = params.hub.web.lists.getByTitle('Prosjektmaler');
            const templates = await templatesLibrary.rootFolder.files.get();
            const template: Schema = await params.hub.web.getFileByServerRelativeUrl(templates[0].ServerRelativeUrl).getJSON();
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
            await provisioner.applyTemplate(template);
        } catch (error) {
            console.log(error);
            throw new BaseTaskError('ApplyTemplate', 'Unknown error');
        }
    }
}
