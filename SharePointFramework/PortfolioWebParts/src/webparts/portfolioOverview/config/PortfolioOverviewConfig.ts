import * as strings from 'PortfolioOverviewWebPartStrings';
import { Web } from 'sp-pnp-js';
import IPortfolioOverviewConfig, {
  IPortfolioOverviewColumnConfig,
  IPortfolioOverviewRefinerConfig,
  IPortfolioOverviewViewConfig,
  IStatusFieldsConfig,
 } from './IPortfolioOverviewConfig';
import { loadJsonConfiguration } from '../../../common/util';


/**
 * Get fields config from list
 *
 * @param {string} orderBy Order by property
 * @param {Web} configWeb Config web
 */
export function getFieldsConfig(orderBy: string, configWeb: Web): Promise<any[]> {
    return configWeb.lists.getByTitle(strings.PortfolioFieldsListTitle)
        .items
        .orderBy(orderBy)
        .usingCaching()
        .get();
}

/**
 * Get refiner config from list
 *
 * @param {string} orderBy Order by property
 * @param {Web} configWeb Config web
 */
export function getRefinersConfig(orderBy: string, configWeb: Web): Promise<any[]> {
    return configWeb.lists.getByTitle(strings.PortfolioRefinersListTitle)
        .items
        .orderBy(orderBy)
        .usingCaching()
        .get();
}

/**
 * Get view config from list
 *
 * @param {string} orderBy Order by property
 * @param {Web} configWeb Config web
 */
export function getViewsConfig(orderBy: string, configWeb: Web): Promise<any[]> {
    return configWeb.lists.getByTitle(strings.PortfolioViewsListTitle)
        .items
        .filter(`((GtDpPersonalView eq 0) or (GtDpPersonalView eq 1 and Author/Id eq ${_spPageContextInfo.userId}))`)
        .expand('GtDpFieldsLookup', 'GtDpRefinersLookup', 'GtDpGroupByLookup', 'Author')
        .select('ID', 'GtDpDisplayName', 'GtDpSearchQuery', 'GtDpIcon', 'GtDpDefault', 'GtDpFieldsLookup/GtDpDisplayName', 'GtDpRefinersLookup/GtDpDisplayName', 'GtDpGroupByLookup/GtDpDisplayName', 'Author/Id')
        .orderBy(orderBy)
        .usingCaching()
        .get();
}

/**
 * Get config from lists
 *
 * @param {string} orderBy Order by property
 * @param {string} configWebUrl URL for config lists
 */
export async function getConfig(orderBy = 'GtDpOrder', configWebUrl = _spPageContextInfo.siteAbsoluteUrl): Promise<IPortfolioOverviewConfig> {
    const configWeb = new Web(configWebUrl);
    const [dpFields, dpRefiners, dpViews, statusFields] = await Promise.all([
        getFieldsConfig(orderBy, configWeb),
        getRefinersConfig(orderBy, configWeb),
        getViewsConfig(orderBy, configWeb),
        loadJsonConfiguration<IStatusFieldsConfig>('status-fields'),
    ]);
    const columns = dpFields.map(fld => {
        return {
            name: fld.GtDpDisplayName,
            key: fld.GtDpProperty,
            fieldName: fld.GtDpProperty,
            readOnly: fld.GtDpReadOnly,
            render: fld.GtDpRender,
            minWidth: fld.GtDpMinWidth,
            maxWidth: fld.GtDpMaxWidth,
            isResizable: fld.GtDpIsResizable,
            groupBy: fld.GtDpGroupBy,
        };
    });
    const refiners = dpRefiners.map(ref => {
        return {
            name: ref.GtDpDisplayName,
            key: ref.GtDpProperty,
            fieldName: ref.GtDpProperty,
            multi: ref.GtDpMultiple,
            defaultHidden: ref.GtDpDefaultHidden,
            iconName: ref.GtDpIcon,
        };
    });
    const views = dpViews.map(view => {
        let fieldsLookupItems = [];
        let refinersLookupItems = [];
        if (view.GtDpFieldsLookup.hasOwnProperty('results')) {
            fieldsLookupItems = view.GtDpFieldsLookup.results;
        } else {
            fieldsLookupItems = view.GtDpFieldsLookup;
        }
        if (view.GtDpRefinersLookup.hasOwnProperty('results')) {
            refinersLookupItems = view.GtDpRefinersLookup.results;
        } else {
            refinersLookupItems = view.GtDpRefinersLookup;
        }
        return {
            id: view.ID,
            name: view.GtDpDisplayName,
            queryTemplate: view.GtDpSearchQuery,
            iconName: view.GtDpIcon,
            default: view.GtDpDefault,
            fields: fieldsLookupItems.map(item => item.GtDpDisplayName),
            refiners: refinersLookupItems.map(item => item.GtDpDisplayName),
            groupBy: view.GtDpGroupByLookup ? view.GtDpGroupByLookup.GtDpDisplayName : null,
        };
    });
    return { columns, refiners, views, statusFields };
}

export {
    IPortfolioOverviewConfig,
    IPortfolioOverviewViewConfig,
    IPortfolioOverviewColumnConfig,
    IPortfolioOverviewRefinerConfig,
    IStatusFieldsConfig,
};

