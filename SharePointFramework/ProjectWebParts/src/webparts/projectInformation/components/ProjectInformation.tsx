import * as React from 'react';
import styles from './ProjectInformation.module.scss';
import { IProjectInformationProps } from './IProjectInformationProps';
import { IProjectInformationState } from './IProjectInformationState';
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import ProjectPropertyModel from '../models/ProjectPropertyModel';
import ProjectProperty from './ProjectProperty';
import HubSiteService from 'sp-hubsite-service';
import SpEntityPortalService from 'sp-entityportal-service';
import * as strings from 'ProjectInformationWebPartStrings';

export default class ProjectInformation extends React.Component<IProjectInformationProps, IProjectInformationState> {
  constructor(props: IProjectInformationProps) {
    super(props);
    this.state = { properties: [], isLoading: true };
  }

  public async componentDidMount() {
    try {
      const { properties, editFormUrl, itemId } = await this.fetchData();
      this.setState({ properties, editFormUrl, itemId, isLoading: false });
    } catch (err) {
      this.setState({ isLoading: false });
    }
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
              <DefaultButton
                text={strings.EditPropertiesText}
                href={this.state.editFormUrl}
                iconProps={{ iconName: 'Edit' }} />
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
      const projectsList = hubSite.web.lists.getByTitle(this.props.entityListName);
      const fields = await hubSite.web.contentTypes.getById(this.props.entityCtId).fields.filter(`Group eq '${this.props.entityFieldsGroup}'`).get();
      const spEntityPortalService = new SpEntityPortalService(hubSite.url, this.props.entityListName, 'GtGroupId');
      const itemId = await spEntityPortalService.GetEntityItemId(pageContext.legacyPageContext.groupId);
      const editFormUrl = await spEntityPortalService.GetEntityEditFormUrl(pageContext.legacyPageContext.groupId, this.props.context.pageContext.web.absoluteUrl);
      const item = await projectsList.items.getById(itemId).fieldValuesAsText.get();
      let itemFieldNames = Object.keys(item);
      let properties = itemFieldNames
        .map(fname => ({
          field: fields.filter(fld => fld.InternalName === fname)[0],
          value: item[fname],
        }))
        .filter(prop => prop.field)
        .map(({ field, value }) => new ProjectPropertyModel(field, value));
      return { properties, editFormUrl, itemId };
    } catch (error) {
      throw error;
    }
  }
}
