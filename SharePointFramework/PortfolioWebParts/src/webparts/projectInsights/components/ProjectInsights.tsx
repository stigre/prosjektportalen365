import * as React from 'react';
import styles from './ProjectInsights.module.scss';
import { IProjectInsightsProps } from './IProjectInsightsProps';

export default class ProjectInsights extends React.Component<IProjectInsightsProps, {}> {
  public render(): React.ReactElement<IProjectInsightsProps> {
    return (
      <div className={styles.projectInsights}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Porteføljeinnsikt</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
