import * as React from 'react';
import styles from './RiskOverview.module.scss';
import { IRiskOverviewProps, RiskOverviewDefaultProps } from './IRiskOverviewProps';
import { IRiskOverviewState } from './IRiskOverviewState';
import { Spinner, SpinnerType } from "office-ui-fabric-react/lib/Spinner";
import List from '../../../common/components/List/List';

export default class RiskOverview extends React.Component<IRiskOverviewProps, IRiskOverviewState> {
  public static defaultProps = RiskOverviewDefaultProps;
  /**
   * Constructor
   *
   * @param {IRiskOverviewProps} props Props
   */
  constructor(props: IRiskOverviewProps) {
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

  public render(): React.ReactElement<IRiskOverviewProps> {
    if (this.state.isLoading) {
      return <Spinner label='Laster risikooversikt...' type={SpinnerType.large} />;
    }

    return (
      <div className={styles.riskOverview}>
        <div className={styles.container}>
          <List
            items={this.state.items}
            columns={this.props.columns}
            showCommandBar={true}
            groupByOptions={this.props.groupByOptions}
            excelExportEnabled={false} />
        </div>
      </div>
    );
  }

  /**
   * Fetch items
   */
  private fetchItems() {
    return new Promise<any[]>((resolve) => {
      window.setTimeout(() => {
        resolve([]);
      }, 2000);
    });
  }
}
