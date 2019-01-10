import * as React from 'react';
import styles from './ProjectInformation.module.scss';
import { DisplayMode } from '@microsoft/sp-core-library';
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
  public static defaultProps: Partial<IProjectInformationProps> = {
    displayMode: DisplayMode.Read,
    updateTitle: () => { },
  };

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
    return (
      <div className={styles.projectInformation}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <WebPartTitle
                displayMode={this.props.displayMode}
                title={this.props.title}
                updateProperty={this.props.updateTitle} />
              {this.state.isLoading
                ? <Spinner />
                : (
                  <div>
                    {this.renderProperties()}
                    <div className={styles.editPropertiesButton} hidden={this.props.hideEditPropertiesButton}>
                      <DefaultButton
                        text={strings.EditPropertiesText}
                        href={this.state.editFormUrl}
                        iconProps={{ iconName: 'Edit' }} />
                    </div>
                  </div>
                )}
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
      const { context } = this.props;
      const { pageContext } = context;
      const { hubSiteId, groupId } = pageContext.legacyPageContext;
      const hubSite = await HubSiteService.GetHubSiteById(pageContext.web.absoluteUrl, hubSiteId);
      const spEntityPortalService = new SpEntityPortalService({ webUrl: hubSite.url, ...this.props.entity });
      const [entityItem, entityFields, editFormUrl] = await Promise.all([
        spEntityPortalService.GetEntityItemFieldValues(groupId),
        spEntityPortalService.GetEntityFields(),
        spEntityPortalService.GetEntityEditFormUrl(groupId, pageContext.web.absoluteUrl),
      ]);
      let properties = Object.keys(entityItem)
        .map(n => ({
          field: entityFields.filter(fld => fld.InternalName === n)[0],
          value: entityItem[n],
        }))
        .filter(prop => prop.field)
        .map(({ field, value }) => new ProjectPropertyModel(field, value));
      const data = { properties, editFormUrl, itemId: entityItem.Id };

      return data;
    } catch (error) {
      throw error;
    }
  }
}
