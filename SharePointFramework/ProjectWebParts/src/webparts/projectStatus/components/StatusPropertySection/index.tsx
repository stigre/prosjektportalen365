import * as React from 'react';
import styles from './StatusPropertySection.module.scss';
import { IStatusPropertySectionProps } from './IStatusPropertySectionProps';
import { IStatusPropertySectionState } from './IStatusPropertySectionState';
import StatusSectionBase from '../StatusSectionBase';
import StatusElement from '../StatusElement';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { DetailsList, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { sp } from '@pnp/sp';

export default class StatusPropertySection extends StatusSectionBase<IStatusPropertySectionProps, IStatusPropertySectionState> {
  constructor(props: IStatusPropertySectionProps) {
    super(props);
  }

  public async componentDidMount() {

    if (this.props.headerProps.source && this.props.headerProps.source.match('Lists')) {
      await this.fetchListData(this.props.headerProps.source);
    }

  }

  public render(): React.ReactElement<IStatusPropertySectionProps> {
    const data = this.props.report.item;

    let navUrl = null;
    if (this.props.headerProps.source) {
      navUrl = `${this.props.context.pageContext.web.serverRelativeUrl}/${this.props.headerProps.source}`;
    }

    return (
      <div className={styles.statusPropertySection}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={`${styles.statusPropertySectionHeader} ${styles.column12}`}>
              <StatusElement {...this.props.headerProps} iconColumnWidth='column1' bodyColumnWidth='column11' />
            </div>
            {(navUrl) && <div className={styles.sectionIconContainer}>
              <a href={navUrl}>
                <Icon iconName='Forward' />
              </a>
            </div>}
            <div className={`${styles.statusPropertySectionFields} ${styles.column12}`}>
              {super.renderFields()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private async fetchListData(source: string) {
    let listTitle = source.replace('Lists/', '');
    listTitle = listTitle.replace(/\/(.*)/, '');

    let listItems = await sp.web.lists.getByTitle(listTitle).items.get();
    this.setState({ listItems });

  }

}
