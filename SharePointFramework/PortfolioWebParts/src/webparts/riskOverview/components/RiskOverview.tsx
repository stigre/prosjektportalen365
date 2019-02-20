import * as React from 'react';
import styles from './RiskOverview.module.scss';
import { IRiskOverviewProps } from './IRiskOverviewProps';

export default class RiskOverview extends React.Component<IRiskOverviewProps, {}> {
  public render(): React.ReactElement<IRiskOverviewProps> {
    return (
      <div className={styles.riskOverview}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Risikooversikt</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
