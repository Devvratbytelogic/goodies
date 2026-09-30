export interface ProductsApiResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data?: ProductListItem[] | null;
  message: string;
  timestamp: string;
}

export interface ProductListItem {
  _id: string;
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
}
