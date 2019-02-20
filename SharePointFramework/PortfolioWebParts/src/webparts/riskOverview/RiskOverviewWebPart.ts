import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-webpart-base';
import * as strings from 'RiskOverviewWebPartStrings';
import RiskOverview from './components/RiskOverview';
import { IRiskOverviewProps } from './components/IRiskOverviewProps';
import PortfolioBaseWebPart from '../@portfolioBaseWebPart';

export interface IRiskOverviewWebPartProps { }

export default class RiskOverviewWebPart extends PortfolioBaseWebPart<IRiskOverviewWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IRiskOverviewProps> = React.createElement(RiskOverview, {});
    super._render('riskoverviewwebpart', element);
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
