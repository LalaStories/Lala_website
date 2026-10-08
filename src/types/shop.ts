export interface ShopProductType {
  id: number;
  name: string;
  slug: string;
  color: string | null;
}

export interface ShopSubscriptionInfo {
  planId: number | null;
  title: string;
  durationLabel: string;
  qty: number;
  platformNote: string;
}

export interface ShopProduct {
  id: number;
  title: string;
  slug: string;
  type: ShopProductType | null;
  coverImage: string | null;
  price: number;
  pricePrefix: string;
  mrp: number | null;
  discountPercent: number;
  isOnOffer: boolean;
  offerEndsAt: string | null;
  hasVariants: boolean;
  isBundle: boolean;
  inStock: boolean;
  availableQty: number;
  includesSubscription: boolean;
  subscription: ShopSubscriptionInfo | null;
}

export interface ShopHomeData {
  types: ShopProductType[];
  onOffer: ShopProduct[];
  latest: ShopProduct[];
}

/** A label/value pair from the product-detail feed's `details` list. */
export interface ShopProductDetailRow {
  label: string;
  value: string;
}

export interface ShopProductVariant {
  id: number | null;
  name: string;
  price: number | null;
  mrp: number | null;
  inStock: boolean | null;
}

export interface ShopBundleItem {
  id: number | null;
  title: string;
  qty: number;
  coverImage: string | null;
}

/** Everything the catalog card has, plus what only the detail endpoint sends. */
export interface ShopProductDetail extends ShopProduct {
  description: string;
  /** Gallery URLs, cover first, deduped. Never empty when a cover exists. */
  images: string[];
  details: ShopProductDetailRow[];
  variants: ShopProductVariant[];
  bundleItems: ShopBundleItem[];
}
