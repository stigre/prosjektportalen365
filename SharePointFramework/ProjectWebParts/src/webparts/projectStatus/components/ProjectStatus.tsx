import * as React from 'react';
import { Logger, LogLevel } from '@pnp/logging';
import styles from './ProjectStatus.module.scss';
import { DisplayMode } from '@microsoft/sp-core-library';
import { IProjectStatusProps } from './IProjectStatusProps';
import { IProjectStatusState } from './IProjectStatusState';
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import NewStatusReportModal from './NewStatusReportModal';
import SummarySection from './SummarySection';
import StatusPropertySection from './StatusPropertySection';
import HubSiteService, { IHubSite } from 'sp-hubsite-service';
import SpEntityPortalService from 'sp-entityportal-service';
import ProjectStatusReport from '../models/ProjectStatusReport';
import * as strings from 'ProjectStatusWebPartStrings';


export default class ProjectStatus extends React.Component<IProjectStatusProps, IProjectStatusState> {
  private hubSite: IHubSite;
  private reportList;

  constructor(props: IProjectStatusProps) {
    super(props);
    this.state = { reportFields: [], entityFields: [], entityItem: {}, reports: [], selectedReport: null };
  }

  public async componentDidMount() {
    const { reportFields, entityFields, entityItem, reports } = await this.fetchData();
    this.setState({
      reportFields,
      entityFields,
      entityItem,
      reports,
      selectedReport: reports[0],
    });
  }

  public render(): React.ReactElement<IProjectStatusProps> {
    let reportOptions = this.getReportOptions();
    let webPartTitleText = this.props.title;
    let sections = [];
    if (this.state.selectedReport) {
      const baseProps = {
        context: this.props.context,
        report: this.state.selectedReport,
        entityFields: this.state.entityFields,
        entityItem: this.state.entityItem,
      };
      const data = this.state.selectedReport.item;
      sections.push(
        <SummarySection
          projectInformation={this.props.projectInformation} {...baseProps} />,
        <StatusPropertySection
          headerProps={{ label: 'Fremdrift', value: data.GtStatusTime, comment: data.GtStatusTimeComment, iconName: 'AwayStatus', iconSize: 50 }}
          {...baseProps} />,
        <StatusPropertySection
          headerProps={{ label: 'Økonomi', value: data.GtStatusBudget, comment: data.GtStatusBudgetComment, iconName: 'Money', iconSize: 50 }}
          fieldNames={['GtProjectFinanceName', 'GtBudgetTotal', 'GtCostsTotal', 'GtProjectForecast']}
          {...baseProps} />,
        <StatusPropertySection
          headerProps={{ label: 'Kvalitet', value: data.GtStatusQuality, comment: data.GtStatusQualityComment, iconName: 'Equalizer', iconSize: 50 }}
          {...baseProps} />,
        <StatusPropertySection
          headerProps={{ label: 'Risiko', value: data.GtStatusRisk, comment: data.GtStatusRiskComment, iconName: 'Warning', iconSize: 50 }}
          {...baseProps} />,
        <StatusPropertySection
          headerProps={{ label: 'Gevinstoppnåelse', value: data.GtStatusGainAchievement, comment: data.GtStatusGainAchievementComment, iconName: 'Wines', iconSize: 50 }}
          {...baseProps} />,
      );
      webPartTitleText = `${this.props.title} (${this.state.selectedReport.toString()})`;
    }

    return (
      <div className={styles.projectStatus}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column12}>
              <WebPartTitle
                displayMode={DisplayMode.Read}
                title={webPartTitleText}
                updateProperty={_title => { }} />
            </div>
            <div className={styles.column8}>
              <DefaultButton
                text={strings.NewStatusReportModalHeaderText}
                onClick={this.onOpenNewStatusReportModal}
                iconProps={{ iconName: 'NewFolder' }} />
            </div>
            <div className={styles.column4}>
              <Dropdown
                onChanged={this.onReportChanged}
                defaultSelectedKey={this.state.selectedReport ? this.state.selectedReport.toString() : null}
                options={reportOptions}
                disabled={reportOptions.length === 0} />
            </div>
            <div className={`${styles.sections} ${styles.column12}`}>
              {sections}
            </div>
          </div>
        </div>
        {this.state.showNewStatusReportModal && (
          <NewStatusReportModal
            fields={this.state.reportFields}
            onSave={this.onSaveReport}
            onDismiss={this.onDismissNewStatusReportModal} />
        )}
      </div>
    );
  }

  @autobind
  private onReportChanged(option: IDropdownOption) {
    this.setState({ selectedReport: option.data });
  }

  private getReportOptions(): IDropdownOption[] {
    let reportOptions: IDropdownOption[] = this.state.reports.map(report => ({
      key: report.toString(),
      text: report.toString(),
      data: report,
    }));
    return reportOptions;
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

  private async fetchData() {
    Logger.log({ message: '(ProjectStatus) fetchData: Fetching fields and reports', data: {}, level: LogLevel.Info });
    const { pageContext } = this.props.context;
    const { hubSiteId, groupId } = pageContext.legacyPageContext;
    this.hubSite = await HubSiteService.GetHubSiteById(pageContext.web.absoluteUrl, hubSiteId);
    this.reportList = this.hubSite.web.lists.getByTitle(this.props.reportListName);
    Logger.log({ message: '(ProjectStatus) fetchData: Fetched hub site', data: { hubSite: this.hubSite }, level: LogLevel.Info });
    const spEntityPortalService = new SpEntityPortalService(this.hubSite.url, this.props.projectInformation.entityListName, 'GtGroupId', this.props.projectInformation.entityCtId, this.props.projectInformation.entityFieldsGroup);
    const [entityItem, entityFields] = await Promise.all([
      spEntityPortalService.GetEntityItemFieldValues(groupId),
      spEntityPortalService.GetEntityFields(),
    ]);
    let reportFields = await this.hubSite.web.contentTypes.getById(this.props.reportCtId).fields.select('Title', 'InternalName', 'TypeAsString', 'Choices').filter(`(TypeAsString eq 'Note' or TypeAsString eq 'Text' or TypeAsString eq 'Choice') and InternalName ne 'Title' and InternalName ne 'GtGroupId'`).get();
    reportFields = reportFields.map(fld => ({
      title: fld.Title,
      fieldName: fld.InternalName,
      fieldType: fld.TypeAsString.toLowerCase(),
      choices: fld.Choices || [],
    }));
    let reports = await this.reportList.items.filter(`GtGroupId eq '${groupId}'`).get();
    reports = reports.map((r: any) => new ProjectStatusReport(r));
    return { entityFields, entityItem, reportFields, reports };
  }
}
