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

export default class PortfolioOverview extends React.Component<IPortfolioOverviewProps, IPortfolioOverviewState> {
  public static defaultProps: Partial<IPortfolioOverviewProps> = {
    groupByOptions: [{ name: strings.ProjectLabel, key: 'SiteTitle' }],
    defaultGroupBy: { key: "NoGrouping", name: strings.NoGrouping },
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

  public componentDidMount() {
    // fetch data
    this.setState({ isLoading: false });
  }

  public render(): React.ReactElement<IPortfolioOverviewProps> {
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


    return null;
  }

  private getUrlHash(hash = document.location.hash.substring(1)): { [key: string]: string } {
    let hashObject: { [key: string]: string } = {};
    hash.split("&").map(str => {
      const [key, value] = str.split("=");
      hashObject[key] = value;
    });
    return hashObject;
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

}
