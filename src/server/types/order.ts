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
    thumbnail?: string | null;
    size?: string | null;
    product_type?: string | null;
    quantity: number;
    unit_price: number;
    line_total: number;
    currency?: string;
    currency_symbol?: string;
    variants?: unknown[] | null;
    is_variant?: boolean | null;
    variant?: UserOrderItemVariant | null;
    sizes?: unknown[] | null;
    cancelled?: boolean;
    reason?: string | null;
    description?: string | null;
}

export interface OrderStatusBanner {
    title?: string | null;
    subtitle?: string | null;
    courier?: string | null;
    tracking_id?: string | null;
}

export interface OrderTimelineEvent {
    status: string;
    message?: string | null;
    reason?: string | null;
    description?: string | null;
    at: string;
}
export interface OrderChangeRequest {
    _id?: string;
    status?: string | null;
    type?: string | null;
    reason?: string | null;
    message?: string | null;
    created_at?: string | null;
    createdAt?: string | null;
}

export interface OrderDetailsSummary {
    order_total: number;
    discount_amount: number;
    coupon_code?: string | null;
    coupon_discount?: number | null;
    shipping_amount: number;
    cod_amount?: number | null;
    fee_amount: number;
    grand_total: number;
    tax_amount: number;
    currency: string;
    currency_symbol: string;
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

export interface UserOrdersResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: UserOrdersData;
    message: string;
    timestamp: string;
}

export interface UserOrdersData {
    orders?: UserOrder[] | null;
    pagination: UserOrdersPagination;
}

export interface UserOrderItemVariant {
    sku?: string | null;
    stock?: number | null;
    price?: number | null;
    max_price?: number | null;
}

export interface UserOrderItem {
    item_id: string;
    product_id?: string | null;
    title: string;
    slug?: string | null;
    sku?: string | null;
    image?: string | null;
    thumbnail?: string | null;
    images?: string[] | null;
    size?: string | null;
    product_type?: string | null;
    quantity: number;
    unit_price: number;
    mrp?: number | null;
    line_total: number;
    tax?: number | null;
    currency?: string | null;
    currency_symbol?: string | null;
    exchange_rate?: number | null;
    variant_sku?: string | null;
    variant_key?: string | null;
    selected_attributes?: Record<string, string> | null;
    bundle_selections?: unknown[] | null;
    variant?: UserOrderItemVariant | null;
    variants?: unknown[] | null;
    sizes?: unknown[] | null;
    colors?: unknown[] | null;
    is_variant?: boolean | null;
}

export interface UserOrderSummary {
    order_total: number;
    discount_amount: number;
    coupon_code?: string | null;
    coupon_type?: string | null;
    coupon_discount?: number | null;
    shipping_amount: number;
    fee_amount: number;
    tax_amount: number;
    grand_total: number;
    currency: string;
    currency_symbol?: string | null;
}

export interface UserOrderAddress {
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

export interface UserOrder {
    _id: string;
    order_id: string;
    order_number: number;
    order_code: string;
    invoice_number?: number | null;
    order_date: string;
    created_at?: string | null;
    status: "completed" | "pending" | "cancelled" | "failed" | "on_hold" | "processing" | "tamara_p_canceled" | "tamara_p_failed";
    item_count: number;
    currency: string;
    currency_symbol?: string | null;
    exchange_rate?: number | null;
    customer_email?: string | null;
    customer_note?: string | null;
    payment_method?: string | null;
    payment_method_title?: string | null;
    payment_status?: "completed" | "pending" | "cancelled" | "failed" | "on_hold" | "processing" | "paid" | "tamara_p_canceled" | "tamara_p_failed" | null;
    transaction_id?: string | null;
    paid_at?: string | null;
    shipping_method_id?: string | null;
    shipping_method_title?: string | null;
    courier_name?: string | null;
    tracking_id?: string | null;
    summary?: UserOrderSummary | null;
    subtotal_amount?: number | null;
    discount_amount?: number | null;
    shipping_amount?: number | null;
    fee_amount?: number | null;
    tax_amount?: number | null;
    total_amount: number;
    shipping_address?: UserOrderAddress | null;
    billing_address?: UserOrderAddress | null;
    items?: UserOrderItem[] | null;
    preview_images?: string[] | null;
}

export interface UserOrdersPagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
}

export interface OrderDetails {
    order_id: string;
    order_number: number | string;
    order_code?: string;
    status?: "completed" | "pending" | "cancelled" | "failed" | "on_hold" | "processing" | "tamara_p_canceled" | "tamara_p_failed";
    can_cancel?: boolean;
    can_return_replacement?: boolean;
    cancel_message?: string | null;
    cancellation_history?: boolean;
    return_replacement_history?: boolean;
    cancellation_requests?: OrderChangeRequest[] | null;
    return_replacement_requests?: OrderChangeRequest[] | null;
    order_date?: string;
    customer_email?: string | null;
    customer_note?: string | null;
    payment_method?: string | null;
    payment_method_title?: string | null;
    payment_status?: "completed" | "pending" | "cancelled" | "failed" | "on_hold" | "processing" | "paid" | "tamara_p_canceled" | "tamara_p_failed" | null;
    status_banner?: OrderStatusBanner | null;
    timeline?: OrderTimelineEvent[] | null;
    summary?: OrderDetailsSummary | null;
    shipping_address?: OrderDetailsAddress | null;
    billing_address?: OrderDetailsAddress | null;
    items?: OrderDetailsItem[] | null;
}
