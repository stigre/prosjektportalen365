import * as React from 'react';
import styles from './LatestProjects.module.scss';
import * as strings from 'LatestProjectsWebPartStrings';
import { ILatestProjectsProps } from './ILatestProjectsProps';
import { ILatestProjectsState } from './ILatestProjectsState';
import { SearchQuery, ISearchQueryBuilder, SearchQueryBuilder, sp, QueryPropertyValueType, SortDirection, SearchResult, Site } from '@pnp/sp';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { Spinner, SpinnerType } from 'office-ui-fabric-react/lib/Spinner';
import { MessageBar } from 'office-ui-fabric-react/lib/MessageBar';

export default class LatestProjects extends React.Component<ILatestProjectsProps, ILatestProjectsState> {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      sites: [],
    };
  }

  public async componentDidMount() {
    await this.fetchData();
  }

  public render(): React.ReactElement<ILatestProjectsProps> {
    const sites = this.state.sites.slice();
    return (
      <div className={styles.latestProjects}>
        <div className={styles.title}>
          <span>Siste prosjekter</span>
        </div>
        <div className={styles.linksContainer}>
          {(this.state.isLoading) ? <Spinner label={strings.LoadingProjects} type={SpinnerType.large} />
            : this.renderProjectList(sites)}
        </div>
      </div>
    );
  }

  private renderProjectList(sites: SearchResult[]) {
    if (sites.length > 0) {
      return sites.map(site => {
        let options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        let created = new Date(site['Created']).toLocaleString("nb-NO", options);
        return (
          <div className={styles.linkItem}>
            <a className={styles.projectLink} href={site.Path}>{site.Title}</a>
            <p className={styles.subTitle}>Opprettet {created}</p>
          </div>
        );
      });
    } else return <MessageBar>Fant ingen nye prosjekter</MessageBar>;
  }

  private async fetchData() {
    let id = await this.getHubId();

    let queryText = `DepartmentId:{${id}} contentclass:STS_Site`;

    const _searchQuerySettings: SearchQuery = {
      TrimDuplicates: false,
      RowLimit: 100,
      SelectProperties: ['Title', 'Path', 'DepartmentId', 'SiteId', 'Created'],
      SortList:
        [
          {
            Property: "Created",
            Direction: SortDirection.Descending
          }
        ],
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
    let associatedSites = result.PrimarySearchResults.filter(site => id !== site['SiteId']);

    this.setState({
      sites: associatedSites,
      isLoading: false });
  }

  private getHubId() {
    let rootUrl = this.props.absoluteUrl.replace(this.props.serverRelativeUrl, '');
    let url = `${rootUrl}/_api/HubSites?$filter=SiteUrl eq '${this.props.absoluteUrl}'`;
    let id: string = '';

    return this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1, {
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
