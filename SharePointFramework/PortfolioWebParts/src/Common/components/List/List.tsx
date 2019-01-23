import * as React from 'react';
import styles from './List.module.scss';
import * as strings from 'CommonStrings';
import { IListProps } from './IListProps';
import { IListState } from './IListState';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';
import { ExcelExportStatus } from '../../ExportToExcel';

export default class List extends React.Component<IListProps, IListState> {
  public static defaultProps: Partial<IListProps> = {
    groupByOptions: [],
    defaultGroupBy: { key: "NoGrouping", name: strings.NoGrouping },
  };

  constructor(props) {
    super(props);

    this.state = {
      groupBy: this.props.defaultGroupBy
    };

  }

  public render() {
    return (
      <div>
        {this._renderCommandBar()}
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

    return (
      <CommandBar
        hidden={!this.props.showCommandBar}
        items={items}
        farItems={farItems}
      />
    );
  }

  private _exportToExcel() {
    console.log('exporting');
  }

}
