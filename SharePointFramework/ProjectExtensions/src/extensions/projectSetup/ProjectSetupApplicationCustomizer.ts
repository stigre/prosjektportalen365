import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { override } from '@microsoft/decorators';
import { BaseApplicationCustomizer, PlaceholderName } from '@microsoft/sp-application-base';
import { Tasks } from './tasks';
import { sp } from '@pnp/sp';
import { Logger, LogLevel, ConsoleListener } from '@pnp/logging';
import { IProgressIndicatorProps } from 'office-ui-fabric-react/lib/ProgressIndicator';
import { IProjectSetupApplicationCustomizerProperties } from './IProjectSetupApplicationCustomizerProperties';
import { ProgressModal, TemplateSelectModal } from './components';
import HubSiteService from 'sp-hubsite-service';
import IProjectSetupApplicationCustomizerData from './IProjectSetupApplicationCustomizerData';
import ProjectTemplate from './models/ProjectTemplate';
import * as strings from 'ProjectSetupApplicationCustomizerStrings';
import ListContentConfig from './models/ListContentConfig';
import { ITemplateSelectModalState } from './components/TemplateSelectModal/ITemplateSelectModalState';

export default class ProjectSetupApplicationCustomizer extends BaseApplicationCustomizer<IProjectSetupApplicationCustomizerProperties> {
  private domElement: HTMLDivElement;
  private templateSelectModalContainer: HTMLElement;
  private progressModalContainer: HTMLElement;
  private data: IProjectSetupApplicationCustomizerData;

  @override
  public async onInit(): Promise<void> {
    if (this.context.pageContext.legacyPageContext.isSiteAdmin) {
      Logger.subscribe(new ConsoleListener());
      Logger.activeLogLevel = LogLevel.Info;
      sp.setup({ spfxContext: this.context });
      this.data = await this.getData();
      if (this.data) {
        const topPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top);
        this.domElement = topPlaceholder.domElement;
        const templateInfo = await this.getTemplateInfo();
        this.data = { ...this.data, ...templateInfo };
        this.renderProgressModal({ label: strings.ProgressModalLabel, description: strings.ProgressModalDescription });
        await this.runTasks();
      }
    }
  }

  /**
   * Render TemplateSelectModal
   */
  private getTemplateInfo(): Promise<ITemplateSelectModalState> {
    return new Promise(resolve => {
      const templateSelectModal = React.createElement(TemplateSelectModal, {
        key: 'ProjectSetupApplicationCustomizer_TemplateSelectModal',
        data: this.data,
        onSubmit: (state: ITemplateSelectModalState) => {
          this.templateSelectModalContainer.remove();
          resolve(state);
        },
        isBlocking: true,
        isDarkOverlay: true,
      });
      if (!this.templateSelectModalContainer) {
        this.templateSelectModalContainer = document.createElement('DIV');
        this.domElement.appendChild(this.templateSelectModalContainer);
      }
      ReactDOM.render(templateSelectModal, this.templateSelectModalContainer);
    });
  }

  /**
   * Render ProgressModal
   */
  private renderProgressModal(progressIndicatorProps: IProgressIndicatorProps) {
    const progressModal = React.createElement(ProgressModal, {
      key: 'ProjectSetupApplicationCustomizer_ProgressModal',
      progressIndicatorProps,
      isBlocking: true,
      isDarkOverlay: true,
    });
    if (!this.progressModalContainer) {
      this.progressModalContainer = document.createElement('DIV');
      this.domElement.appendChild(this.progressModalContainer);
    }
    ReactDOM.render(progressModal, this.progressModalContainer);
  }

  /**
  * Run tasks
  */
  private async runTasks(): Promise<void> {
    Logger.log({ message: '(ProjectSetupApplicationCustomizer) runTasks', data: { properties: this.properties, tasks: Tasks.map(t => t.name) }, level: LogLevel.Info });
    try {
      for (let i = 0; i < Tasks.length; i++) {
        await Tasks[i].execute({ context: this.context, properties: this.properties, data: this.data }, (status) => {
          this.renderProgressModal({ label: strings.ProgressModalLabel, description: status });
        });
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
    let customActions = await sp.web.userCustomActions.get();
    for (let i = 0; i < customActions.length; i++) {
      var { ClientSideComponentId, Id } = customActions[i];
      if (ClientSideComponentId === componentId) {
        Logger.log({ message: `(ProjectSetupApplicationCustomizer) removeCustomizer: Removing custom action ${Id}`, level: LogLevel.Info });
        await sp.web.userCustomActions.getById(Id).delete();
        break;
      }
    }
    if (reload) {
      window.location.href = this.context.pageContext.web.absoluteUrl;
    }
  }

  private async getData(): Promise<IProjectSetupApplicationCustomizerData> {
    const { pageContext } = this.context;
    const { hubSiteId } = pageContext.legacyPageContext;
    if (hubSiteId) {
      let data: IProjectSetupApplicationCustomizerData = {};
      data.hub = await HubSiteService.GetHubSiteById(pageContext.web.absoluteUrl, hubSiteId);
      const templatesLibrary = data.hub.web.lists.getByTitle(this.properties.templatesLibrary);
      const extensionsLibrary = data.hub.web.lists.getByTitle(this.properties.extensionsLibrary);
      const listContentList = data.hub.web.lists.getByTitle(this.properties.contentConfigList);
      data.templates = (await templatesLibrary.rootFolder.files.get()).map(file => new ProjectTemplate(file.Title, file.ServerRelativeUrl, data.hub.web));
      data.extensions = (await extensionsLibrary.rootFolder.files.get()).map(file => new ProjectTemplate(file.Title, file.ServerRelativeUrl, data.hub.web));
      data.listContentConfig = (await listContentList.items.get()).map(item => new ListContentConfig(item.Title, item.GtLccSourceList, item.GtLccDestinationList, item.GtLccDestinationLibrary, item.GtLccFields, item.GtLccDefault, data.hub.web));
      return data;
    } else {
      return null;
    }
  }
}
