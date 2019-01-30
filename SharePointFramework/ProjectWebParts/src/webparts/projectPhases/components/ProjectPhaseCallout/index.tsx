
import * as React from 'react';
import { Callout } from 'office-ui-fabric-react/lib/Callout';
import { IProjectPhaseCalloutProps } from './IProjectPhaseCalloutProps';
import styles from './ProjectPhaseCallout.module.scss';
import * as strings from 'ProjectPhasesWebPartStrings';

// ProjectPhaseCallout
export default class ProjectPhaseCallout extends React.PureComponent<IProjectPhaseCalloutProps, {}> {
    /**
     * Constructor
     * 
     * @param {IProjectPhaseCalloutProps} props Initial props
     */
    constructor(props: IProjectPhaseCalloutProps) {
        super(props);
    }

    /**
     * Renders the <ProjectPhaseCallout /> component
     */
    public render(): JSX.Element {
        const { phase, isCurrentPhase, onChangePhase } = this.props;
        return (
            <Callout
                gapSpace={0}
                target={phase.htmlElement}
                onDismiss={this.props.onDismiss}
                setInitialFocus={true}
                hidden={false}>
                <div className={styles.projectPhaseCallout}>
                    <div className={styles.header}>
                        <p className={styles.title}>{phase.model.name}</p>
                    </div>
                    <div className={styles.inner}>
                        <div className={styles.content}>
                            <p className={styles.subText}>{phase.model.term.LocalCustomProperties.PhasePurpose}</p>
                            <div>
                                <div className={styles.checkPointStatus} hidden={Object.keys(phase.model.checklistData.stats).length === 0}>
                                    {Object.keys(phase.model.checklistData.stats).map(status => {
                                        return <div className={styles.addText}><span>{phase.model.checklistData.stats[status]} {strings.CheckPointsMarkedAsText} {status}</span></div>;
                                    })}
                                </div>
                                <div className={styles.addText}>
                                    <a href={this.getFilteredPhaseChecklistViewUrl()}>{strings.GoToPhaseChecklist}</a>
                                </div>
                                <div className={styles.addText} hidden={isCurrentPhase}>
                                    <a href='#' onClick={_ => onChangePhase(phase.model)}>{strings.ChangePhaseText}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Callout>
        );
    }

    protected getFilteredPhaseChecklistViewUrl(): string {
        return `${strings.PhaseChecklistViewUrl}?FilterField1=GtProjectPhase&FilterValue1=${this.props.phase.model.term.Name}`;
    }
}