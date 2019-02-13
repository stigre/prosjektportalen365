import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'ExperienceLogWebPartStrings';
import ExperienceLog from './components/ExperienceLog';
import { IExperienceLogProps } from './components/IExperienceLogProps';
import { sp } from '@pnp/sp';

export interface IExperienceLogWebPartProps {
  absoluteUrl: string;
  serverRelativeUrl: string;
}

export default class ExperienceLogWebPart extends BaseClientSideWebPart<IExperienceLogWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IExperienceLogProps> = React.createElement(
      ExperienceLog,
      {
        hubSiteId: this.context.pageContext.legacyPageContext.hubSiteId,
        absoluteUrl: this.context.pageContext.web.absoluteUrl,
        spHttpClient: this.context.spHttpClient,
        serverRelativeUrl: this.context.pageContext.web.serverRelativeUrl,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({ spfxContext: this.context });
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
      pages: [  ]
    };
  }
}
