/**
 * Origin of the shop/redeem backend. Server-side only.
 *
 * SHOP_API_BASE_URL in the environment always wins. The fallback is the
 * production backend. The dev backend (https://cpaneldev2.lalastories.com)
 * can be selected per environment without a code change.
 */
const DEFAULT_SHOP_API_BASE_URL = "https://cpanel.lalastories.com";

export const SHOP_API_BASE_URL =
  process.env.SHOP_API_BASE_URL?.replace(/\/+$/, "") || DEFAULT_SHOP_API_BASE_URL;
