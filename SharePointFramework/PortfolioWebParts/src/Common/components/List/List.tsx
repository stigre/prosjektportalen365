import * as React from 'react';
import * as unique from 'array-unique';
import * as strings from 'CommonStrings';
import { IListProps } from './IListProps';
import { IListState } from './IListState';
import { DetailsList, IColumn, IGroup, SelectionMode, DetailsListLayoutMode } from 'office-ui-fabric-react/lib/DetailsList';
import { CommandBar, ICommandBarItemProps, ICommandBarProps } from 'office-ui-fabric-react/lib/CommandBar';
import { ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';

export default class List extends React.Component<IListProps, IListState> {
  public static defaultProps: Partial<IListProps> = {
    groupByOptions: [],
    defaultGroupBy: { key: 'NoGrouping', name: strings.NoGrouping },
    layoutMode: DetailsListLayoutMode.justified,
  };

  /**
   * Constructor
   *
   * @param {IListProps} props Props
   */
  constructor(props: IListProps) {
    super(props);
    this.state = { searchTerm: '', groupBy: this.props.defaultGroupBy };
  }

  /**
   * Renders the <List /> component
   */
  public render() {
    let { items, columns, groups } = this.getFilteredData();
    return (
      <div>
        <CommandBar {...this.getCommandBarProps()} />
        <div hidden={!this.props.showSearchBox}>
          <SearchBox
            placeholder={strings.SearchBoxPlaceholder}
            onChanged={this.onSearch} />
        </div>
        <DetailsList
          items={items}
          columns={columns}
          groups={groups}
          onRenderItemColumn={this.onRenderItemColumn}
          selectionMode={SelectionMode.none}
          layoutMode={this.props.layoutMode} />
      </div>
    );
  }

  /**
   * Get command bar props
   */
  private getCommandBarProps(): ICommandBarProps {
    const items: Array<ICommandBarItemProps> = [];
    const farItems: Array<ICommandBarItemProps> = [];

    if (this.props.groupByOptions.length > 0) {
      const noGrouping = {
        key: 'NoGrouping',
        name: strings.NoGrouping,
      };
      const subItems = [noGrouping, ...this.props.groupByOptions].map(item => ({
        ...item,
        onClick: (event: any) => {
          event.preventDefault();
          this.setState({ groupBy: item });
        },
      }));
      items.push({
        key: 'Group',
        name: this.state.groupBy.name,
        iconProps: { iconName: 'GroupedList' },
        itemType: ContextualMenuItemType.Header,
        onClick: evt => evt.preventDefault(),
        subMenuProps: { items: subItems },
      });
    }

    if (this.props.excelExportEnabled && this.props.excelExportConfig) {
      // items.push({
      //   key: 'ExcelExport',
      //   name: this.props.excelExportConfig.buttonLabel,
      //   iconProps: {
      //     iconName: this.props.excelExportConfig.buttonIcon,
      //     styles: { root: { color: 'green !important' } },
      //   },
      //   disabled: this.state.excelExportStatus === ExcelExportStatus.Exporting,
      //   onClick: evt => {
      //     evt.preventDefault();
      //     this.exportToExcel();
      //   },
      // });
    }

    return { hidden: !this.props.showCommandBar, items, farItems };
  }


  @autobind
  private onRenderItemColumn(item: any, _index: number, column: IColumn) {
    let colValue = item[column.fieldName];
    switch (column.key) {
      case 'Title': {
        if (item.Path) {
          return <a href={item.Path} target='_blank'>{colValue}</a>;
        }
        return colValue;
      }
      case 'SiteTitle': {
        return <a href={item.SPWebUrl} target='_blank'>{item.SiteTitle}</a>;
      }
    }
    return colValue;
  }

  /**
   * Get filtered data
   */
  private getFilteredData(): { items: any[], columns: any[], groups: IGroup[] } {
    let columns = [].concat(this.props.columns);
    let groups: IGroup[] = null;
    if (this.state.groupBy.key !== 'NoGrouping') {
      const groupItems = this.props.items.sort((a, b) => a[this.state.groupBy.key] > b[this.state.groupBy.key] ? -1 : 1);
      const groupNames = groupItems.map(g => g[this.state.groupBy.key]);
      groups = unique([].concat(groupNames)).map((name: any, idx: any) => ({
        key: idx,
        name: `${this.state.groupBy.name}: ${name}`,
        count: [].concat(groupNames).filter(n => n === name).length,
        isCollapsed: false,
        isShowingAll: true,
        isDropEnabled: false
      }));
    }
    const items = this.props.items.filter(itm => {
      const matches = Object.keys(itm).filter(key => {
        const value = itm[key];
        return value && typeof value === 'string' && value.toLowerCase().indexOf(this.state.searchTerm) !== -1;
      }).length;
      return matches > 0;
    });
    return { items, columns, groups };
  }

  @autobind
  private exportToExcel() {

  }

  @autobind
  private onSearch(searchTerm: string) {
    this.setState({ searchTerm });
  }
}
