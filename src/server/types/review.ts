export interface MyReviewsArgs {
  page?: number;
  limit?: number;
}

export interface MyReviewsResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data?: MyReviewsData | null;
  message: string;
  timestamp: string;
}

export interface MyReviewsData {
  reviews?: MyReview[] | null;
  pagination?: MyReviewsPagination | null;
}

export interface MyReviewsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MyReviewProduct {
  _id: string;
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  product_type: string;
}

export interface MyReview {
  _id: string;
  id: number;
  rating: number;
  text: string;
  status: string;
  name: string;
  product_type: string;
  variant_sku?: string | null;
  variant_key?: string | null;
  createdAt: string;
  product?: MyReviewProduct | null;
}
