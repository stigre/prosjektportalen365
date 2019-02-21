import * as React from 'react';
import styles from './RiskOverview.module.scss';
import * as strings from 'RiskOverviewWebPartStrings';
import { IRiskOverviewProps, RiskOverviewDefaultProps } from './IRiskOverviewProps';
import { IRiskOverviewState } from './IRiskOverviewState';
import { Spinner, SpinnerType } from "office-ui-fabric-react/lib/Spinner";
import { DetailsListLayoutMode } from "office-ui-fabric-react/lib/DetailsList";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import List from '../../../common/components/List/List';
import { sp } from '@pnp/sp';
import DataSourceService from '../../../common/services/DataSourceService';

export default class RiskOverview extends React.Component<IRiskOverviewProps, IRiskOverviewState> {
  public static defaultProps = RiskOverviewDefaultProps;
  /**
   * Constructor
   *
   * @param {IRiskOverviewProps} props Props
   */
  constructor(props: IRiskOverviewProps) {
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

  public render(): React.ReactElement<IRiskOverviewProps> {
    if (this.state.isLoading) {
      return (
        <div className={styles.riskOverview}>
          <div className={styles.container}>
            <Spinner label={strings.LoadingText} type={SpinnerType.large} />
          </div>
        </div>
      );
    }
    if (this.state.error) {
      return (
        <div className={styles.riskOverview}>
          <div className={styles.container}>
            <MessageBar messageBarType={MessageBarType.error}>{this.state.error}</MessageBar>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.riskOverview}>
        <div className={styles.container}>
          <List
            items={this.state.items}
            columns={this.props.columns}
            layoutMode={DetailsListLayoutMode.fixedColumns}
            showCommandBar={this.props.showCommandBar}
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
