import * as React from 'react';
import styles from './StatusElement.module.scss';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { IStatusElementProps } from './IStatusElementProps';

const StatusElement = (props: IStatusElementProps) => {
    return (
        <div className={styles.statusElement}>
            <div className={styles.row}>
                <div className={`${styles.statusElementIcon} ${styles.column2}`}>
                    <Icon iconName={props.iconName} />
                </div>
                <div className={styles.column10}>
                    <div className={styles.statusElementLabel}>{props.label}</div>
                </div>
            </div>
        </div>
    );
};

export default StatusElement;
