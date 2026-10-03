export interface SingleCategoryApiResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: SingleCategoryApiResponseData;
  message: string;
  timestamp: string;
}
export interface SingleCategoryApiResponseData {
  category: Category;
  products?: (SingleCategoryProduct)[] | null;
  pagination: Pagination;
}
export interface Category {
  _id: string;
  name: string;
  slug: string;
  deletedAt?: null;
  status: boolean;
  parent_category?: null;
  is_mega_menu: boolean;
  image: string;
  description: string;
  createdBy: string;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  json_ld: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: number;
  faqs?: (FaqsEntity)[] | null;
}
export interface FaqsEntity {
  _id: string;
  categoryId: string;
  question: string;
  answer: string;
  status: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
}
export interface SingleCategoryProduct {
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
  sizes?: (SingleCategorySize | null)[] | null;
  variants?: (VariantsEntity | null)[] | null;
  categoryId: CategoryId;
  brandId?: null;
  deletedAt?: null;
  createdBy?: string | null;
  description: string;
  short_description: string;
  url: string;
  bundle_items?: (BundleItemsEntity | null)[] | null;
  max_selection?: number | null;
  average_rating: number;
  total_reviews: number;
  total_sales: number;
  transition: string;
  is_variant: boolean;
  most_loved: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  featured: boolean;
  new_product: boolean;
  custom_notes: string;
  view_count: number;
  meta_title: string;
  meta_description?: string | null;
  og_title: string;
  og_description?: string | null;
  og_image?: string | null;
  twitter_title: string;
  twitter_description?: string | null;
  twitter_image?: string | null;
  json_ld: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
export interface SingleCategorySize {
  name: string;
}
export interface VariantsEntity {
  is_default: boolean;
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
export interface BundleItemsEntity {
  product_id: string;
  variant_sku?: string | null;
  variant_key?: string | null;
  _id: string;
  id: string;
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
