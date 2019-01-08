import * as React from 'react';
import styles from './ProjectStatus.module.scss';
import { IProjectStatusProps } from './IProjectStatusProps';

export default class ProjectStatus extends React.Component<IProjectStatusProps, {}> {
  public render(): React.ReactElement<IProjectStatusProps> {
    return (
      <div className={styles.projectStatus}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <h1>Prosjektstatus</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
