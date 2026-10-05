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
