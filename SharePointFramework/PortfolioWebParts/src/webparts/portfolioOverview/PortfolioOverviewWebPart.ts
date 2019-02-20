import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'PortfolioOverviewWebPartStrings';
import PortfolioOverview from './components/PortfolioOverview';
import { IPortfolioOverviewProps } from './components/IPortfolioOverviewProps';

export interface IPortfolioOverviewWebPartProps {
  description: string;
}

export default class PortfolioOverviewWebPart extends BaseClientSideWebPart<IPortfolioOverviewWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IPortfolioOverviewProps > = React.createElement(
      PortfolioOverview,
      {
        description: this.properties.description
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
}
