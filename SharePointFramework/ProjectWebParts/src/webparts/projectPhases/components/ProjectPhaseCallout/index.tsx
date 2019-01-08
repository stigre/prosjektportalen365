
import * as React from 'react';
import { Callout } from 'office-ui-fabric-react/lib/Callout';
import { IProjectPhaseCalloutProps } from './IProjectPhaseCalloutProps';
import styles from './ProjectPhaseCallout.module.scss';

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
        const { htmlElement, model: { term, checkPointStatus } } = this.props.phase;
        return (
            <Callout
                gapSpace={0}
                target={htmlElement}
                onDismiss={this.props.onDismiss}
                setInitialFocus={true}
                hidden={false}>
                <div className={styles.projectPhaseCallout}>
                    <div className={styles.header}>
                        <p className={styles.title}>{term.Name}</p>
                    </div>
                    <div className={styles.inner}>
                        <div className={styles.content}>
                            <p className={styles.subText}>{term.LocalCustomProperties.PhasePurpose}</p>
                            <hr />
                            <div>
                                {Object.keys(checkPointStatus).map(status => {
                                    return <div className={styles.addText}><span>{checkPointStatus[status]} check points marked as {status}</span></div>;
                                })}
                                <div className={styles.addText}><a href={this.getFilteredPhaseChecklistViewUrl()}>Go to phase checklist</a></div>
                            </div>

                        </div>
                    </div>
                </div>
            </Callout>
        );
    }

    protected getFilteredPhaseChecklistViewUrl(): string {
        return `${this.props.phaseChecklistViewUrl}?FilterField1=GtProjectPhase&FilterValue1=${this.props.phase.model.term.Name}`;
    }
}