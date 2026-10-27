export interface TamaraCheckoutPayload {
  shipping_address_id: string;
  billing_address_id: string;
  customer_note: string;
  origin: string;
}

export interface TamaraCheckoutResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: TamaraCheckout;
  message: string;
  timestamp: string;
}

export interface TamaraCheckout {
  payment_url?: string | null;
  checkout_url?: string | null;
  redirect_url?: string | null;
}
