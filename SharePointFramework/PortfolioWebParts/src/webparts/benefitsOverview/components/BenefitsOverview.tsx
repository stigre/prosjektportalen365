import * as React from 'react';
import styles from './BenefitsOverview.module.scss';
import { IBenefitsOverviewProps } from './IBenefitsOverviewProps';

export default class BenefitsOverview extends React.Component<IBenefitsOverviewProps, {}> {
  public render(): React.ReactElement<IBenefitsOverviewProps> {
    return (
      <div className={styles.benefitsOverview}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Erfaringslogg</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
