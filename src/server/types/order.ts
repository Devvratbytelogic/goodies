export interface PlaceOrderPayload {
    payment_method: "cod";
    payment_method_title: string;
    shipping_address_id: string;
    billing_address_id: string;
    customer_note: string;
    country: string;
    payment_status: "pending";
}
export interface PlaceOrderResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: PlacedOrder;
    message: string;
    timestamp: string;
}
export interface PlacedOrder {
    order_id: string;
    order_items?: (OrderItem | null)[] | null;
    order_number: number;
    item_count: number;
    subtotal_amount: number;
    coupon_code?: string | null;
    coupon_type?: string | null;
    coupon_discount?: number | null;
    discount_amount: number;
    shipping_amount: number;
    shipping_method_id?: string | null;
    shipping_method_title?: string | null;
    fee_amount: number;
    tax_amount: number;
    total_amount: number;
    customer_email?: string | null;
    customer_note?: string | null;
    payment_method: string;
    payment_method_title: string;
    currency: string;
    delivery_address?: OrderDeliveryAddress | null;
}
export interface OrderItem {
    _id: string;
    order_id: string;
    product_name: string;
    user_id?: OrderUser | null;
    wp_product_id?: number | null;
    wp_variant_id?: number | null;
    product_id?: OrderProduct | null;
    product_type: string;
    bundle_selections?: unknown[] | null;
    variant_sku?: string | null;
    variant_key?: string | null;
    selected_size?: string | null;
    selected_attributes?: Record<string, string> | null;
    quantity: number;
    single_price: number;
    mrp: number;
    total: number;
    tax: number;
    currency: string;
    exchange_rate: number;
    __v: number;
    createdAt: string;
    updatedAt: string;
}
export interface OrderUser {
    _id: string;
    name: string;
    email: string;
    id: number;
}
export interface OrderProduct {
    _id: string;
    id: number;
    title: string;
    slug: string;
    thumbnail?: string | null;
    variant?: unknown | null;
}
export interface OrderDeliveryAddress {
    first_name: string;
    last_name: string;
    full_name: string;
    street_address: string;
    city: string;
    state: string;
    state_code?: string | null;
    country: string;
    postal_code?: string | null;
    phone_number: string;
    phone_country_code?: string | null;
    country_code: string;
    email?: string | null;
}

export interface OrderDetailsResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: OrderDetails;
    message: string;
    timestamp: string;
}

export interface OrderDetailsItem {
    item_id: string;
    product_id?: string;
    title: string;
    slug?: string | null;
    image?: string | null;
    size?: string | null;
    quantity: number;
    unit_price: number;
    line_total: number;
    currency?: string;
}

export interface OrderDetailsSummary {
    order_total: number;
    discount_amount: number;
    coupon_code?: string | null;
    coupon_discount?: number | null;
    shipping_amount: number;
    fee_amount: number;
    grand_total: number;
    tax_amount: number;
    currency: string;
}

export interface OrderDetailsAddress {
    first_name?: string | null;
    last_name?: string | null;
    full_name?: string | null;
    street_address?: string | null;
    city?: string | null;
    state?: string | null;
    state_code?: string | null;
    country?: string | null;
    postal_code?: string | null;
    phone_number?: string | null;
    phone_country_code?: string | null;
    country_code?: string | null;
    email?: string | null;
}

export interface OrderDetails {
    order_id: string;
    order_number: number | string;
    order_code?: string;
    status?: string;
    order_date?: string;
    payment_method?: string;
    payment_method_title?: string;
    payment_status?: string;
    summary?: OrderDetailsSummary | null;
    shipping_address?: OrderDetailsAddress | null;
    items?: OrderDetailsItem[] | null;
}
