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
