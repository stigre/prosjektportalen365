import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import LatestProjects from './components/LatestProjects';
import { ILatestProjectsProps } from './components/ILatestProjectsProps';
import { sp } from '@pnp/sp';

export interface ILatestProjectsWebPartProps {
  title: string;
}

export default class LatestProjectsWebPart extends BaseClientSideWebPart<ILatestProjectsWebPartProps> {
  public render(): void {
    const element: React.ReactElement<ILatestProjectsProps> = React.createElement(
      LatestProjects,
      {
        context: this.context,
        absoluteUrl: this.context.pageContext.web.absoluteUrl,
        serverRelativeUrl: this.context.pageContext.web.serverRelativeUrl,
        displayMode: this.displayMode,
        updateProperty: (value: string) => {
          this.properties.title = value;
        },
        ...this.properties,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();
    sp.setup({ spfxContext: this.context });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse(this.manifest.version);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return { pages: [] };
  }
}
