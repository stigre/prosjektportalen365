import * as React from 'react';
import styles from './PortfolioOverview.module.scss';
import * as strings from 'PortfolioOverviewWebPartStrings';
import { IPortfolioOverviewProps } from './IPortfolioOverviewProps';
import { IPortfolioOverviewState } from './IPortfolioOverviewState';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { CommandBar, ICommandBarItemProps, ICommandBarProps } from 'office-ui-fabric-react/lib/CommandBar';
import { ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';

export default class PortfolioOverview extends React.Component<IPortfolioOverviewProps, IPortfolioOverviewState> {
  public static defaultProps: Partial<IPortfolioOverviewProps> = {
    groupByOptions: [{ name: strings.ProjectLabel, key: 'SiteTitle' }],
    defaultGroupBy: { key: "NoGrouping", name: strings.NoGrouping },
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      groupBy: this.props.defaultGroupBy
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

    return { items, farItems };
  }

}
