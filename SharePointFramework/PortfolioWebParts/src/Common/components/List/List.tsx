import * as React from 'react';
import * as unique from 'array-unique';
import styles from './List.module.scss';
import * as strings from 'CommonStrings';
import { IListProps } from './IListProps';
import { IListState } from './IListState';
import { DetailsList, IColumn, IGroup, SelectionMode, DetailsListLayoutMode, ConstrainMode } from "office-ui-fabric-react/lib/DetailsList";
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';
import { ExcelExportStatus } from '../../ExportToExcel';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import ModalLink from '../ModalLink/ModalLink';

export default class List extends React.Component<IListProps, IListState> {
  public static defaultProps: Partial<IListProps> = {
    groupByOptions: [],
    defaultGroupBy: { key: "NoGrouping", name: strings.NoGrouping },
  };

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      groupBy: this.props.defaultGroupBy
    };
  }

  public render() {
    let { items, columns, groups } = this._getFilteredData();
    console.log(groups);
    return (
      <div>
        {this._renderCommandBar()}
        <div hidden={!this.props.showSearchBox}>
          <SearchBox
            placeholder={strings.SearchBoxPlaceholder}
            onChanged={this._onSearch} />
        </div>
        <DetailsList
          items={items}
          columns={columns}
          groups={groups}
          // onRenderItemColumn={this._onRenderItemColumn}
        />
      </div>
    );
  }

  private _renderCommandBar() {
    const items: Array<ICommandBarItemProps> = [];
    const farItems: Array<ICommandBarItemProps> = [];

    if (this.props.groupByOptions.length > 0) {
      const noGrouping = {
        key: "NoGrouping",
        name: strings.NoGrouping,
      };
      const subItems = [noGrouping, ...this.props.groupByOptions].map(item => ({
        ...item,
        onClick: e => {
          e.preventDefault();
          this.setState({ groupBy: item });
        },
      }));
      items.push({
        key: "Group",
        name: this.state.groupBy.name,
        iconProps: { iconName: "GroupedList" },
        itemType: ContextualMenuItemType.Header,
        onClick: evt => evt.preventDefault(),
        subMenuProps: { items: subItems },
      });
    }

    if (this.props.excelExportEnabled && this.props.excelExportConfig) {
      items.push({
        key: "ExcelExport",
        name: this.props.excelExportConfig.buttonLabel,
        iconProps: {
          iconName: this.props.excelExportConfig.buttonIcon,
          styles: { root: { color: "green !important" } },
        },
        disabled: this.state.excelExportStatus === ExcelExportStatus.Exporting,
        onClick: evt => {
          evt.preventDefault();
          this._exportToExcel();
        },
      });
    }

    if (items.length > 0 || farItems.length > 0) {
      return (
        <CommandBar
          hidden={!this.props.showCommandBar}
          items={items}
          farItems={farItems}
        />
      );
    }
    return null;
  }

  private _onRenderItemColumn(item: any, index: number, column: IColumn) {
    let colValue = item[column.fieldName];
    switch (column.key) {
      case 'Title': {
        if (item.Path) {
/*           return (
            <ModalLink
              label={colValue}
              url={item.Path}
              options={{ HideRibbon: true }}
            />
          ); */
        }
      }
    }
  }

  private _getFilteredData(): { items: any[], columns: any[], groups: IGroup[] } {
    let columns = [].concat(this.props.columns);
    let groups: IGroup[] = null;
    if (this.state.groupBy.key !== 'NoGrouping') {
      const groupItems = this.props.items.sort((a, b) => a[this.state.groupBy.key] > b[this.state.groupBy.key] ? -1 : 1);
      console.log(groupItems);
      const groupNames = groupItems.map(g => g[this.state.groupBy.key]);
      groups = unique([].concat(groupNames)).map((name, idx) => ({
        key: idx,
        name: `${this.state.groupBy.name}: ${name}`,
        count: [].concat(groupNames).filter(n => n === name).length,
        isCollapsed: false,
        isShowingAll: true,
        isDropEnabled: false
      }));
    }
    const filteredItems = this.props.items.filter(itm => {
      const matches = Object.keys(itm).filter(key => {
        const value = itm[key];
        return value && typeof value === 'string' && value.toLowerCase().indexOf(this.state.searchTerm) !== -1;
      }).length;
      return matches > 0;
    });
    return {
      items: filteredItems,
      columns: columns,
      groups: groups
    };
  }

  private _exportToExcel() {
  }

  private _onSearch() {
  }

}
