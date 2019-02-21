import * as React from 'react';
import styles from './ExperienceLog.module.scss';
import * as strings from 'ExperienceLogWebPartStrings';
import { IExperienceLogProps, ExperienceLogDefaultProps } from './IExperienceLogProps';
import { IExperienceLogState } from './IExperienceLogState';
import List from '../../../common/components/List/List';
import { sp } from '@pnp/sp';
import { Spinner, SpinnerType } from 'office-ui-fabric-react/lib/Spinner';
import { stringIsNullOrEmpty } from '@pnp/common';

export default class ExperienceLog extends React.Component<IExperienceLogProps, IExperienceLogState> {
  public static defaultProps = ExperienceLogDefaultProps;

  constructor(props: IExperienceLogProps) {
    super(props);
    this.state = { isLoading: true };
  }

  public async componentDidMount() {
    try {
      const items = await this.fetchData();
      this.setState({ items, isLoading: false });
    } catch (err) {
      this.setState({ items: [], isLoading: false });
    }
  }

  public render(): React.ReactElement<IExperienceLogProps> {
    if (this.state.isLoading) {
      return (
        <div className={styles.experienceLog}>
          <div className={styles.container}>
            <Spinner label={strings.LoadingText} type={SpinnerType.large} />
          </div>
        </div>
      );
    }

    return (
      <div className={styles.experienceLog}>
        <div className={styles.container}>
          <List
            items={this.state.items}
            columns={this.props.columns}
            showCommandBar={true}
            groupByOptions={this.props.groupByOptions}
            excelExportEnabled={this.props.excelExportEnabled}
            excelExportConfig={this.props.excelExportConfig} />
        </div>
      </div>
    );
  }

  private async fetchData() {
    let { PrimarySearchResults } = await sp.search({
      Querytext: "*",
      QueryTemplate: `DepartmentId:{${this.props.context.pageContext.legacyPageContext.hubSiteId}} ContentTypeId:0x01004EDD18CB92C14EBA97103D909C897810*`,
      TrimDuplicates: false,
      RowLimit: 500,
      SelectProperties: ["Path", "SPWebUrl", ...this.props.columns.map(col => col.key)],
    });
    return PrimarySearchResults;
  }

}
