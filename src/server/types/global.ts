export interface GlobalDataApiResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: GlobalData;
  message: string;
  timestamp: string;
}
export interface GlobalData {
  _id: string;
  platformName: string;
  platformDescription: string;
  email: string;
  google_analytics_id: string;
  google_tag_manager: string;
  microsoft_clarity: string;
  meta_pixel: string;
  meta_domain_verification: string;
  meta_description: string;
  meta_keywords: string;
  meta_title: string;
  og_tag: string;
  og_description: string;
  og_image: string;
  og_title: string;
  twitter_description: string;
  twitter_image: string;
  twitter_title: string;
  phone: string;
  whatsapp_number: string;
  schema_markup: string;
  search_console: string;
  instagram_link: string;
  youtube_link: string;
  x_link: string;
  linkdin_link: string;
  facebook_link: string;
  created_by: number;
  address: string;
  createdAt: string;
  updatedAt: string;
  id: number;
  __v: number;
  icon_image: string;
  logo: string;
  home_page_banner: string;
  cod_enable: boolean;
  linkdin_logo?: null;
  x_logo?: null;
  instagram_logo?: null;
  icon_image_dark?: null;
  membership_price: number;
  currency: string;
  pricing_context: PricingContext;
  shipping_rate: ShippingRate;
  header_text_first: string;
  header_text_second: string;
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
export interface ShippingRate {
  country: string;
  code: string;
  currency: string;
  rate: number;
  membership_rate: number;
}
