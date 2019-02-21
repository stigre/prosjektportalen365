import * as React from 'react';
import styles from './DeliveriesOverview.module.scss';
import { Spinner, SpinnerType } from "office-ui-fabric-react/lib/Spinner";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import { IDeliveriesOverviewProps, DeliveriesOverviewDefaultProps } from './IDeliveriesOverviewProps';
import { IDeliveriesOverviewState } from './IDeliveriesOverviewState';
import List from '../../../common/components/List/List';
import { sp } from '@pnp/sp';
import DataSourceService from '../../../common/services/DataSourceService';

export default class DeliveriesOverview extends React.Component<IDeliveriesOverviewProps, IDeliveriesOverviewState> {
  public static defaultProps = DeliveriesOverviewDefaultProps;

  /**
   * Constructor
   *
   * @param {IDeliveriesOverviewProps} props Props
   */
  constructor(props: IDeliveriesOverviewProps) {
    super(props);
    this.state = { isLoading: true };
  }

  public async componentDidMount(): Promise<void> {
    try {
      const items = await this.fetchItems();
      this.setState({ items, isLoading: false });
    } catch (error) {
      this.setState({ error, isLoading: false });
    }
  }

  public render(): React.ReactElement<IDeliveriesOverviewProps> {
    if (this.state.isLoading) {
      return (
        <div className={styles.deliveriesOverview}>
          <div className={styles.container}>
            <Spinner label='Laster prosjektleveranser...' type={SpinnerType.large} />
          </div>
        </div>
      );
    }
    if (this.state.error) {
      return (
        <div className={styles.deliveriesOverview}>
          <div className={styles.container}>
            <MessageBar messageBarType={MessageBarType.error}>{this.state.error}</MessageBar>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.deliveriesOverview}>
        <div className={styles.container}>
          <List
            items={this.state.items}
            columns={this.props.columns}
            showCommandBar={true}
            groupByOptions={this.props.groupByOptions}
            excelExportEnabled={this.props.excelExportEnabled} />
        </div>
      </div>
    );
  }

  /**
   * Fetch items
   */
  private async fetchItems() {
    const dataSource = await DataSourceService.getByName(this.props.dataSource);
    if (dataSource) {
      try {
        const { PrimarySearchResults } = await sp.search({
          ...dataSource,
          Querytext: "*",
          RowLimit: 500,
          TrimDuplicates: false,
          SelectProperties: ["Path", "SPWebUrl", ...this.props.columns.map(col => col.key)],
        });
        return PrimarySearchResults;
      } catch (err) {
        throw err;
      }
    } else {
      throw `Finner ingen datakilde med navn '${this.props.dataSource}.'`;
    }
  }
}
