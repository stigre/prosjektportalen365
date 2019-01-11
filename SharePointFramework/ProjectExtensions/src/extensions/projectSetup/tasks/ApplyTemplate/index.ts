import { override } from '@microsoft/decorators';
import { BaseTask, IBaseTaskParams, BaseTaskError } from '../BaseTask';
import { Logger, LogLevel } from '@pnp/logging';
import { WebProvisioner, Web, Schema } from 'sp-js-provisioning/lib';

export default class ApplyTemplate extends BaseTask {
    @override
    public async execute(params: IBaseTaskParams) {
        super.execute(params);
        try {
            Logger.log({ message: '(ProjectSetupApplicationCustomizer) ApplyTemplate', level: LogLevel.Info });
            const web = new Web(params.context.pageContext.web.absoluteUrl);
            const provisioner = new WebProvisioner(web);
            provisioner.setup({ spfxContext: params.context, activeLogLevel: 1 });
            const template: Schema = {
                Navigation: {
                    QuickLaunch: [
                        {
                            Url: "SitePages/Hjem.aspx",
                            Title: "Hjem",
                            IgnoreExisting: true
                        },
                    ],
                },
            };
            await provisioner.applyTemplate(template, msg => {
                Logger.log({ message: '(ProjectSetupApplicationCustomizer) ApplyTemplate', data: { msg }, level: LogLevel.Info });
            });
        } catch (error) {
            console.log(error);
            throw new BaseTaskError('ApplyTemplate', 'Unknown error');
        }
    }
}
