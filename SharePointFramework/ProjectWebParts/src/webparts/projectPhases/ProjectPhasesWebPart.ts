import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Logger, LogLevel, ConsoleListener } from '@pnp/logging';
import "@pnp/polyfill-ie11";
import { sp, Web, PermissionKind } from '@pnp/sp';
import { BaseClientSideWebPart, IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneSlider, PropertyPaneToggle, PropertyPaneDropdown, IPropertyPaneDropdownOption } from '@microsoft/sp-webpart-base';
import * as strings from 'ProjectPhasesWebPartStrings';
import { IProjectPhasesWebPartProps } from './IProjectPhasesWebPartProps';
import ProjectPhases from './components/ProjectPhases';
import { IProjectPhasesProps } from './components/IProjectPhasesProps';

export default class ProjectPhasesWebPart extends BaseClientSideWebPart<IProjectPhasesWebPartProps> {
  private web: Web;
  private currentUserManageWeb: boolean = false;
  private optionsPhaseField: IPropertyPaneDropdownOption[] = [];

  constructor() {
    super();
    Logger.activeLogLevel = LogLevel.Info;
    Logger.subscribe(new ConsoleListener());
  }

  public async onInit() {
    sp.setup({ spfxContext: this.context });
    this.web = new Web(this.context.pageContext.web.absoluteUrl);
    const [currentUserManageWeb, taxonomyFields] = await Promise.all([
      this.getCurrentUserManageWeb(),
      this.web.fields.select('InternalName', 'Title').filter(`TypeAsString eq 'TaxonomyFieldType'`).get(),
    ]);
    this.currentUserManageWeb = currentUserManageWeb;
    this.optionsPhaseField = taxonomyFields.map(field => ({ key: field.Title, text: field.Title }));
  }

  public render(): void {
    const element: React.ReactElement<IProjectPhasesProps> = React.createElement(
      ProjectPhases,
      {
        ...this.properties,
        currentUserManageWeb: this.currentUserManageWeb,
        webAbsoluteUrl: this.context.pageContext.web.absoluteUrl,
        web: this.web,
        domElement: this.domElement,
        context: this.context,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async getCurrentUserManageWeb(): Promise<boolean> {
    try {
      const currentUserManageWeb = await this.web.currentUserHasPermissions(PermissionKind.ManageWeb);
      return currentUserManageWeb;
    } catch (err) {
      return false;
    }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupName: strings.SettingsGroupName,
              groupFields: [
                PropertyPaneDropdown('phaseField', {
                  label: strings.PhaseFieldFieldLabel,
                  options: this.optionsPhaseField,
                }),
                PropertyPaneToggle('automaticReload', {
                  label: strings.AutomaticReloadFieldLabel,
                }),
                PropertyPaneSlider('reloadTimeout', {
                  label: strings.ReloadTimeoutFieldLabel,
                  min: 0,
                  max: 10,
                  step: 1,
                  disabled: !this.properties.automaticReload,
                }),
                PropertyPaneToggle('confirmPhaseChange', {
                  label: strings.ConfirmPhaseChangeFieldLabel,
                }),
                PropertyPaneTextField('phaseSubTextProperty', {
                  label: strings.PhaseSubTextPropertyFieldLabel,
                }),
              ]
            },
            {
              groupName: strings.ViewsGroupName,
              groupFields: [
                PropertyPaneToggle('updateViewsDocuments', {
                  label: strings.UpdateViewsDocumentsFieldLabel,
                }),
                PropertyPaneToggle('updateViewsTasks', {
                  label: strings.UpdateViewsTasksFieldLabel,
                }),
                PropertyPaneToggle('updateViewsRisks', {
                  label: strings.UpdateViewsRisksFieldLabel,
                }),
              ]
            },
            {
              groupName: strings.LookAndFeelGroupName,
              groupFields: [
                PropertyPaneSlider('fontSize', {
                  label: strings.FontSizeFieldLabel,
                  min: 10,
                  max: 25,
                  step: 1,
                }),
                PropertyPaneSlider('gutter', {
                  label: strings.GutterFieldLabel,
                  min: 10,
                  max: 50,
                  step: 2,
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
