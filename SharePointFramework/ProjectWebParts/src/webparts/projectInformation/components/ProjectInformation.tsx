import * as React from 'react';
import styles from './ProjectInformation.module.scss';
import { IProjectInformationProps } from './IProjectInformationProps';
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";

export default class ProjectInformation extends React.Component<IProjectInformationProps, {}> {
  public render(): React.ReactElement<IProjectInformationProps> {
    return (
      <div className={styles.projectInformation}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <WebPartTitle
                displayMode={this.props.displayMode}
                title={this.props.title}
                updateProperty={this.props.updateTitle} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
