import * as React from 'react';
import { IExperienceLogProps, ExperienceLogDefaultProps } from './IExperienceLogProps';
import { IExperienceLogState } from './IExperienceLogState';
import List from '../../../common/components/List/List';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { sp, SearchQuery, QueryPropertyValueType, ISearchQueryBuilder, SearchQueryBuilder } from '@pnp/sp';
import LogElement from './LogElement';

export default class ExperienceLog extends React.Component<IExperienceLogProps, IExperienceLogState> {

  public static defaultProps = ExperienceLogDefaultProps;

  constructor(props) {
    super(props);

    this.state = {
      items: []
    };

  }

  public async componentDidMount() {
    await this.fetchData();
    console.log(this.state.items);
  }

  public render(): React.ReactElement<IExperienceLogProps> {
    return (
      <div>
        <List
          showCommandBar={true}
          groupByOptions={this.props.groupByOptions}
          excelExportEnabled={this.props.excelExportEnabled}
          excelExportConfig={this.props.excelExportConfig}
        />
        {(this.state.items) ?
          this.state.items.map(item => {
            return <div><a>{item.Title}</a><a href={item.SPWebUrl}>{item.SiteTitle}</a></div>;
          })
          : null}
      </div>
    );
  }

  private async fetchData() {

    let id = await this.getHubId();

    let queryText = `DepartmentId:{${id}} ContentType:Prosjektloggelement`;

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
    console.log(result.PrimarySearchResults);
    let items = result.PrimarySearchResults.map(r => new LogElement(r));

    this.setState({ items });

  }

  private getHubId() {
    let rootUrl = this.props.absoluteUrl.replace(this.props.serverRelativeUrl, '');
    let url = `${rootUrl}/_api/HubSites?$filter=SiteUrl eq '${this.props.absoluteUrl}'`;
    let id: string = '';

    return this.props.spHttpClient.get(url, SPHttpClient.configurations.v1, {
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'odata-version': '',
      }
    }).then((response: SPHttpClientResponse) => {
      return response.json();
    }).then((responseJSON) => {
      let responseItems = responseJSON.value;
      if (responseItems.length > 0) {
        id = responseItems[0].ID;
      }
      return id;
    });
  }

}
