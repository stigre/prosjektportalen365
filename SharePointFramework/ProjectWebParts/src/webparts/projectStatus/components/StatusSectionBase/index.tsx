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
            const { entityFields, entityItem } = this.props;
            return this.props.fieldNames.map(fieldName => {
                const [fld] = entityFields.filter(ef => ef.InternalName === fieldName);
                if (fld) {
                    return (
                        <div className={styles.statusSectionField}>
                            <div className={styles.statusSectionFieldInner}>
                                <div className={styles.statusSectionFieldLabel}>{fld.Title}</div>
                                <div className={styles.statusSectionFieldValue}>{entityItem[fieldName]}</div>
                            </div>
                        </div>
                    );
                }
                return null;
            });
        }
        return null;
    }
}
