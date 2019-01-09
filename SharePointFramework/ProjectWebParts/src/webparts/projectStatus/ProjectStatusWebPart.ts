import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Logger, LogLevel, ConsoleListener } from '@pnp/logging';
import "@pnp/polyfill-ie11";
import { sp } from '@pnp/sp';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import ProjectStatus from './components/ProjectStatus';
import { IProjectStatusProps } from './components/IProjectStatusProps';

export interface IProjectStatusWebPartProps {
  title: string;
  reportListName: string;
  reportCtId: string;
  projectInformation: {
    entityListName: string;
    entityCtId: string;
    entityFieldsGroup: string;
  };
}

export default class ProjectStatusWebPart extends BaseClientSideWebPart<IProjectStatusWebPartProps> {
  constructor() {
    super();
    Logger.activeLogLevel = LogLevel.Info;
    Logger.subscribe(new ConsoleListener());
  }

  public async onInit() {
    sp.setup({ spfxContext: this.context });
  }

  public render(): void {
    const element: React.ReactElement<IProjectStatusProps> = React.createElement(
      ProjectStatus, {
        ...this.properties,
        context: this.context,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse(this.manifest.version);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: ''
          },
          groups: [
            {
              groupName: '',
              groupFields: []
            }
          ]
        }
      ]
    };
  }
}
