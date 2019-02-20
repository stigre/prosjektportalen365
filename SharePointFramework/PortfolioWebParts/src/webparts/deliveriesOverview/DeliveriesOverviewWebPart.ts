import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';

import * as strings from 'DeliveriesOverviewWebPartStrings';
import DeliveriesOverview from './components/DeliveriesOverview';
import { IDeliveriesOverviewProps } from './components/IDeliveriesOverviewProps';

export interface IDeliveriesOverviewWebPartProps { }

export default class DeliveriesOverviewWebPart extends BaseClientSideWebPart<IDeliveriesOverviewWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IDeliveriesOverviewProps> = React.createElement(
      DeliveriesOverview, { context: this.context, dataSource: 'DELIVERIESOVERVIEW' }
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
          groups: [
            {
              groupFields: []
            }
          ]
        }
      ]
    };
  }
}
