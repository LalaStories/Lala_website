/**
 * Origin of the shop/redeem backend. Server-side only.
 *
 * SHOP_API_BASE_URL in the environment always wins. The fallback below is
 * the backend the site uses when nothing is set, and it is deliberately
 * the DEV backend for now: production (https://cpanel.lalastories.com)
 * does not yet publish the full catalogue or the redeem routes. Switch
 * the fallback back to production once it does.
 */
const DEFAULT_SHOP_API_BASE_URL = "https://cpaneldev2.lalastories.com";

export const SHOP_API_BASE_URL =
  process.env.SHOP_API_BASE_URL?.replace(/\/+$/, "") || DEFAULT_SHOP_API_BASE_URL;
