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
import { autobind } from '@uifabric/utilities/lib';
import Modal from 'office-ui-fabric-react/lib/Modal';
import ProjectInfo from '../ProjectInfo/ProjectInfo';

export default class List extends React.Component<IListProps, IListState> {
  public static defaultProps: Partial<IListProps> = {
    groupByOptions: [],
    defaultGroupBy: { key: "NoGrouping", name: strings.NoGrouping },
  };

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      groupBy: this.props.defaultGroupBy,
      showModalDialog: false
    };
  }

  public render() {
    console.log(this.state.showModalDialog);
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
          onRenderItemColumn={this._onRenderItemColumn}
        />
        {this._renderProjectInfoModal()}
        <Modal
          isOpen={this.state.showModalDialog}
          onDismiss={() => this.setState({ showModalDialog: false })}
        >
          {/* TODO: BAD! Figure out better view */}
          <iframe src="https://pzlpart.sharepoint.com/sites/Prosjekt-6/Lists/Prosjektlogg/DispForm.aspx?ID=1" width='600' height='850' />
        </Modal>
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

  private _renderProjectInfoModal() {
    const showProjectInfo = this.state.showProjectInfo;
    if (showProjectInfo) {
      return (
        <ProjectInfo
          entity={null}
          pageContext={this.props.pageContext}
          showProjectInfo={showProjectInfo}
          onDismiss={() => this.setState({  showProjectInfo: null})}

        />
      );
    }
  }

  @autobind
  private _onRenderItemColumn(item: any, index: number, column: IColumn) {
    let colValue = item[column.fieldName];
    switch (column.key) {
      case 'Title': {
        if (item.Path) {
          return (
            <ModalLink
              showModalDialog={() => this.showModalDialog()}
              label={colValue}
              url={item.Path}
            // options={{ HideRibbon: true }}
            />
          );
        } else return colValue;
      }
      case 'SiteTitle': {
        return <a href={item.SPWebUrl} onClick={(e) => this._openProject(e, item)}>{item.SiteTitle}</a>;
      }
    }
  }

  private _openProject(e: React.MouseEvent<HTMLAnchorElement>, project: any) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ showProjectInfo: project });
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

  private showModalDialog() {
    console.log('clicked');
    this.setState({ showModalDialog: true });
  }

  private _exportToExcel() {
  }

  private _onSearch() {
  }

}
