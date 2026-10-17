export interface CouponApiResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: (CouponApiResponseDataEntity)[] | null;
    message: string;
    timestamp: string;
}
export interface CouponApiResponseDataEntity {
    _id: string;
    coupon_code: string;
    coupon_type: string;
    value: number;
    no_coupon: number;
    expiry_date: string;
    minimum_cart_value: number;
    status: boolean;
    created_by: string;
    deletedAt?: null;
    createdAt: string;
    updatedAt: string;
    id: number;
    __v: number;
    start_date: string;
    value_display: number;
    minimum_cart_value_display: number;
    currency: string;
    currency_symbol: string;
    exchange_rate: number;
    base_currency: string;
}

export interface UsedCouponsArgs {
    page?: number;
    limit?: number;
}

export interface UsedCouponsResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: UsedCouponsData | null;
    message: string;
    timestamp: string;
}

export interface UsedCouponsData {
    coupons?: UsedCoupon[] | null;
    pagination?: UsedCouponsPagination | null;
}

export interface UsedCoupon {
    _id: string;
    id: number;
    order_id: string;
    order_number: number;
    order_status: string;
    coupon?: UsedCouponDetails | null;
    discount_amount: number;
    cart_amount: number;
    order_total: number;
    currency: string;
    used_at: string;
}

export interface UsedCouponDetails {
    _id: string;
    id: number;
    coupon_code: string;
    coupon_type: string;
    value: number;
    minimum_cart_value: number;
    start_date: string;
    expiry_date: string;
    status: boolean;
}

export interface UsedCouponsPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
