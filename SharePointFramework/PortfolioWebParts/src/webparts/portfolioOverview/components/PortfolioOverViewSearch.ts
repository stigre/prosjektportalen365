import { sp } from '@pnp/sp';
import {
    IPortfolioOverviewConfig,
    IPortfolioOverviewViewConfig,
} from '../config/PortfolioOverviewConfig';

/**
 * Default Search Settings used for @pnp/sp
 */
export const DEFAULT_SEARCH_SETTINGS = { Querytext: '*', RowLimit: 500, TrimDuplicates: false };

export interface IProjectsQueryResponse {
    primarySearchResults: any[];
    refiners: any[];
}

/**
 * Query the REST Search API using @pnp/sp
 *
 * @param {IPortfolioOverviewViewConfig} viewConfig View configuration
 * @param {IPortfolioOverviewConfiguration} configuration PortfolioOverviewConfiguration
 */
export async function queryProjects(viewConfig: IPortfolioOverviewViewConfig, configuration: IPortfolioOverviewConfig): Promise<IProjectsQueryResponse> {
    try {
        const searchResults = await sp.search({
            ...DEFAULT_SEARCH_SETTINGS,
            SelectProperties: configuration.columns.map(f => f.fieldName),
            Refiners: configuration.refiners.map(ref => ref.key).join(','),
            QueryTemplate: viewConfig.queryTemplate,
        });
        const refinementResults = searchResults.RawSearchResults.PrimaryQueryResult.RefinementResults;
        let refiners = [];
        if (refinementResults) {
            refiners = refinementResults.Refiners;
            if (refiners['results']) {
                refiners = refiners['results'];
            }
        }
        return {
            primarySearchResults: searchResults.PrimarySearchResults,
            refiners,
        };
    } catch (err) {
        throw err;
    }
}
