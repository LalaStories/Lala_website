/** One basket line as the place-order API expects it. */
export interface OrderItemPayload {
  product_id: number;
  /**
   * Only present when the product has variants — the API rejects it
   * otherwise, so it must be omitted rather than sent as null.
   */
  variant_id?: number;
  qty: number;
}

export interface OrderAddressPayload {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface PlaceOrderPayload {
  items: OrderItemPayload[];
  address: OrderAddressPayload;
  country_code?: string;
  email?: string;
  verification_token?: string;
}

/** What the UI shows after a successful order. */
export interface PlacedOrder {
  reference: string | null;
  message: string;
  /** The shop's own order id, needed to verify the payment afterwards. */
  orderId: number | null;
  /** Razorpay's order handle, present only when payment is expected. */
  razorpayOrderId: string | null;
  /** Amount in paise, as Razorpay counts it. */
  amount: number | null;
}

/** What Razorpay hands back once the customer has paid. */
export interface RazorpayResult {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export type OrderFieldErrors = Partial<
  Record<
    | "items"
    | "name"
    | "phone"
    | "line1"
    | "line2"
    | "city"
    | "state"
    | "pincode"
    | "email",
    string
  >
>;

export interface OrderFormState {
  status: "idle" | "success" | "error" | "awaiting_payment";
  message: string;
  fieldErrors: OrderFieldErrors;
  order: PlacedOrder | null;
}

export const EMPTY_ORDER_STATE: OrderFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  order: null,
};
