import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import ProjectInformation from './components/ProjectInformation';
import { IProjectInformationProps } from './components/IProjectInformationProps';

export interface IProjectInformationWebPartProps {
  title: string;
}

export default class ProjectInformationWebPart extends BaseClientSideWebPart<IProjectInformationWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IProjectInformationProps> = React.createElement(
      ProjectInformation,
      {
        title: this.properties.title,
        displayMode: this.displayMode,
        updateTitle: title => this.properties.title = title,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
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
