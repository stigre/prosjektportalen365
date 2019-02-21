import { GetProperty } from "./PropertyBag";
import { Logger, LogLevel } from '@pnp/logging';
import { Web } from "@pnp/sp";

export interface IJsomContext {
  ctx: SP.ClientContext;
  web: SP.Web;
  propertyBag: SP.PropertyValues;
  lists: SP.ListCollection;
}

/**
 * Gets JSOM context (IJsomContext) for the specified URL
 *
 * @param {string} url The URL
 */
export async function getJsomContext(url: string): Promise<IJsomContext> {
  const ctx = await getClientContext(url);
  const web = ctx.get_web();
  const propertyBag = web.get_allProperties();
  const lists = web.get_lists();
  return { ctx, web, propertyBag, lists };
}

/**
 * Get client context for the specified URL
 *
 * @param {string} url The URL
 */
export const getClientContext = (url: string) => new Promise<SP.ClientContext>((resolve, reject) => {
  SP.SOD.executeFunc("sp.js", "SP.ClientContext", () => {
      const clientContext = new SP.ClientContext(url);
      resolve(clientContext);
  });
});

/**
 * Executes a JSOM query using SP.ClientContext.executeQueryAsync. Allows for async-await
 *
 * @param {SP.ClientContext} ctx Client context
 * @param {SP.ClientObject[]} clientObjects Client objects to load
 */
export function executeJsom(ctx: SP.ClientContext, clientObjects: SP.ClientObject[] = []) {
  return new Promise<{ sender, args, url }>((resolve, reject) => {
      clientObjects.forEach(clientObj => ctx.load(clientObj));
      ctx.executeQueryAsync((sender, args) => {
          resolve({ sender, args, url: ctx.get_url() });
      }, (sender, args) => {
          reject({ sender, args, url: ctx.get_url() });
      });
  });
}

/**
 * Loads JSON configuration
 *
 * @param {string} name Config name
 */
export async function loadJsonConfiguration<T>(name: string): Promise<T> {
  const assetsUrl = await GetProperty("pp_assetssiteurl");
  const assetsWeb = new Web(makeUrlAbsolute(assetsUrl));
  const fileServerRelativeUrl = `${assetsUrl}/SiteAssets/pp/config/${name}.txt`;
  try {
      const json = await assetsWeb.getFileByServerRelativeUrl(fileServerRelativeUrl).usingCaching().getJSON();
      return json;
  } catch (err) {
      Logger.write(`[loadJsonConfiguration] Failed to load JSON from ${fileServerRelativeUrl}`, LogLevel.Error);
      return null;
  }
}

/**
 * Make URL absolute
 *
 * @param {string} relUrl Absolute URL
 */
export function makeUrlAbsolute(relUrl: string): string {
  const rootSite = document.location.protocol + "//" + document.location.hostname;
  if (!relUrl) {
      return rootSite;
  }
  if (relUrl.startsWith("http")) {
      return relUrl;
  }
  let properRelativeUrl = relUrl;
  if (!relUrl.startsWith("/")) {
      properRelativeUrl = "/" + relUrl;
  }
  return rootSite + properRelativeUrl;
}
