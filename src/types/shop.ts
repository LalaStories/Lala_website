export interface ShopProductType {
  id: number;
  name: string;
  slug: string;
  color: string | null;
}

export interface ShopSubscriptionInfo {
  title: string;
  durationLabel: string;
  platformNote: string;
}

export interface ShopProduct {
  id: number;
  title: string;
  slug: string;
  type: ShopProductType | null;
  coverImage: string | null;
  price: number;
  mrp: number | null;
  discountPercent: number;
  isOnOffer: boolean;
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
