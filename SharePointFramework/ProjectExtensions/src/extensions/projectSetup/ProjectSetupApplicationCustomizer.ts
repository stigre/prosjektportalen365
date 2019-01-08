import { override } from '@microsoft/decorators';
import { BaseApplicationCustomizer, PlaceholderName } from '@microsoft/sp-application-base';
import { CheckHubAssosication, SetupPages, PlannerConfiguration, IBaseTaskParams, SetupViews } from './tasks';
import { sp } from "@pnp/sp";
import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { IProjectSetupApplicationCustomizerProperties } from './IProjectSetupApplicationCustomizerProperties';

export default class ProjectSetupApplicationCustomizer extends BaseApplicationCustomizer<IProjectSetupApplicationCustomizerProperties> {
  @override
  public async onInit(): Promise<void> {
    if (this.context.pageContext.legacyPageContext.isSiteAdmin) {
      Logger.subscribe(new ConsoleListener());
      Logger.activeLogLevel = LogLevel.Info;
      sp.setup({ spfxContext: this.context });
      await this.runTasks();
    }
  }

   /**
   * Run tasks
   */
  public async runTasks(): Promise<void> {
    Logger.log({ message: '(ProjectSetupApplicationCustomizer) runTasks', level: LogLevel.Info });
    const params: IBaseTaskParams = { context: this.context, properties: this.properties };
    await CheckHubAssosication.execute(params);
    await SetupPages.execute(params);
    await SetupViews.execute(params);
    await PlannerConfiguration.execute(params);
    await this.removeCustomizer(this.componentId, true);
  }

  /**
   * Remove customizer
   * 
   * @param {string} componentId Component ID
   * @param {boolean} reload Reload page after customizer removal
   */
  private async removeCustomizer(componentId: string, reload: boolean): Promise<void> {
    Logger.log({ message: '(ProjectSetupApplicationCustomizer) removeCustomizer', level: LogLevel.Info });
    let customActions = await sp.web.userCustomActions.get();
    for (let i = 0; i < customActions.length; i++) {
      var instance = customActions[i];
      if (instance.ClientSideComponentId === componentId) {
        await sp.web.userCustomActions.getById(instance.Id).delete();
        break;
      }
    }
    if (reload) {
      window.location.href = this.context.pageContext.web.absoluteUrl;
    }
  }
}
