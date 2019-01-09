import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import ProjectInformation from './components/ProjectInformation';
import { IProjectInformationProps } from './components/IProjectInformationProps';
import { sp } from '@pnp/sp';

export interface IProjectInformationWebPartProps {
  title: string;
}

export default class ProjectInformationWebPart extends BaseClientSideWebPart<IProjectInformationWebPartProps> {
  public async onInit() {
    sp.setup({ spfxContext: this.context });
  }

  public render(): void {
    const element: React.ReactElement<IProjectInformationProps> = React.createElement(
      ProjectInformation,
      {
        title: this.properties.title,
        displayMode: this.displayMode,
        updateTitle: title => this.properties.title = title,
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
