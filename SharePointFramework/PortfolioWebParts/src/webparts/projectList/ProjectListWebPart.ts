import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  WebPartContext,
  BaseWebPartContext
} from '@microsoft/sp-webpart-base';

import * as strings from 'ProjectListWebPartStrings';
import ProjectList from './components/ProjectList';
import { IProjectListProps } from './components/IProjectListProps';
import { sp } from '@pnp/sp';
import { SPHttpClient, SPHttpClientResponse, SPHttpClientConfiguration } from '@microsoft/sp-http';



export interface IProjectListWebPartProps {
  absoluteUrl: string;
  serverRelativeUrl: string;
  context: WebPartContext;
}

export default class ProjectListWebPart extends BaseClientSideWebPart<IProjectListWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IProjectListProps> = React.createElement(
      ProjectList,
      {
        context: this.context,
        serverRelativeUrl: this.context.pageContext.web.serverRelativeUrl,
        absoluteUrl: this.context.pageContext.web.absoluteUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
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
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
