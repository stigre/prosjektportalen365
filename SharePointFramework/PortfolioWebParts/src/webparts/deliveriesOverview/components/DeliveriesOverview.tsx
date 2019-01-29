import * as React from 'react';
import styles from './DeliveriesOverview.module.scss';
import { IDeliveriesOverviewProps } from './IDeliveriesOverviewProps';

export default class DeliveriesOverview extends React.Component<IDeliveriesOverviewProps, {}> {
  public render(): React.ReactElement<IDeliveriesOverviewProps> {
    return (
      <div className={styles.deliveriesOverview}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Leveranseoversikt</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
