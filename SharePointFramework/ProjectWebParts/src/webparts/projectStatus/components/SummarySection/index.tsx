import * as React from 'react';
import styles from './SummarySection.module.scss';
import { ISummarySectionProps } from './ISummarySectionProps';
import { ISummarySectionState } from './ISummarySectionState';
import { DisplayMode } from '@microsoft/sp-core-library';
import StatusSectionBase from '../StatusSectionBase';
import StatusElement from './StatusElement';
import ProjectInformation from '../../../projectInformation/components/ProjectInformation';

export default class SummarySection extends StatusSectionBase<ISummarySectionProps, ISummarySectionState> {
    constructor(props: ISummarySectionProps) {
        super(props);
    }

    public render(): React.ReactElement<ISummarySectionProps> {
        const ProjectInformationProps = {
            title: 'Prosjektinformasjon',
            entityListName: 'Prosjekter',
            entityCtId: '0x0100805E9E4FEAAB4F0EABAB2600D30DB70C',
            entityFieldsGroup: 'Prosjektportalenkolonner',
            displayMode: DisplayMode.Read,
            updateTitle: () => { },
            context: this.props.context,
            hideEditPropertiesButton: true,
        };

        return (
            <div className={styles.summarySection}>
                <div className={styles.container}>
                    <div className={styles.row}>
                        <div className={styles.column6}>
                            <ProjectInformation {...ProjectInformationProps} />
                        </div>
                        <div className={styles.column6}>
                            <div className={styles.container}>
                                <div className={styles.row}>
                                    <div className={styles.column12}>
                                        <StatusElement label='Overordnet status' value='' iconName='StatusCircleRing' />
                                    </div>
                                    <div className={styles.column6}>
                                        <StatusElement label='Fremdrift' value='' iconName='AwayStatus' />
                                    </div>
                                    <div className={styles.column6}>
                                        <StatusElement label='Økonomi' value='' iconName='Money' />
                                    </div>
                                    <div className={styles.column6}>
                                        <StatusElement label='Kvalitet' value='' iconName='Equalizer' />
                                    </div>
                                    <div className={styles.column6}>
                                        <StatusElement label='Risiko' value='' iconName='Warning' />
                                    </div>
                                    <div className={styles.column6}>
                                        <StatusElement label='Gevinstoppnåelse' value='' iconName='Wines' />
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
