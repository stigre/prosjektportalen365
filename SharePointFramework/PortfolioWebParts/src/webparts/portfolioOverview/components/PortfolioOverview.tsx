import * as React from 'react';
import styles from './PortfolioOverview.module.scss';
import { IPortfolioOverviewProps } from './IPortfolioOverviewProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class PortfolioOverview extends React.Component<IPortfolioOverviewProps, {}> {
  public render(): React.ReactElement<IPortfolioOverviewProps> {
    return (
      <div className={styles.portfolioOverview}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Porteføljeoversikt</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
