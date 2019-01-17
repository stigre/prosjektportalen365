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
        this.data.selectedTemplate = await this.getTemplate();
        this.renderProgressModal({ label: strings.ProgressModalLabel, description: strings.ProgressModalDescription });
        await this.runTasks();
      }
    }
  }

  /**
   * Render TemplateSelectModal
   */
  private getTemplate(): Promise<ProjectTemplate> {
    return new Promise(resolve => {
      const templateSelectModal = React.createElement(TemplateSelectModal, {
        key: 'ProjectSetupApplicationCustomizer_TemplateSelectModal',
        templates: this.data.templates,
        onTemplateSelected: (template: ProjectTemplate) => {
          this.unmountTemplateSelectModal();
          resolve(template);
        }
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
    const progressModal = React.createElement(ProgressModal, { key: 'ProjectSetupApplicationCustomizer_ProgressModal', progressIndicatorProps });
    this.progressModalContainer = document.createElement('DIV');
    this.domElement.appendChild(this.progressModalContainer);
    ReactDOM.render(progressModal, this.progressModalContainer);
  }

  private unmountTemplateSelectModal(): boolean {
    return ReactDOM.unmountComponentAtNode(this.templateSelectModalContainer);
  }

  /**
  * Run tasks
  */
  private async runTasks(): Promise<void> {
    Logger.log({ message: '(ProjectSetupApplicationCustomizer) runTasks', data: { tasks: Tasks.map(t => t.name) }, level: LogLevel.Info });
    try {
      for (let i = 0; i < Tasks.length; i++) {
        await Tasks[i].execute({
          context: this.context,
          properties: this.properties,
          data: this.data,
        }, (status) => {
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

  private async getData(): Promise<IProjectSetupApplicationCustomizerData> {
    const { pageContext } = this.context;
    const { hubSiteId } = pageContext.legacyPageContext;
    if (hubSiteId) {
      let data: IProjectSetupApplicationCustomizerData = {};
      data.hub = await HubSiteService.GetHubSiteById(pageContext.web.absoluteUrl, hubSiteId);
      const templatesLibrary = data.hub.web.lists.getByTitle('Prosjektmaler');
      data.templates = (await templatesLibrary.rootFolder.files.get()).map(file => new ProjectTemplate(file.Title, file.ServerRelativeUrl, data.hub.web));
      console.log(data.templates);
      return data;
    } else {
      return null;
    }
  }
}
