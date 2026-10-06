import { HomeProduct } from "./Home";

export interface SingleProductApiResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: SingleProductData;
  message: string;
  timestamp: string;
}
export interface SingleProductData {
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
  images?: (string)[] | null;
  colors?: (null)[] | null;
  sizes?: (SizesEntity)[] | null;
  variants?: (VariantsEntity)[] | null;
  categoryId: CategoryId;
  brandId?: null;
  deletedAt?: null;
  createdBy?: null;
  description: string;
  short_description: string;
  url: string;
  bundle_items?: (BundleItemsEntity)[] | null;
  max_selection: number;
  min_selection: number;
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
  meta_description?: null;
  og_title: string;
  og_description?: null;
  og_image: string;
  twitter_title: string;
  twitter_description?: null;
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
  related_products?: HomeProduct[] | null;
}
export interface Variant {
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
export interface BundleItemsEntity {
  variant_sku?: string | null;
  variant_key?: string | null;
  product_id: ProductId;
}
export interface ProductId {
  _id: string;
  id: number;
  title: string;
  slug: string;
  sku: string;
  product_type: string;
  thumbnail: string;
  images?: (string | null)[] | null;
  status: boolean;
  weight: number;
  stock: number;
  description: string;
  short_description: string;
  colors?: (null)[] | null;
  sizes?: (SizesEntity | null)[] | null;
  variant: VariantsEntity;
  variants?: (VariantsEntity | null)[] | null;
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

export interface SizesEntity {
  name: string;
}

export interface VariantsEntity {
  is_default: boolean;
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
export interface Breakdown {
}
