import * as React from 'react';
import styles from './BenefitsOverview.module.scss';
import { IBenefitsOverviewProps, BenefitsOverviewDefaultProps } from './IBenefitsOverviewProps';
import { IBenefitsOverviewState } from './IBenefitsOverviewState';
import { Spinner, SpinnerType } from "office-ui-fabric-react/lib/Spinner";
import List from '../../../common/components/List/List';

export default class BenefitsOverview extends React.Component<IBenefitsOverviewProps, IBenefitsOverviewState> {
  public static defaultProps = BenefitsOverviewDefaultProps;
  /**
   * Constructor
   *
   * @param {IBenefitsOverviewProps} props Props
   */
  constructor(props: IBenefitsOverviewProps) {
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

  public render(): React.ReactElement<IBenefitsOverviewProps> {
    if (this.state.isLoading) {
      return <Spinner label='Laster gevinstoversikt...' type={SpinnerType.large} />;
    }

    return (
      <div className={styles.benefitsOverview}>
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
