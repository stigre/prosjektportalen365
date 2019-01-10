import * as React from 'react';
import { Logger, LogLevel } from '@pnp/logging';
import { sp } from '@pnp/sp';
import { taxonomy } from "@pnp/sp-taxonomy";
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import ConfirmPhaseDialog from './ConfirmPhaseDialog';
import ProjectPhaseCallout from './ProjectPhaseCallout';
import Phase from "../models/Phase";
import styles from './ProjectPhases.module.scss';
import { IProjectPhasesProps } from './IProjectPhasesProps';
import { IProjectPhasesState } from './IProjectPhasesState';
import * as strings from 'ProjectPhasesWebPartStrings';
import * as format from 'string-format';
import HubSiteService from 'sp-hubsite-service';
import SpEntityPortalService from 'sp-entityportal-service';

export default class ProjectPhases extends React.Component<IProjectPhasesProps, IProjectPhasesState> {
  private spEntityPortalService: SpEntityPortalService;

  /**
   * Constructor
   * 
   * @param {IProjectPhasesProps} props Initial props
   */
  constructor(props: IProjectPhasesProps) {
    super(props);
    this.state = { isLoading: true };
  }

  public async componentDidMount() {
    if (this.props.phaseField) {
      const { pageContext } = this.props.context;
      const hubSite = await HubSiteService.GetHubSiteById(pageContext.web.absoluteUrl, pageContext.legacyPageContext.hubSiteId);
      this.spEntityPortalService = new SpEntityPortalService({ webUrl: hubSite.url, ...this.props.entity });
      const checkPointStatuses = await this.fetchCheckPointStatuses();
      const { phases, currentPhase, phaseTextField } = await this.fetchData(checkPointStatuses);
      this.setState({
        isLoading: false,
        currentPhase,
        phases,
        checkPointStatuses,
        phaseTextField,
      });
    }
  }

  /**
   * Component will receive props
   * 
   * @param {IProjectPhasesProps} nextProps Next props
   */
  public async componentWillReceiveProps(nextProps: IProjectPhasesProps) {
    if (this.props.phaseField !== nextProps.phaseField) {
      this.setState({ isLoading: true });
      const { phases, phaseTextField } = await this.fetchData(this.state.checkPointStatuses);
      this.setState({ isLoading: false, phases, phaseTextField });
    }
  }

  /**
   * Renders the <ProjectPhases /> component
   */
  public render(): React.ReactElement<IProjectPhasesProps> {
    if (!this.props.phaseField) {
      return (
        <div className={styles.projectPhases}>
          <div className={styles.container} ref='container'>
            <MessageBar messageBarType={MessageBarType.error}>{strings.WebPartNotConfiguredMessage}</MessageBar>
          </div>
        </div>
      );
    }
    if (this.state.isLoading) {
      return (
        <div className={styles.projectPhases}>
          <div className={styles.container} ref='container'>
            <Spinner />
          </div>
        </div>
      );
    }
    return (
      <div className={styles.projectPhases}>
        <div className={styles.container} ref='container'>
          {this.state.phases.map(phase => (
            <div {...this.getPhaseProperties(phase)}>
              <div className={styles.itemText}>{phase.term.Name}</div>
            </div>
          ))}
        </div>
        {(this.state.currentPhase && this.state.showPhaseChangeMessage) &&
          <div style={{ marginTop: 20 }}>
            <MessageBar messageBarType={MessageBarType.info}>
              <p>{format(strings.PhaseChangedMessage, this.state.currentPhase.name)}</p>
            </MessageBar>
          </div>
        }
        {this.state.confirmPhase && (
          <ConfirmPhaseDialog
            phase={this.state.confirmPhase}
            onConfirm={this.confirmPhaseDialogCallback}
            isBlocking={true}
            isChangingPhase={this.state.isChangingPhase} />
        )}
        {this.state.phaseMouseOver && (
          <ProjectPhaseCallout
            phase={this.state.phaseMouseOver}
            phaseSubTextProperty={this.props.phaseSubTextProperty}
            phaseChecklistViewUrl={`${this.props.webAbsoluteUrl}/Lists/Fasesjekkliste/AllItems.aspx`}
            onDismiss={this.onProjectPhaseCalloutDismiss} />
        )}
      </div>
    );
  }

  /**
   * Update phase
   * 
   * @param {Phase} phase Phase
   */
  private async updatePhase(phase: Phase) {
    let properties: { [key: string]: string } = {};
    properties[this.state.phaseTextField] = phase.toString();
    Logger.log({ message: '(ProjectPhases) updatePhase', data: { properties }, level: LogLevel.Info });
    await this.spEntityPortalService.UpdateEntityItem(this.props.context.pageContext.legacyPageContext.groupId, properties);
  }

  /**
   * Confirm phase dialog callback
   * 
   * @param {boolean} result Result
   */
  @autobind
  private async confirmPhaseDialogCallback(result: boolean) {
    if (result) {
      await this.changePhase(this.state.confirmPhase);
    } else {
      this.setState({ confirmPhase: null });
    }
  }

  /**
   * On <ProjectPhaseCallout /> dismiss
   */
  @autobind
  private async onProjectPhaseCalloutDismiss() {
    this.setState({ phaseMouseOver: null });
  }

  /**
   * On phase click
   * 
   * @param {Phase} phase Phase
   */
  private async onPhaseClick(phase: Phase) {
    if (this.props.confirmPhaseChange) {
      this.setState({ confirmPhase: phase });
    } else {
      await this.changePhase(phase);
    }
  }

  /**
   * Change phase
   * 
   * @param {Phase} phase Phase
   * @param {number} messageDurationMs Message duration in ms
   */
  private async changePhase(phase: Phase, messageDurationMs: number = 5000) {
    try {
      this.setState({ isChangingPhase: true });
      await this.updatePhase(phase);
      await this.modifiyFrontpageViews(phase.name);
      this.setState({
        currentPhase: phase,
        confirmPhase: null,
        showPhaseChangeMessage: true,
        isChangingPhase: false,
      });
      if (this.props.automaticReload) {
        window.setTimeout(() => {
          document.location.href = this.props.webAbsoluteUrl;
        }, (this.props.reloadTimeout * 5000));
      }
      window.setTimeout(() => {
        this.setState({ showPhaseChangeMessage: false });
      }, messageDurationMs);
    } catch (err) {
      this.setState({
        confirmPhase: null,
        showPhaseChangeMessage: true,
        isChangingPhase: false,
      });
    }
  }

  /**
   * Modify frontpage views
   * 
   * @param {string} phaseTermName Phase term name
   * @param {string} viewName View name
   */
  private async modifiyFrontpageViews(phaseTermName: string, viewName: string = 'Current phase') {
    const {
      web,
      updateViewsDocuments,
      updateViewsRisks,
      updateViewsTasks,
    } = this.props;

    const listsToUpdate = [
      updateViewsDocuments && strings.DocumentsListName,
      updateViewsRisks && strings.RiskRegisterListName,
      updateViewsTasks && strings.TasksListName,
    ].filter(l => l);
    const lists = web.lists;
    const viewsPromises = listsToUpdate.map(t => lists.getByTitle(t).views.get());
    const viewsResult = await Promise.all(viewsPromises);
    for (let i = 0; i < viewsResult.length; i++) {
      const listName = listsToUpdate[i];
      const [frontpageView] = viewsResult[i].filter(v => v.Title === viewName);
      if (frontpageView) {
        const pnpFrontpageView = lists.getByTitle(listName).views.getById(frontpageView.Id);
        const { ViewQuery } = await pnpFrontpageView.select('ViewQuery').get();
        const viewQueryDom = new DOMParser().parseFromString(`<Query>${ViewQuery}</Query>`, 'text/xml');
        const orderByDomElement = viewQueryDom.getElementsByTagName('OrderBy')[0];
        const orderBy = orderByDomElement ? orderByDomElement.outerHTML : '';
        try {
          await pnpFrontpageView.update({
            ViewQuery: [
              orderBy,
              `<Where>
              <Eq>
                <FieldRef Name='GtProjectPhase' />
                <Value Type='Text'>${phaseTermName}</Value>
              </Eq>
            </Where>`
            ].join('')
          });
          Logger.write(`(ProjectPhases) modifiyFrontpageViews:  Successfully updated ViewQuery for view '${viewName}' for list '${listName}'`, LogLevel.Info);
        } catch (err) {
          Logger.write(`(ProjectPhases) modifiyFrontpageViews: Failed to update ViewQuery for view '${viewName}' for list '${listName}'`, LogLevel.Error);
        }
      } else {
        Logger.write(`(ProjectPhases) modifiyFrontpageViews: No '${viewName}' view found for list '${listName}'`, LogLevel.Warning);
      }
    }
  }

  /**
   * Get phase properties
   * 
   * @param {Phase} phase Phase
   */
  private getPhaseProperties(phase: Phase): React.CSSProperties {
    const { clientWidth } = this.props.domElement;
    const widthPerElement = Math.floor((clientWidth * 0.8) / this.state.phases.length) - this.props.gutter;
    const phaseProperties: React.HTMLProps<HTMLDivElement> = {
      key: `Phase${phase.term.Name.replace(/\s/g, '')}`.toLowerCase(),
      className: `${styles.phaseItem} ${(this.state.currentPhase && phase.name === this.state.currentPhase.name) ? styles.phaseItemActive : ''}`,
      style: {
        width: widthPerElement,
        fontSize: this.props.fontSize,
        marginLeft: this.props.gutter,
      },
      onMouseOver: event => {
        this.setState({ phaseMouseOver: { htmlElement: event.currentTarget, model: phase } });
      },
    };
    if (this.props.currentUserManageWeb) {
      phaseProperties.onClick = e => this.onPhaseClick(phase);
      phaseProperties.style.cursor = 'pointer';
    }
    return phaseProperties;
  }

  /**
   * Fetch check point statuses
   * 
   * @param {string} listName List name
   */
  private async fetchCheckPointStatuses(listName: string = 'Fasesjekkliste'): Promise<{ [termGuid: string]: { [phase: string]: number } }> {
    try {
      const checkpoints = await sp.web.lists.getByTitle(listName).items.select('GtProjectPhase', 'GtChecklistStatus').get();
      const checkPointStatuses = checkpoints
        .filter(c => c.GtProjectPhase)
        .reduce((obj, c) => {
          const status = c.GtChecklistStatus.toLowerCase();
          const termGuid = c.GtProjectPhase.TermGuid;
          obj[termGuid] = obj[termGuid] ? obj[termGuid] : {};
          obj[termGuid][status] = obj[termGuid][status] ? obj[termGuid][status] + 1 : 1;
          return obj;
        }, {});
      return checkPointStatuses;
    } catch (e) {
      return {};
    }
  }

  /***
   * Fetch phase terms
   * 
   * @param {Object} checkPointStatuses Check point statuses
   */
  private async fetchData(checkPointStatuses: { [termGuid: string]: { [status: string]: number } }): Promise<{ currentPhase: Phase, phases: Array<Phase>, phaseTextField: string }> {
    Logger.log({ message: '(ProjectPhases) fetchData: Fetching TermSetId for selected field', data: { phaseField: this.props.phaseField }, level: LogLevel.Info });
    try {
      const phaseField = await this.props.web.fields.getByInternalNameOrTitle(this.props.phaseField).select('TermSetId').get();
      const phaseTextField = await this.props.web.fields.getByInternalNameOrTitle(`${this.props.phaseField}_0`).select('InternalName').get();
      const phaseTerms = await taxonomy.getDefaultSiteCollectionTermStore().getTermSetById(phaseField.TermSetId).terms.get();
      const phases = phaseTerms.filter(term => term.LocalCustomProperties.ShowOnFrontpage !== 'false').map(term => new Phase(term, checkPointStatuses[term.Id] || {}));
      const item = await this.spEntityPortalService.GetEntityItem(this.props.context.pageContext.legacyPageContext.groupId);
      let currentPhase: Phase = null;
      if (item && item.GtProjectPhase) {
        [currentPhase] = phases.filter(p => p.id.indexOf(item.GtProjectPhase.TermGuid) !== -1);
      }
      Logger.log({ message: '(ProjectPhases) fetchData: Successfully loaded phases', data: { phases: phases.map(p => p.name), currentPhase: currentPhase ? currentPhase.name : null, phaseTextField: phaseTextField.InternalName }, level: LogLevel.Info });
      return ({ currentPhase, phases, phaseTextField: phaseTextField.InternalName });
    } catch (err) {
      throw err;
    }
  }
}
