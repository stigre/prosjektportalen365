import {
  getJsomContext,
  executeJsom,
} from "../util";

/**
 * Get property values from the web property bag
 *
 * @param {string} url URL for the webb
 */
export async function GetAllProperties(url = _spPageContextInfo.siteAbsoluteUrl): Promise<any> {
  const { ctx, propertyBag } = await getJsomContext(url);
  await executeJsom(ctx, [propertyBag]);
  return propertyBag.get_fieldValues();
}

/**
 * Get property value for the provided key from the web property bag
 *
 * @param {string} key Property key
 * @param {string} url URL for the web
 */
export async function GetProperty(key: string, url = _spPageContextInfo.siteAbsoluteUrl): Promise<string> {
  try {
      const properties = await GetAllProperties(url);
      return properties[key];
  } catch (err) {
      return "";
  }
}
