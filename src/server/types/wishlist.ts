export interface WishlistApiResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: (WishlistApiResponseData)[] | null;
    message: string;
    timestamp: string;
}
export interface WishlistApiResponseData {
    _id: string;
    guest_user?: null;
    user_id: string;
    product_id: WishlistProductId;
    product_type: string;
    variant_sku: string;
    variant_key?: null;
    deletedAt?: null;
    createdAt: string;
    updatedAt: string;
    id: number;
    __v: number;
    selected_variant?: null;
    alreadyCart: boolean;
    alreadyWishlist: boolean;
}
export interface WishlistProductId {
    _id: string;
    id: number;
    title: string;
    slug: string;
    sku: string;
    status: boolean;
    stock: number;
    weight: number;
    thumbnail: string;
    product_type: string;
    images?: (string)[] | null;
    colors?: (null)[] | null;
    sizes?: (null)[] | null;
    variants?: (null)[] | null;
    variant: WishlistVariant;
    categoryId: CategoryId;
    brandId?: null;
    deletedAt?: null;
    bundle_items?: (null)[] | null;
    max_selection?: null;
    average_rating: number;
    total_reviews: number;
    featured: boolean;
    new_product: boolean;
    pricing_context: PricingContext;
}
export interface WishlistVariant {
    sku: string;
    stock: number;
    price: number;
    max_price: number;
}
export interface CategoryId {
    _id: string;
    name: string;
    slug: string;
}
export interface PricingContext {
    country: string;
    currency: string;
    currency_symbol: string;
    exchange_rate: number;
    base_currency: string;
    applied_percentage: number;
    region: string;
    breakdown: Breakdown;
}
export interface Breakdown {
}
