export interface HomePage {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: HomePageData;
    message: string;
    timestamp: string;
}
export interface HomePageData {
    best_sellers?: (HomeProduct)[] | null;
    new_arrivals?: (HomeProduct)[] | null;
    categories?: (HomeCategory)[] | null;
    home_page_banner: string;
}
export interface HomeProduct {
    variant: HomeProductVariant;
    stock_manage: boolean;
    stock_status: 'in_stock' | 'out_of_stock';
    is_best_seller: boolean;
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
    meta_title?: string | null;
    meta_description?: string | null;
    og_title?: string | null;
    og_description?: string | null;
    og_image?: string | null;
    twitter_title?: string | null;
    twitter_description?: string | null;
    twitter_image?: string | null;
    json_ld?: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
    pricing_context: PricingContext;
    alreadyCart: boolean;
    alreadyWishlist: boolean;
    isWishlisted: boolean;
    wishlisted_variants?: (null)[] | null;
}
export interface HomeProductVariant {
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
    attributes: AttributesOrBreakdown;
    stock: number;
    price: number;
    max_price: number;
    weight: number;
    status: boolean;
    images?: (string)[] | null;
}
export interface AttributesOrBreakdown {
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
    breakdown: AttributesOrBreakdown;
}
export interface Variant1 {
    sku: string;
    stock: number;
    price: number;
    max_price?: number | null;
}
export interface SizesEntity1 {
    name: string;
}
export interface VariantsEntity1 {
    sku: string;
    color: string;
    size: string;
    attributes: AttributesOrBreakdown;
    stock: number;
    price: number;
    max_price: number;
    weight: number;
    status: boolean;
    images?: (null)[] | null;
}
export interface HomeCategory {
    _id: string;
    name: string;
    slug: string;
    deletedAt?: null;
    status: boolean;
    parent_category?: null;
    is_mega_menu: boolean;
    image?: string | null;
    description?: string | null;
    createdBy: string;
    meta_title?: string | null;
    meta_description?: string | null;
    og_title?: string | null;
    og_description?: string | null;
    og_image?: string | null;
    twitter_title?: string | null;
    twitter_description?: string | null;
    twitter_image?: string | null;
    json_ld?: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id?: number | null;
    sub_categories?: (null)[] | null;
    count?: number | null;
}
