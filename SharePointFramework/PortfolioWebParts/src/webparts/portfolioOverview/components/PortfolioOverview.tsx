import * as React from 'react';
import styles from './PortfolioOverview.module.scss';
import * as strings from 'PortfolioOverviewWebPartStrings';
import { IPortfolioOverviewProps } from './IPortfolioOverviewProps';
import { IPortfolioOverviewState } from './IPortfolioOverviewState';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';

export default class PortfolioOverview extends React.Component<IPortfolioOverviewProps, IPortfolioOverviewState> {
  public static defaultProps: Partial<IPortfolioOverviewProps> = {
    groupByOptions: [],
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
    if (this.state.isLoading) return <Spinner label='Laster prosjektportefølje...' size={SpinnerSize.large} />;
    return (
      <div className={styles.portfolioOverview}>
      {this.renderCommandBar()}
      </div>
    );
  }

  private renderCommandBar() {
  const items: Array<ICommandBarItemProps> = [];

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

    return (
      <CommandBar
        items={items}
        farItems={[]}
      />
    );
  }

}
