import * as React from 'react';
import styles from '../ProjectList.module.scss';
import * as strings from 'ProjectListWebPartStrings';
import { Modal } from "office-ui-fabric-react/lib/Modal";
import { IProjectInfoProps } from './IProjectInfoProps';
import { IProjectInfoState } from './IProjectInfoState';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import HubSiteService from 'sp-hubsite-service';
import SpEntityPortalService from 'sp-entityportal-service';
import ProjectPropertyModel from './ProjectPropertyModel';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export default class ProjectInfo extends React.Component<IProjectInfoProps, IProjectInfoState> {

  private projectsEntity = {
    listName: 'Prosjekter',
    contentTypeId: '0x0100805E9E4FEAAB4F0EABAB2600D30DB70C',
    fieldsGroupName: 'Prosjektportalenkolonner',
    groupIdFieldName: 'GtGroupId',
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      data: null
    };
  }

  public async componentDidMount() {
    await this.fetchData();
  }

  public render() {
    return (
      <Modal className={styles.modal} isOpen={this.props.showProjectInfo !== undefined} isBlocking={false} isDarkOverlay={true} onDismiss={this.props.onDismiss}>
        {(this.state.isLoading) ? <Spinner className={styles.spinner} label={strings.Loading} size={SpinnerSize.medium} /> :
          <div className={styles.propertiesModalInner}>
            <span className={styles.propertiesModalHeader}>{this.props.showProjectInfo.Title}</span>
            {this.renderProperties(this.state.data.properties.slice())}
          </div>}
      </Modal>
    );
  }

  private renderProperties(properties) {
    const propertiesToRender = properties.filter(p => !p.empty && p.showInDisplayForm);
    const hasMissingProps = properties.filter(p => p.required && p.empty).length > 0;
    if (hasMissingProps) {
      return <MessageBar messageBarType={MessageBarType.error}>'Missing properties'</MessageBar>;
    }
    if (propertiesToRender.length === 0) {
      return <MessageBar>'No properties'</MessageBar>;
    }
    return (
      <div className={styles.propertiesContainer}>
        {propertiesToRender.map(p => {
          console.log(p);
          return <div className={styles.property}><p className={styles.propertyHeader}>{p.displayName}</p><p className={styles.propertyValue}>{p.value}</p></div>;
        })}
      </div>
    );
  }

  private async fetchData() {
    try {
      const { context } = this.props;
      const { pageContext } = context;
      const { hubSiteId } = pageContext.legacyPageContext;
      const groupId = this.props.showProjectInfo.RawObject.GtGroupId;
      const hubSite = await HubSiteService.GetHubSiteById(pageContext.web.absoluteUrl, hubSiteId);
      const spEntityPortalService = new SpEntityPortalService({ webUrl: hubSite.url, ...this.projectsEntity });

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

      this.setState({ data, isLoading: false });
    } catch (error) {
      throw error;
    }
  }

}
