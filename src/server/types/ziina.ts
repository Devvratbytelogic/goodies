export interface ZiinaCheckoutPayload {
  shipping_address_id: string;
  billing_address_id: string;
  customer_note: string;
}

export interface ZiinaCheckoutResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: ZiinaCheckout;
  message: string;
  timestamp: string;
}

export interface ZiinaCheckout {
  payment_url?: string | null;
  redirect_url?: string | null;
}
