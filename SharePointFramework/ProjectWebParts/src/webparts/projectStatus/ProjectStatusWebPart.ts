import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import ProjectStatus from './components/ProjectStatus';
import { IProjectStatusProps } from './components/IProjectStatusProps';

export interface IProjectStatusWebPartProps {
  title: string;
  reportListName: string;
  reportCtId: string;
}

export default class ProjectStatusWebPart extends BaseClientSideWebPart<IProjectStatusWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IProjectStatusProps> = React.createElement(
      ProjectStatus, {
        ...this.properties,
        context: this.context,
        displayMode: this.displayMode,
        updateTitle: (title: string) => this.properties.title = title,
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
