import * as React from 'react';
import styles from './StatusSectionBase.module.scss';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { IStatusSectionBaseProps } from './IStatusSectionBaseProps';
import { IStatusSectionBaseState } from './IStatusSectionBaseState';

export default class StatusSectionBase<P extends IStatusSectionBaseProps, S extends IStatusSectionBaseState> extends React.Component<P, S> {
    constructor(props: P) {
        super(props);
    }

    public render(): React.ReactElement<P> {
        return (
            <div className={styles.statusSectionBase}>
            </div>
        );
    }

    public renderFields() {
        if (this.props.fieldNames) {
            const data = this.props.report.item;
            const entityFields = this.props.entityFields;
            return (
                <div className={styles.statusSectionField}>
                    <div className={styles.statusSectionFieldInner}>
                        <div className={styles.statusSectionFieldLabel}>Prosjektnavn i økonomisystemet</div>
                        <div className={styles.statusSectionFieldValue}>Eureka</div>
                    </div>
                </div>
            );
        }
        return null;
    }
}
