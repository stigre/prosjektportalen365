import * as React from 'react';
import { DetailsList, DetailsListLayoutMode, IColumn } from "office-ui-fabric-react/lib/DetailsList";
import { Spinner, SpinnerType } from "office-ui-fabric-react/lib/Spinner";
import { autobind } from "office-ui-fabric-react/lib/Utilities";
import { IDeliveriesOverviewProps, DeliveriesOverviewDefaultProps } from './IDeliveriesOverviewProps';
import { IDeliveriesOverviewState } from './IDeliveriesOverviewState';
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
      return (
        <Spinner type={SpinnerType.large} />
      );
    }

    return (
      <DetailsList
        items={this.state.items}
        columns={this.props.columns}
        layoutMode={DetailsListLayoutMode.justified}
        onRenderItemColumn={this.onRenderItemColumn} />
    );
  }

  @autobind
  private onRenderItemColumn(item: any, index: number, column: IColumn) {
    let colValue = item[column.fieldName];
    switch (column.key) {
      case 'Title': {
        if (item.Path) {
          return <a href={item.Path} target="_blank">{colValue}</a>;
        }
        return colValue;
      }
      case 'SiteTitle': {
        return <a href={item.SPWebUrl} target="_blank">{item.SiteTitle}</a>;
      }
    }
    return colValue;
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
      console.log(PrimarySearchResults);
      return PrimarySearchResults;
    } catch (err) {
      throw err;
    }
    // } else {
    //   return [];
    // }
  }
}
