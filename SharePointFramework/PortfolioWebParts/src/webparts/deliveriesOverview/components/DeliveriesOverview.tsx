import * as React from 'react';
import { IColumn } from "office-ui-fabric-react/lib/DetailsList";
import { Spinner, SpinnerType } from "office-ui-fabric-react/lib/Spinner";
import { autobind } from "office-ui-fabric-react/lib/Utilities";
import { IDeliveriesOverviewProps, DeliveriesOverviewDefaultProps } from './IDeliveriesOverviewProps';
import { IDeliveriesOverviewState } from './IDeliveriesOverviewState';
import List from '../../../common/components/List/List';
import { sp } from '@pnp/sp';

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
    } catch (err) {
      this.setState({ items: [], isLoading: false });
    }
  }

  public render(): React.ReactElement<IDeliveriesOverviewProps> {
    if (this.state.isLoading) {
      return <Spinner type={SpinnerType.large} />;
    }

    return (
      <List
        items={this.state.items}
        columns={this.props.columns}
        showCommandBar={true}
        groupByOptions={this.props.groupByOptions}
        excelExportEnabled={this.props.excelExportEnabled} />
    );
  }

  /**
   * Fetch items
   */
  private async fetchItems() {
    // const dataSourcesList = sp.web.lists.getByTitle('Datakilder');
    // const [dataSource] = await dataSourcesList.items.filter(`Title eq '${this.props.dataSource}'`).get();
    // if (dataSource) {
    try {
      const { PrimarySearchResults } = await sp.search({
        Querytext: "*",
        QueryTemplate: 'ContentTypeId:0x0100D7B74DE815F946D3B0F99D19F9B36B68*',
        RowLimit: 500,
        TrimDuplicates: false,
        SelectProperties: ["Path", "SPWebUrl", ...this.props.columns.map(col => col.key)],
      });
      return PrimarySearchResults;
    } catch (err) {
      throw err;
    }
    // } else {
    //   return [];
    // }
  }
}
