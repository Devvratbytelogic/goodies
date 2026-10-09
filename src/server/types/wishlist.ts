import type { HomeProduct } from "./Home";

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
    guest_user?: string | null;
    user_id?: string | null;
    product_id: HomeProduct;
    product_type: string;
    variant_sku?: string | null;
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