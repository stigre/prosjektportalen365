import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import ExperienceLog from './components/ExperienceLog';
import { IExperienceLogProps } from './components/IExperienceLogProps';
import { sp } from '@pnp/sp';

export interface IExperienceLogWebPartProps { }

export default class ExperienceLogWebPart extends BaseClientSideWebPart<IExperienceLogWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IExperienceLogProps> = React.createElement(ExperienceLog,
      {
        context: this.context,
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
    return Version.parse(this.manifest.version);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return { pages: [] };
  }
}
