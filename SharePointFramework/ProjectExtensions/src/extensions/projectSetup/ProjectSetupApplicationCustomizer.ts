import { override } from '@microsoft/decorators';
import { BaseApplicationCustomizer } from '@microsoft/sp-application-base';
import { CheckHubAssosication, SetQuickLaunch } from './Tasks';
import { sp } from "@pnp/sp";

export interface IProjectSetupApplicationCustomizerProperties { }


export default class ProjectSetupApplicationCustomizer extends BaseApplicationCustomizer<IProjectSetupApplicationCustomizerProperties> {
  @override
  public async onInit(): Promise<void> {
    sp.setup({ spfxContext: this.context });
    await this.runTasks();
  }

  public async runTasks() {
    await CheckHubAssosication.execute({ context: this.context, properties: this.properties });
    await SetQuickLaunch.execute({ context: this.context, properties: this.properties });
  }
}
