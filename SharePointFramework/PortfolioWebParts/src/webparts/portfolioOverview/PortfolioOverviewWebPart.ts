import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import PortfolioBaseWebPart from '../@portfolioBaseWebPart';

export interface IPortfolioOverviewWebPartProps { }

export default class PortfolioOverviewWebPart extends PortfolioBaseWebPart<IPortfolioOverviewWebPartProps> {
  public render(): void {
    super._render('deliveriesoverviewwebpart', null);
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
