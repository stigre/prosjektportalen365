import * as React from 'react';
import { IExperienceLogProps, ExperienceLogDefaultProps } from './IExperienceLogProps';
import { IExperienceLogState } from './IExperienceLogState';
import List from '../../../common/components/List/List';
import * as strings from 'ExperienceLogWebPartStrings';
import { sp, SearchQuery, QueryPropertyValueType, ISearchQueryBuilder, SearchQueryBuilder } from '@pnp/sp';
import LogElement from './LogElement';
import { Spinner, SpinnerType } from 'office-ui-fabric-react/lib/Spinner';

export default class ExperienceLog extends React.Component<IExperienceLogProps, IExperienceLogState> {

  public static defaultProps = ExperienceLogDefaultProps;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  public async componentDidMount() {
    try {
      const items = await this.fetchData();
      this.setState({ items, isLoading: false });
    } catch (err) {
      console.log(err);
      this.setState({ items: [], isLoading: false });
    }
  }

  public render(): React.ReactElement<IExperienceLogProps> {
    if (this.state.isLoading) {
      return <Spinner type={SpinnerType.large} label={strings.LoadingLabel} />;
    }

    return (
      <List
        items={this.state.items}
        columns={this.props.columns}
        showCommandBar={true}
        groupByOptions={this.props.groupByOptions}
        pageContext={this.props.pageContext}
        excelExportEnabled={this.props.excelExportEnabled}
        excelExportConfig={this.props.excelExportConfig}
      />
    );
  }

  private async fetchData() {

    let queryText = `DepartmentId:{${this.props.hubSiteId}} ContentType:Prosjektloggelement`;

    const _searchQuerySettings: SearchQuery = {
      TrimDuplicates: false,
      RowLimit: 500,
      SelectProperties: ['Title', 'SiteTitle', 'SPWebUrl', 'GtProjectLogType', 'GtProjectLogResponsible', 'GtProjectLogRecommendation', 'Path', 'GtProjectLogConsequence', 'Actors'],
      Properties: [{
        Name: "EnableDynamicGroups",
        Value: {
          BoolVal: true,
          QueryPropertyValueTypeIndex: QueryPropertyValueType.BooleanType
        }
      }
      ]
    };

    const query: ISearchQueryBuilder = SearchQueryBuilder(queryText, _searchQuerySettings);
    let result = await sp.search(query);
    console.log(result);
    let items = result.PrimarySearchResults.map(r => new LogElement(r));

    return items;
  }

}
