import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { override } from '@microsoft/decorators';
import { BaseApplicationCustomizer, PlaceholderName } from '@microsoft/sp-application-base';
import { Tasks, IBaseTaskParams } from './tasks';
import { sp } from "@pnp/sp";
import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { IProjectSetupApplicationCustomizerProperties } from './IProjectSetupApplicationCustomizerProperties';
import ProgressModal from './components/ProgressModal';
import HubSiteService from 'sp-hubsite-service';

export default class ProjectSetupApplicationCustomizer extends BaseApplicationCustomizer<IProjectSetupApplicationCustomizerProperties> {
  @override
  public async onInit(): Promise<void> {
    if (this.context.pageContext.legacyPageContext.isSiteAdmin) {
      Logger.subscribe(new ConsoleListener());
      Logger.activeLogLevel = LogLevel.Info;
      sp.setup({ spfxContext: this.context });
      const topPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top);
      const progressModal = React.createElement(ProgressModal, { progressIndicatorProps: { label: 'Klargjør prosjektområdet', description: 'Vennligst vent..' } });
      ReactDOM.render(progressModal, topPlaceholder.domElement);
      await this.runTasks();
    }
  }

  /**
  * Run tasks
  */
  public async runTasks(): Promise<void> {
    Logger.log({ message: '(ProjectSetupApplicationCustomizer) runTasks', level: LogLevel.Info });
    const { pageContext } = this.context;
    const { hubSiteId, groupId } = pageContext.legacyPageContext;
    const hub = await HubSiteService.GetHubSiteById(pageContext.web.absoluteUrl, hubSiteId);
    const params: IBaseTaskParams = { context: this.context, properties: this.properties, groupId, hub };
    try {
      for (let i = 0; i < Tasks.length; i++) {
        await Tasks[i].execute(params);
      }
      await this.removeCustomizer(this.componentId, true);
    } catch (error) {
      Logger.log({ message: `(ProjectSetupApplicationCustomizer) runTasks: ${error.task} failed with message ${error.message}`, level: LogLevel.Error });
    }
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
