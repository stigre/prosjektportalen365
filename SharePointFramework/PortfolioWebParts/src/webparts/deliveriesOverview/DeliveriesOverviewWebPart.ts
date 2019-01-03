import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'DeliveriesOverviewWebPartStrings';
import DeliveriesOverview from './components/DeliveriesOverview';
import { IDeliveriesOverviewProps } from './components/IDeliveriesOverviewProps';

export interface IDeliveriesOverviewWebPartProps {
  description: string;
}

export default class DeliveriesOverviewWebPart extends BaseClientSideWebPart<IDeliveriesOverviewWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IDeliveriesOverviewProps > = React.createElement(
      DeliveriesOverview,
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
