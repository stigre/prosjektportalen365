import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration, } from '@microsoft/sp-webpart-base';
import ProjectList from './components/ProjectList';
import { IProjectListProps } from './components/IProjectListProps';
import { sp, Web } from '@pnp/sp';


export interface IProjectListWebPartProps {
  phaseTermSetId: string;
  entity: {
    listName: string;
    contentTypeId: string;
    fieldsGroupName: string;
    groupIdFieldName: string;
  };
}

export default class ProjectListWebPart extends BaseClientSideWebPart<IProjectListWebPartProps> {

  private web: Web;

  public render(): void {
    const element: React.ReactElement<IProjectListProps> = React.createElement(
      ProjectList,
      {
        ...this.properties,
        pageContext: this.context.pageContext,
        spHttpClient: this.context.spHttpClient,
        web: this.web,
        webServerRelativeUrl: this.context.pageContext.web.serverRelativeUrl,
        webAbsoluteUrl: this.context.pageContext.web.absoluteUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({ spfxContext: this.context });
      this.web = new Web(this.context.pageContext.web.absoluteUrl);
    });
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
