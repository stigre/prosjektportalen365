
import * as React from 'react';
import { Callout } from 'office-ui-fabric-react/lib/Callout';
import { IProjectPhaseCalloutProps } from './IProjectPhaseCalloutProps';
import styles from './ProjectPhaseCallout.module.scss';
import * as strings from 'ProjectPhasesWebPartStrings';

// ProjectPhaseCallout
export default class ProjectPhaseCallout extends React.Component<IProjectPhaseCalloutProps, {}> {
    /**
     * Constructor
     * 
     * @param {IProjectPhaseCalloutProps} props Initial props
     */
    constructor(props: IProjectPhaseCalloutProps) {
        super(props);
    }

    /**
     * Should component update
     * 
     * @param {IProjectPhaseCalloutProps} nextProps Next props
     */
    public shouldComponentUpdate(nextProps: IProjectPhaseCalloutProps): boolean {
        return (this.props.phase.model.term.Id !== nextProps.phase.model.term.Id);
    }

    /**
     * Renders the <ProjectPhaseCallout /> component
     */
    public render(): JSX.Element {
        const { htmlElement, model } = this.props.phase;
        return (
            <Callout
                gapSpace={0}
                target={htmlElement}
                onDismiss={this.props.onDismiss}
                setInitialFocus={true}
                hidden={false}>
                <div className={styles.projectPhaseCallout}>
                    <div className={styles.header}>
                        <p className={styles.title}>{model.name}</p>
                    </div>
                    <div className={styles.inner}>
                        <div className={styles.content}>
                            <p className={styles.subText}>{model.term.LocalCustomProperties.PhasePurpose}</p>
                            <div>
                                <div className={styles.checkPointStatus} hidden={Object.keys(model.checklistData.stats).length === 0}>
                                    {Object.keys(model.checklistData.stats).map(status => {
                                        return <div className={styles.addText}><span>{model.checklistData.stats[status]} {strings.CheckPointsMarkedAsText} {status}</span></div>;
                                    })}
                                </div>
                                <div className={styles.addText}><a href={this.getFilteredPhaseChecklistViewUrl()}>{strings.GoToPhaseChecklist}</a></div>
                                <div className={styles.addText}><a href='#' onClick={_ => this.props.onChangePhase(this.props.phase.model)}>{strings.ChangePhaseText}</a></div>
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