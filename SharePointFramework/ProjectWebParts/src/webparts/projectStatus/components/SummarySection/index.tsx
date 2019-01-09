import * as React from 'react';
import styles from './SummarySection.module.scss';
import { ISummarySectionProps } from './ISummarySectionProps';
import { ISummarySectionState } from './ISummarySectionState';
import StatusSectionBase from '../StatusSectionBase';
import StatusElement from '../StatusElement';
import ProjectInformation from '../../../projectInformation/components/ProjectInformation';

export default class SummarySection extends StatusSectionBase<ISummarySectionProps, ISummarySectionState> {
    constructor(props: ISummarySectionProps) {
        super(props);
    }

    public render(): React.ReactElement<ISummarySectionProps> {
        const data = this.props.report.item;

        return (
            <div className={styles.summarySection}>
                <div className={styles.container}>
                    <div className={styles.row}>
                        <div className={styles.column6}>
                            <ProjectInformation
                                title='Prosjektinformasjon'
                                context={this.props.context}
                                hideEditPropertiesButton={true}
                                {...this.props.projectInformation} />
                        </div>
                        <div className={styles.column6}>
                            <div className={styles.container}>
                                <div className={styles.row}>
                                    <div className={styles.column6}>
                                        <StatusElement label='Overordnet status' value='' comment={data.GtOverallStatus} iconName='StatusCircleRing' />
                                    </div>
                                    <div className={styles.column6}>
                                        <StatusElement label='Fremdrift' value={data.GtStatusTime} comment={data.GtStatusTimeComment} iconName='AwayStatus' />
                                    </div>
                                    <div className={styles.column6}>
                                        <StatusElement label='Økonomi' value={data.GtStatusBudget}  comment={data.GtStatusBudgetComment} iconName='Money' />
                                    </div>
                                    <div className={styles.column6}>
                                        <StatusElement label='Kvalitet' value={data.GtStatusQuality} comment={data.GtStatusQualityComment} iconName='Equalizer' />
                                    </div>
                                    <div className={styles.column6}>
                                        <StatusElement label='Risiko' value={data.GtStatusRisk} comment={data.GtStatusRiskComment} iconName='Warning' />
                                    </div>
                                    <div className={styles.column6}>
                                        <StatusElement label='Gevinstoppnåelse' value={data.GtStatusGainAchievement} comment={data.GtStatusGainAchievementComment} iconName='Wines' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
