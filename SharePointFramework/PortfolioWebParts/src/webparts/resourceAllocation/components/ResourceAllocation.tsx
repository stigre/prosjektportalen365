import * as React from 'react';
import styles from './ResourceAllocation.module.scss';
import { IResourceAllocationProps } from './IResourceAllocationProps';

export default class ResourceAllocation extends React.Component<IResourceAllocationProps, {}> {
  public render(): React.ReactElement<IResourceAllocationProps> {
    return (
      <div className={styles.resourceAllocation}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Ressursallokering</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
