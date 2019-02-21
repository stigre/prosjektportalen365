import * as React from 'react';
import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration, } from '@microsoft/sp-webpart-base';
import ResourceAllocation from './components/ResourceAllocation';
import { IResourceAllocationProps } from './components/IResourceAllocationProps';
import PortfolioBaseWebPart from '../@portfolioBaseWebPart';
import { sp } from '@pnp/sp';

export interface IResourceAllocationWebPartProps { }

export default class ResourceAllocationWebPart extends PortfolioBaseWebPart<IResourceAllocationWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IResourceAllocationProps> = React.createElement(ResourceAllocation, {});
    super._render(this.manifest.alias, element);
  }

  protected onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({ spfxContext: this.context });
    });
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
