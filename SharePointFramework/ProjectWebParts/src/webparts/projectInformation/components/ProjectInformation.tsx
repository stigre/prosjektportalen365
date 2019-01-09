import * as React from 'react';
import styles from './ProjectInformation.module.scss';
import { IProjectInformationProps } from './IProjectInformationProps';
import { IProjectInformationState } from './IProjectInformationState';
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import { Web } from '@pnp/sp';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import ProjectPropertyModel from '../models/ProjectPropertyModel';
import ProjectProperty from './ProjectProperty';
import HubSiteService from 'sp-hubsite-service';
import SpEntityPortalService from 'sp-entityportal-service';
import * as strings from 'ProjectInformationWebPartStrings';

export default class ProjectInformation extends React.Component<IProjectInformationProps, IProjectInformationState> {
  public static defaultProps: Partial<IProjectInformationProps> = {
    entityListName: 'Prosjekter',
    entityCtId: '0x0100805E9E4FEAAB4F0EABAB2600D30DB70C',
    entityFieldsGroup: 'Prosjektportalenkolonner',
  };

  constructor(props: IProjectInformationProps) {
    super(props);
    this.state = { properties: [], isLoading: true };
  }

  public async componentDidMount() {
    const { properties, itemId } = await this.fetchData();
    this.setState({ properties, itemId, isLoading: false });
  }

  public render(): React.ReactElement<IProjectInformationProps> {
    if (this.state.isLoading) {
      return <Spinner />;
    }
    return (
      <div className={styles.projectInformation}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <WebPartTitle
                displayMode={this.props.displayMode}
                title={this.props.title}
                updateProperty={this.props.updateTitle} />
              {this.renderProperties()}
              
            </div>
          </div>
        </div>
      </div>
    );
  }

  private renderProperties() {
    const propertiesToRender = this.state.properties.filter(p => !p.empty && p.showInDisplayForm);
    const hasMissingProps = this.state.properties.filter(p => p.required && p.empty).length > 0;
    if (hasMissingProps) {
      return <MessageBar messageBarType={MessageBarType.error}>{strings.MissingPropertiesMessage}</MessageBar>;
    }
    if (propertiesToRender.length === 0) {
      return <MessageBar>{strings.NoPropertiesMessage}</MessageBar>;
    }
    return (
      <div>
        {propertiesToRender.map((model, key) => {
          return <ProjectProperty key={key} model={model} />;
        })}
      </div>
    );
  }

  private async fetchData() {
    try {
      const { pageContext } = this.props.context;
      const hubSite = await HubSiteService.GetHubSiteById(pageContext.web.absoluteUrl, pageContext.legacyPageContext.hubSiteId);
      const hubSiteRootWeb = new Web(hubSite.SiteUrl);
      const projectsList = hubSiteRootWeb.lists.getByTitle(this.props.entityListName);
      const fields = await hubSiteRootWeb.contentTypes.getById(this.props.entityCtId).fields.filter(`Group eq '${this.props.entityFieldsGroup}'`).get();
      const spEntityPortalService = new SpEntityPortalService(hubSite.SiteUrl, this.props.entityListName, 'GtGroupId');
      const itemId = await spEntityPortalService.GetEntityItemId(pageContext.legacyPageContext.groupId);
      const item = await projectsList.items.getById(itemId).fieldValuesAsText.get();
      let itemFieldNames = Object.keys(item);
      let properties = itemFieldNames
        .map(fname => ({
          field: fields.filter(fld => fld.InternalName === fname)[0],
          value: item[fname],
        }))
        .filter(prop => prop.field)
        .map(({ field, value }) => new ProjectPropertyModel(field, value));
      return { properties, itemId };
    } catch (error) {

    }
  }
}
