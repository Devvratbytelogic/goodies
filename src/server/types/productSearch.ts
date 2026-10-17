export interface ProductSearchApiResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: ProductSearchData;
    message: string;
    timestamp: string;
}
export interface ProductSearchData {
    products?: (ProductSearchProduct)[] | null;
    categories?: (ProductSearchCategory)[] | null;
}
export interface ProductSearchProduct {
    id: number;
    _id: string;
    name: string;
    slug: string;
    thumbnail: string;
    product_type: string;
    prices: ProductSearchPrices;
    category?: ProductSearchCategory | null;
    alreadyCart: boolean;
    alreadyWishlist: boolean;
    isWishlisted: boolean;
}
export interface ProductSearchPrices {
    price: number;
    max_price: number;
    currency: string;
    currency_symbol: string;
}
export interface ProductSearchCategory {
    id: number;
    _id: string;
    name: string;
    slug: string;
    thumbnail: string;
}
