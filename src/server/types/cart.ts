import { ProductId as SingleProductProductId } from "./singleProduct";

export interface CartApiResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: CartApiResponseData;
    message: string;
    timestamp: string;
}
export interface CartApiResponseData {
    items?: (CartItem)[] | null;
    shipping_rate: ShippingRate;
    summary: Summary;
}
export interface CartItem {
    _id: string;
    guest_user?: null;
    cart_id: string;
    user_id: string;
    product_id: ProductId;
    product_type: string;
    bundle_selections?: (BundleSelectionsEntity | null)[] | null;
    variant_sku?: string | null;
    variant_key?: string | null;
    selected_size?: string | null;
    selected_attributes: SelectedAttributes;
    quantity: number;
    currency: string;
    exchange_rate: number;
    shipping_charge?: null;
    single_price: number;
    mrp: number;
    tax: number;
    total: number;
    createdAt: string;
    updatedAt: string;
    id: number;
    __v: number;
    selected_variant: SelectedVariant;
}
export interface BundleSelectionsEntity {
    product_id: SingleProductProductId;
    variant_sku?: string | null;
    variant_key?: string | null;
    quantity: number;
    _id: string;
}
export interface ProductId {
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
    sizes?: (SizesEntity | null)[] | null;
    variants?: (VariantsEntityOrSelectedVariant | null)[] | null;
    variant: VariantOrSelectedVariant;
    categoryId: string;
    brandId?: null;
    deletedAt?: null;
    createdBy?: null;
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
    pricing_context: PricingContext;
    is_best_seller?: boolean | null;
    is_new_arrival?: boolean | null;
}
export interface SizesEntity {
    name: string;
}
export interface VariantsEntityOrSelectedVariant {
    sku: string;
    color: string;
    size: string;
    attributes: AttributesOrSelectedAttributes;
    stock: number;
    price: number;
    max_price: number;
    weight: number;
    status: boolean;
    is_default: boolean;
}
export interface AttributesOrSelectedAttributes {
    size: string;
}
export interface VariantOrSelectedVariant {
    sku: string;
    stock: number;
    price: number;
    max_price: number;
}
export interface PricingContext {
    country: string;
    currency: string;
    currency_symbol: string;
    exchange_rate: number;
    base_currency: string;
    applied_percentage: number;
    region: string;
    breakdown: BreakdownOrSelectedAttributesOrTaxBreakdown;
}
export interface BreakdownOrSelectedAttributesOrTaxBreakdown {
}
export interface SelectedAttributes {
    size?: string | null;
}
export interface SelectedVariant {
    sku: string;
    stock: number;
    price: number;
    max_price: number;
    color?: string | null;
    size?: string | null;
    attributes?: AttributesOrSelectedAttributes1 | null;
    weight?: number | null;
    status?: boolean | null;
    is_default?: boolean | null;
}
export interface AttributesOrSelectedAttributes1 {
    size: string;
}
export interface ShippingRate {
    id: string;
    title: string;
    method: string;
    zone_name: string;
    country: string;
    currency: string;
    charge: number;
    is_free_shipping: boolean;
}
export interface Summary {
    cart_id: string;
    item_count: number;
    subtotal: number;
    tax_amount: number;
    shipping_charge: number;
    shipping_rate_available: boolean;
    coupon_code?: string | null;
    coupon_type?: string | null;
    coupon_value?: number | null;
    discount_amount: number;
    total_amount: number;
    currency: string;
    currency_symbol: string;
    exchange_rate: number;
    pricing_region: string;
    tax_breakdown: BreakdownOrSelectedAttributesOrTaxBreakdown;
}
