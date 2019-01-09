import * as React from 'react';
import styles from './ProjectStatus.module.scss';
import { IProjectStatusProps } from './IProjectStatusProps';
import { IProjectStatusState } from './IProjectStatusState';
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import NewStatusReportModal from './NewStatusReportModal';
import HubSiteService, { IHubSite } from 'sp-hubsite-service';

export default class ProjectStatus extends React.Component<IProjectStatusProps, IProjectStatusState> {
  private hubSite: IHubSite;

  constructor(props: IProjectStatusProps) {
    super(props);
    this.state = { fields: [] };
  }

  public async componentDidMount() {
    const { pageContext } = this.props.context;
    this.hubSite = await HubSiteService.GetHubSiteById(pageContext.web.absoluteUrl, pageContext.legacyPageContext.hubSiteId);
    let fields = await this.hubSite.web.contentTypes.getById(this.props.reportCtId).fields.select('Title', 'InternalName', 'TypeAsString', 'Choices').filter(`(TypeAsString eq 'Note' or TypeAsString eq 'Text' or TypeAsString eq 'Choice') and InternalName ne 'Title' and InternalName ne 'GtGroupId'`).get();
    fields = fields.map(fld => ({
      title: fld.Title,
      fieldName: fld.InternalName,
      fieldType: fld.TypeAsString.toLowerCase(),
      choices: fld.Choices || [],
    }));
    this.setState({ fields });
  }

  public render(): React.ReactElement<IProjectStatusProps> {
    return (
      <div className={styles.projectStatus}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <WebPartTitle
                displayMode={this.props.displayMode}
                title={this.props.title}
                updateProperty={this.props.updateTitle} />
              <DefaultButton
                text='Ny statusrapport'
                onClick={this.onOpenNewStatusReportModal}
                iconProps={{ iconName: 'NewFolder' }} />
            </div>
          </div>
        </div>
        {this.state.showNewStatusReportModal && <NewStatusReportModal fields={this.state.fields} onSave={this.onSaveReport} onDismiss={this.onDismissNewStatusReportModal} />}
      </div>
    );
  }

  @autobind
  private onSaveReport(report) {
    console.log(report);
    this.setState({ showNewStatusReportModal: false });
  }

  @autobind
  private onOpenNewStatusReportModal() {
    this.setState({ showNewStatusReportModal: true });
  }

  @autobind
  private onDismissNewStatusReportModal() {
    this.setState({ showNewStatusReportModal: false });
  }
}
