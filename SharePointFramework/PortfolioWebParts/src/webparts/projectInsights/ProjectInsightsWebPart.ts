import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'ProjectInsightsWebPartStrings';
import ProjectInsights from './components/ProjectInsights';
import { IProjectInsightsProps } from './components/IProjectInsightsProps';
import PortfolioBaseWebPart from '../@portfolioBaseWebPart';

export interface IProjectInsightsWebPartProps { }

export default class ProjectInsightsWebPart extends PortfolioBaseWebPart<IProjectInsightsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IProjectInsightsProps> = React.createElement(ProjectInsights, {});
    super._render(this.manifest.alias, element);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();
  }

  protected onDispose(): void {
    super.onDispose();
  }

  protected get dataVersion(): Version {
    return Version.parse(this.manifest.version);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return { pages: [] };
  }
}
