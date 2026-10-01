export interface AllProductsApiResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: AllProductsData;
    message: string;
    timestamp: string;
}
export interface AllProductsData {
    data?: (AllProductsProduct)[] | null;
    pagination: Pagination;
    filters: Filters;
    pricing_context: PricingContext;
    lowest_price?: number;
    highest_price?: number;
}
export interface AllProductsProduct {
    variant: Variant;
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
    images?: (string | null)[] | null;
    colors?: (null)[] | null;
    sizes?: (SizesEntity | null)[] | null;
    variants?: (VariantsEntity | null)[] | null;
    categoryId: CategoryId;
    brandId?: null;
    deletedAt?: null;
    createdBy?: string | null;
    description: string;
    short_description: string;
    url: string;
    bundle_items?: (null)[] | null;
    max_selection?: null;
    average_rating: number;
    total_reviews: number;
    total_sales: number;
    transition: string;
    is_variant: boolean;
    most_loved: boolean;
    featured: boolean;
    new_product: boolean;
    custom_notes: string;
    view_count: number;
    meta_title: string;
    meta_description?: string | null;
    og_title: string;
    og_description?: string | null;
    og_image: string;
    twitter_title: string;
    twitter_description?: string | null;
    twitter_image: string;
    json_ld: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    is_best_seller: boolean;
    is_new_arrival: boolean;
    pricing_context: PricingContext;
    alreadyCart: boolean;
    alreadyWishlist: boolean;
    isWishlisted: boolean;
    wishlisted_variants?: (null)[] | null;
}
export interface Variant {
    sku: string;
    stock: number;
    price: number;
    max_price: number;
}
export interface SizesEntity {
    name: string;
}
export interface VariantsEntity {
    sku: string;
    color: string;
    size: string;
    attributes: BreakdownOrAttributes;
    stock: number;
    price: number;
    max_price: number;
    weight: number;
    status: boolean;
    images?: (string)[] | null;
}
export interface BreakdownOrAttributes {
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
    breakdown: BreakdownOrAttributes;
}
export interface Pagination {
    page: number;
    limit: number;
    count: number;
}
export interface Filters {
    category?: null;
    min_price?: null;
    max_price?: null;
    sort: string;
}
