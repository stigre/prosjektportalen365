import * as React from 'react';
import styles from './ProjectStatus.module.scss';
import { IProjectStatusProps } from './IProjectStatusProps';
import { IProjectStatusState } from './IProjectStatusState';
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import NewStatusReportModal from './NewStatusReportModal';
import SummarySection from './SummarySection';
import HubSiteService, { IHubSite } from 'sp-hubsite-service';
import ProjectStatusReport from '../models/ProjectStatusReport';
import * as strings from 'ProjectStatusWebPartStrings';


export default class ProjectStatus extends React.Component<IProjectStatusProps, IProjectStatusState> {
  private hubSite: IHubSite;
  private reportList;

  constructor(props: IProjectStatusProps) {
    super(props);
    this.state = { fields: [], reports: [] };
  }

  public async componentDidMount() {
    const { pageContext } = this.props.context;
    const { hubSiteId, groupId } = pageContext.legacyPageContext;
    this.hubSite = await HubSiteService.GetHubSiteById(pageContext.web.absoluteUrl, hubSiteId);
    this.reportList = this.hubSite.web.lists.getByTitle(this.props.reportListName);
    let fields = await this.hubSite.web.contentTypes.getById(this.props.reportCtId).fields.select('Title', 'InternalName', 'TypeAsString', 'Choices').filter(`(TypeAsString eq 'Note' or TypeAsString eq 'Text' or TypeAsString eq 'Choice') and InternalName ne 'Title' and InternalName ne 'GtGroupId'`).get();
    fields = fields.map(fld => ({
      title: fld.Title,
      fieldName: fld.InternalName,
      fieldType: fld.TypeAsString.toLowerCase(),
      choices: fld.Choices || [],
    }));
    let reports = await this.reportList.items.filter(`GtGroupId eq '${groupId}'`).get();
    reports = reports.map((r: any) => new ProjectStatusReport(r));
    this.setState({ fields, reports });
  }

  public render(): React.ReactElement<IProjectStatusProps> {
    const reportOptions = this.getReportOptions();
    const sections = [
      <SummarySection context={this.props.context} report={null} />
    ];

    return (
      <div className={styles.projectStatus}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column12}>
              <WebPartTitle
                displayMode={this.props.displayMode}
                title={this.props.title}
                updateProperty={this.props.updateTitle} />
            </div>
            <div className={styles.column8}>
              <DefaultButton
                text='Ny statusrapport'
                onClick={this.onOpenNewStatusReportModal}
                iconProps={{ iconName: 'NewFolder' }} />
            </div>
            <div className={styles.column4}>
              <Dropdown options={reportOptions} disabled={reportOptions.length === 0} />
            </div>
            <div className={`${styles.sections} ${styles.column12}`}>
              {sections}
            </div>
          </div>
        </div>
        {this.state.showNewStatusReportModal && (
          <NewStatusReportModal
            fields={this.state.fields}
            onSave={this.onSaveReport}
            onDismiss={this.onDismissNewStatusReportModal} />
        )}
      </div>
    );
  }

  private getReportOptions(): IDropdownOption[] {
    return this.state.reports.map(r => ({
      key: r.item.Id,
      text: r.toString(),
    }));
  }

  @autobind
  private async onSaveReport(model: { [key: string]: string }) {
    this.setState({ showNewStatusReportModal: false });
    const report = { GtGroupId: this.props.context.pageContext.legacyPageContext.groupId, ...model };
    await this.reportList.items.add(report);
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
