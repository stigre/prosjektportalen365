import * as React from 'react';
import styles from './PortfolioOverview.module.scss';
import * as strings from 'PortfolioOverviewWebPartStrings';
import { IPortfolioOverviewProps } from './IPortfolioOverviewProps';
import { IPortfolioOverviewState } from './IPortfolioOverviewState';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { CommandBar, ICommandBarItemProps, ICommandBarProps } from 'office-ui-fabric-react/lib/CommandBar';
import { ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as PortfolioOverviewConfig from '../config/PortfolioOverviewConfig';
import { CreateJsomContext, ExecuteJsomQuery } from 'jsom-ctx';
import { queryProjects } from './PortfolioOverViewSearch';
import PortfolioOverviewFilterPanel from './PortfolioOverviewFilterPanel/PortfolioOverviewFilterPanel';
import PortfolioOverviewFieldSelector from './PortfolioOverviewFieldSelector';

export default class PortfolioOverview extends React.Component<IPortfolioOverviewProps, IPortfolioOverviewState> {
  public static defaultProps: Partial<IPortfolioOverviewProps> = {
    groupByOptions: [{ name: strings.ProjectLabel, key: 'SiteTitle' }],
    defaultGroupBy: { key: "NoGrouping", name: strings.NoGrouping },
    defaultSortFunction: (a, b) => a.Title > b.Title ? 1 : -1,
    viewSelectorEnabled: true
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      groupBy: this.props.defaultGroupBy,
      currentFilters: {},
      items: ['test']
    };
  }

  public async componentDidMount() {
    try {
      const data = await this.fetchInitialData();
      await this.updateState({ ...data, isLoading: false });
      if (this.props.viewSelectorEnabled) {
        this.setUrlHash({ viewId: this.state.currentView.id.toString() });
      }
    } catch (errorMessage) {
      this.setState({ errorMessage, isLoading: false });
    }
  }

  public render(): React.ReactElement<IPortfolioOverviewProps> {
    console.log(this.state.errorMessage);
    if (this.state.isLoading) return <Spinner label={strings.LoadingText} size={SpinnerSize.large} />;
    return (
      <div className={styles.portfolioOverview}>
        <CommandBar {...this.getCommandBarProps()} />
        <div className={styles.container}>
          {this.renderSearchBox()}
          {this.renderStatusBar()}
        </div>
      </div>
    );
  }

  private renderFilterPanel() {
    return (
      <PortfolioOverviewFilterPanel
        isOpen={false}
        onDismiss={null}
        filters={[]}
        showIcons={false}
        onFilterChange={null}
      />
    );
  }

  private async fetchInitialData(): Promise<Partial<IPortfolioOverviewState>> {
    let hashState = this.getUrlHash();
    const jsomCtx = await CreateJsomContext(this.props.pageContext.web.absoluteUrl);
    const permissions = new SP.BasePermissions();
    permissions.set(31);
    const canUserManageWeb = jsomCtx.web.doesUserHavePermissions(permissions);
    await ExecuteJsomQuery(jsomCtx);
    const config = await PortfolioOverviewConfig.getConfig();

    let currentView;

    if (this.props.defaultView) {
      currentView = this.props.defaultView;
    } else {
      let viewIdUrlParam = GetUrlKeyValue('viewId');
      if (viewIdUrlParam !== '') {
        [currentView] = config.views.filter(qc => qc.id === parseInt(viewIdUrlParam, 10));
        if (!currentView) {
          throw {
            message: strings.ViewNotFoundMessage,
            type: MessageBarType.error
          };
        }
      } else if (hashState.viewId) {
        [currentView] = config.views.filter(qc => qc.id === parseInt(hashState.viewId, 10));
        if (!currentView) {
          throw {
            message: strings.ViewNotFoundMessage,
            type: MessageBarType.error
          };
        }
      } else {
        [currentView] = config.views.filter(qc => qc.default);
        if (!currentView) {
          throw {
            message: strings.NoDefaultViewMessage,
            type: MessageBarType.error
          };
        }
      }
    }
    const fieldNames = config.columns.map(f => f.fieldName);
    const response = await queryProjects(currentView, config);

    // Populates PortfolioOverviewFieldSelector with items from this.congig.columns
    PortfolioOverviewFieldSelector.items = config.columns.map(col => ({
      name: col.name,
      value: col.fieldName,
      defaultSelected: Array.contains(currentView.fields, col.name),
      readOnly: col.readOnly,
    }));

    // Sort the columns as they are added to the view
    let selectedColumns = currentView.fields.map(f => config.columns.filter(fc => fc.name === f)[0]);

    // Get selected filters
    let filters = this.getSelectedFiltersWithItems(response.refiners, config, currentView).concat([PortfolioOverviewFieldSelector]);

    // Sorts items from response.primarySearchResults
    let items = response.primarySearchResults.sort(this.props.defaultSortFunction);

    let updatedState: Partial<IPortfolioOverviewState> = {
      selectedColumns,
      fieldNames,
      items,
      filters,
      currentView,
      config,
      canUserManageWeb: canUserManageWeb.get_value(),
      filteredItems: items,
    };

    // Check if current view has group by set
    if (currentView.groupBy) {
      let [groupByColumn] = config.columns.filter(fc => fc.name === currentView.groupBy);
      if (groupByColumn) {
        updatedState.groupBy = groupByColumn;
      }
    }

    return updatedState;
  }

  private getUrlHash(hash = document.location.hash.substring(1)): { [key: string]: string } {
    let hashObject: { [key: string]: string } = {};
    hash.split("&").map(str => {
      const [key, value] = str.split("=");
      hashObject[key] = value;
    });
    return hashObject;
  }

  private setUrlHash(hashObject: { [key: string]: string }): void {
    let hash = "#";
    let hashParts = Object.keys(hashObject).map(key => `${key}=${hashObject[key]}`);
    hash += hashParts.join("&");
    document.location.hash = hash;
}

  /**
 * Get selected filters with items. Based on refiner configuration retrieved from the config list,
 * the filters are checked against refiners retrieved by search.
 *
 * @param {any[]} refiners Refiners retrieved by search
 * @param {PortfolioOverviewConfig.IPortfolioOverviewConfig} configuration PortfolioOverviewConfig
 * @param {PortfolioOverviewConfig.IPortfolioOverviewConfigViewConfig} viewConfig View configuration
 */
  private getSelectedFiltersWithItems(refiners: any[], configuration: PortfolioOverviewConfig.IPortfolioOverviewConfig, viewConfig: PortfolioOverviewConfig.IPortfolioOverviewViewConfig): any {
    return configuration.refiners
      .filter(ref => (refiners.filter(r => r.Name === ref.key).length > 0) && (Array.contains(viewConfig.refiners, ref.name)))
      .map(ref => {
        let entries = refiners.filter(r => r.Name === ref.key)[0].Entries;
        let items = entries.results
          .map(entry => ({
            name: entry.RefinementName,
            value: entry.RefinementValue,
          }))
          .sort((a, b) => a.value > b.value ? 1 : -1);
        return {
          ...ref,
          items,
        };
      });
  }

  /**
   *  Render SearchBox
   */
  private renderSearchBox() {
    return (
      <div className={styles.searchBox}>
        <SearchBox
          onChange={newValue => {
            let searchTerm = newValue.toLowerCase();
            this.setState({ searchTerm });
          }}
          placeholder={strings.SearchBoxPlaceHolder} />
      </div>
    );
  }

  /**
  *  Render status bar
  */
  private renderStatusBar() {
    const data = this.getFilteredData();
    if (data.items.length === 0) {
      return null;
    }
    const { currentFilters } = this.state;
    const currentFiltersStr = [].concat.apply([], Object.keys(currentFilters).map(key => currentFilters[key])).join(", ");
    let statusText = this.formatString(strings.ShowCount, data.items.length.toString(), this.state.items.length.toString());
    if (currentFiltersStr) {
      statusText = this.formatString(strings.ShowCountWithFilters, data.items.length.toString(), this.state.items.length.toString(), currentFiltersStr);
    }
    return <MessageBar>{statusText}</MessageBar>;
  }

  private formatString(str: string, ...replacements: string[]): string {
    return str.replace(/{(\d+)}/g, (match, number) => {
      return typeof replacements[number] != 'undefined'
        ? replacements[number]
        : match;
    });
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

    return { items, farItems };
  }

  private getFilteredData() {
    return {
      items: ['test'],
      columns: [],
      groups: []
    };
  }

  private async updateState(updatedState: IPortfolioOverviewState): Promise<void> {
    this.setState(updatedState, () => {
      return;
    });
  }

}
