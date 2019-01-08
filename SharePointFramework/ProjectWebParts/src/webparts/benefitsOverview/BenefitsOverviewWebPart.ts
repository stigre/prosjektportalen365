import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'BenefitsOverviewWebPartStrings';
import BenefitsOverview from './components/BenefitsOverview';
import { IBenefitsOverviewProps } from './components/IBenefitsOverviewProps';

export interface IBenefitsOverviewWebPartProps { }

export default class BenefitsOverviewWebPart extends BaseClientSideWebPart<IBenefitsOverviewWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IBenefitsOverviewProps> = React.createElement(
      BenefitsOverview, {}
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
