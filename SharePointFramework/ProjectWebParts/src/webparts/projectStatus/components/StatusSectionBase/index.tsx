import * as React from 'react';
import styles from './StatusSectionBase.module.scss';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';

export default class StatusSectionBase<P, S> extends React.Component<P, S> {
    constructor(props: P) {
        super(props);
    }

    public render(): React.ReactElement<P> {
        return (
            <div className={styles.statusSectionBase}>
            </div>
        );
    }
}
