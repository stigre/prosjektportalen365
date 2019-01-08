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
import initSpfxJsom, { ExecuteJsomQuery, JsomContext } from 'spfx-jsom';

export default class ProjectPhases extends React.Component<IProjectPhasesProps, IProjectPhasesState> {
  protected _jsomCtx: JsomContext;

  /**
   * Constructor
   * 
   * @param {IProjectPhasesProps} props Initial props
   */
  constructor(props: IProjectPhasesProps) {
    super(props);
    this.state = { isLoading: true };
  }

  /**
   * Component will mount
   */
  public async componentDidMount() {
    if (this.props.phaseField) {
      const checkPointStatuses = await this.fetchCheckPointStatuses();
      const { phases, currentPhase } = await this.fetchPhaseTerms(checkPointStatuses);
      this.setState({
        isLoading: false,
        currentPhase,
        phases,
        checkPointStatuses,
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
      const { phases } = await this.fetchPhaseTerms(this.state.checkPointStatuses);
      this.setState({ isLoading: false, phases });
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
        <div hidden={!this.state.showPhaseChangeMessage} style={{ marginTop: 20 }}>
          <MessageBar messageBarType={MessageBarType.info}>
            <p>{format(strings.PhaseChangedMessage, this.state.currentPhase)}</p>
          </MessageBar>
        </div>
        {this.state.confirmPhase && (
          <ConfirmPhaseDialog
            phase={this.state.confirmPhase}
            callbackFunction={this._confirmPhaseDialogCallback}
            isBlocking={true}
            isChangingPhase={this.state.isChangingPhase} />
        )}
        {this.state.phaseMouseOver && (
          <ProjectPhaseCallout
            phase={this.state.phaseMouseOver}
            phaseSubTextProperty={this.props.phaseSubTextProperty}
            phaseChecklistViewUrl={`${this.props.webAbsoluteUrl}/Lists/PhaseChecklist/AllItems.aspx`}
            onDismiss={this._onProjectPhaseCalloutDismiss} />
        )}
      </div>
    );
  }

  /**
   * Update phase in web property bag
   * 
   * NOTE: Using spfx-jsom since updating property bag is not supported in @pnp/sp
   * 
   * @param {string} value Value
   */
  private async updatePhasePropBag(value: string) {
    if (!this._jsomCtx) {
      this._jsomCtx = await initSpfxJsom(this.props.webAbsoluteUrl);
    }
    const { web } = this._jsomCtx;
    web.get_allProperties().set_item(strings.PersistedPhasePropertyBagKey, value);
    web.update();
    try {
      await ExecuteJsomQuery(this._jsomCtx, [{ clientObject: web }]);
      Logger.log({ message: '(ProjectPhases) Successfully updated property bag with new phase', data: { key: strings.PersistedPhasePropertyBagKey, value }, level: LogLevel.Info });
      return true;
    } catch ({ sender, args }) {
      Logger.log({ message: '(ProjectPhases) Failed to update property bag with new phase', data: { key: strings.PersistedPhasePropertyBagKey, value, message: args.get_message() }, level: LogLevel.Error });
      throw args.get_message();
    }
  }

  /**
   * Confirm phase dialog callback
   * 
   * @param {boolean} result Result
   */
  @autobind
  private async _confirmPhaseDialogCallback(result: boolean) {
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
  private async _onProjectPhaseCalloutDismiss() {
    this.setState({ phaseMouseOver: null });
  }

  /**
   * On phase click
   * 
   * @param {Phase} phase Phase
   */
  private async onPhaseClick(phase: Phase) {
    const phaseTermName = phase.term.Name;
    if (this.props.confirmPhaseChange) {
      this.setState({ confirmPhase: phaseTermName });
    } else {
      await this.changePhase(phaseTermName);
    }
  }

  /**
   * Change phase
   * 
   * @param {string} phaseName Phase name
   * @param {number} messageDurationMs Message duration in ms
   */
  private async changePhase(phaseName: string, messageDurationMs: number = 5000) {
    try {
      this.setState({ isChangingPhase: true });
      await this.updatePhasePropBag(phaseName);
      await this.modifiyFrontpageViews(phaseName);
      this.setState({
        currentPhase: phaseName,
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
      this.setState({ isChangingPhase: false });
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

    const listsToUpdate = [updateViewsDocuments && 'Project Documents', updateViewsRisks && 'Risk Register', updateViewsTasks && 'Tasks'].filter(l => l);
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
          Logger.write(`(ProjectPhases) Successfully updated ViewQuery for view '${viewName}' for list '${listName}'`, LogLevel.Info);
        } catch (err) {
          Logger.write(`(ProjectPhases) Failed to update ViewQuery for view '${viewName}' for list '${listName}'`, LogLevel.Error);
        }
      } else {
        Logger.write(`(ProjectPhases) No '${viewName}' view found for list '${listName}'`, LogLevel.Warning);
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
      key: `Phase_${phase.term.Name.replace(/\s/g, '_')}`.toLowerCase(),
      className: `${styles.phaseItem} ${phase.term.Name === this.state.currentPhase ? styles.phaseItemActive : ''}`,
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
  private async fetchCheckPointStatuses(listName: string = 'Phase Checklist'): Promise<{ [termGuid: string]: { [phase: string]: number } }> {
    try {
      const checkpoints = await sp.web.lists.getByTitle(listName).items.select('GtProjectPhase', 'GtChecklistStatus').get();
      const checkPointStatuses = checkpoints
        .filter(c => c.GtProjectPhase)
        .reduce((obj, c) => {
          const status = c.GtChecklistStatus.toLowerCase();
          const termGuid = c.GtProjectPhase.TermGuid;
          const id = `/Guid(${termGuid})/`;
          obj[id] = obj[id] ? obj[id] : {};
          obj[id][status] = obj[id][status] ? obj[id][status] + 1 : 1;
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
  private async fetchPhaseTerms(checkPointStatuses: { [termGuid: string]: { [status: string]: number } }): Promise<{ currentPhase: string, phases: Array<Phase> }> {
    Logger.log({ message: '(ProjectPhases) Fetching TermSetId for selected field.', data: { phaseField: this.props.phaseField }, level: LogLevel.Info });
    try {
      const [phaseField, allProperties] = await Promise.all([
        this.props.web.fields.getByInternalNameOrTitle(this.props.phaseField).select('TermSetId').get(),
        this.props.web.allProperties.get(),
      ]);
      const phaseTerms = await taxonomy.getDefaultSiteCollectionTermStore().getTermSetById(phaseField.TermSetId).terms.get();
      let phases = phaseTerms
        .filter(term => term.LocalCustomProperties.ShowOnFrontpage !== 'false')
        .map(term => new Phase(term, checkPointStatuses[term.Id] || {}));
      const currentPhase = allProperties[strings.PersistedPhasePropertyBagKey.replace(/\_/g, '_x005f_')];
      Logger.log({ message: '(ProjectPhases) Successfully loaded phases.', data: { phases: phases.map(p => p.term.Name), currentPhase }, level: LogLevel.Info });
      return ({ currentPhase, phases });
    } catch (err) {
      throw err;
    }
  }
}
