import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { override } from '@microsoft/decorators';
import { BaseApplicationCustomizer, PlaceholderName } from '@microsoft/sp-application-base';
import { Tasks } from './tasks';
import { sp } from '@pnp/sp';
import { Logger, LogLevel, ConsoleListener } from '@pnp/logging';
import { IProgressIndicatorProps } from 'office-ui-fabric-react/lib/ProgressIndicator';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { IProjectSetupApplicationCustomizerProperties } from './IProjectSetupApplicationCustomizerProperties';
import { ProgressModal, TemplateSelectModal } from './components';
import HubSiteService from 'sp-hubsite-service';
import IProjectSetupApplicationCustomizerData from './IProjectSetupApplicationCustomizerData';
import ProjectTemplate from './models/ProjectTemplate';
import * as strings from 'ProjectSetupApplicationCustomizerStrings';
import ListContentConfig from './models/ListContentConfig';
import { ITemplateSelectModalState } from './components/TemplateSelectModal/ITemplateSelectModalState';
import { IBaseTaskParams } from './tasks/IBaseTaskParams';

export default class ProjectSetupApplicationCustomizer extends BaseApplicationCustomizer<IProjectSetupApplicationCustomizerProperties> {
  private domElement: HTMLDivElement;
  private templateSelectModalContainer: HTMLElement;
  private progressModalContainer: HTMLElement;
  private data: IProjectSetupApplicationCustomizerData;
  private taskParams: IBaseTaskParams;

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
        ReactDOM.unmountComponentAtNode(this.templateSelectModalContainer);
        this.data = { ...this.data, ...templateInfo };
        this.taskParams = { context: this.context, properties: this.properties, data: this.data };
        this.renderProgressModal({ label: strings.ProgressModalLabel, description: strings.ProgressModalDescription });
        await this.runTasks();
      } else {
        // TODO: Handle hub site error
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
        onSubmit: (state: ITemplateSelectModalState) => resolve(state),
        isBlocking: true,
        isDarkOverlay: true,
      });
      this.templateSelectModalContainer = document.createElement('DIV');
      this.domElement.appendChild(this.templateSelectModalContainer);
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
      taskParams: this.taskParams,
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
        this.taskParams = await Tasks[i].execute(this.taskParams, this.onTaskStatusUpdated);
      }
      await this.removeCustomizer(this.componentId, !this.isDebug());
    } catch (error) {
      Logger.log({ message: `(ProjectSetupApplicationCustomizer) runTasks: ${error.task} failed with message ${error.message}`, level: LogLevel.Error });
    }
  }

  @autobind
  private onTaskStatusUpdated(status: string) {
    this.renderProgressModal({ label: strings.ProgressModalLabel, description: status });
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
      const [templates, extensions, listContentConfig] = await Promise.all([
        (async () => (await templatesLibrary.rootFolder.files.get()).map(file => new ProjectTemplate(file, data.hub.web)))(),
        (async () => (await extensionsLibrary.rootFolder.files.get()).map(file => new ProjectTemplate(file, data.hub.web)))(),
        (async () => (await listContentList.items.get()).map(item => new ListContentConfig(item, data.hub.web)))(),
      ]);
      return { ...data, templates, extensions, listContentConfig };
    } else {
      return null;
    }
  }

  /**
   * Is debug
   * 
   * Typically true when running 'gulp serve'
   */
  private isDebug(): boolean {
    return document.location.search.toLowerCase().indexOf('debugmanifestsfile') !== -1;
  }
}
