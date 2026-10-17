import type { AllProductsApiResponse, AllProductsData } from "@/server/types/allProducts";
import type { ProductSearchApiResponse, ProductSearchData } from "@/server/types/productSearch";
import type { CurrencyCode } from "@/utils/currency";
import { api } from "../api";


export type ShopProductsArgs = {
  currency: CurrencyCode;
  page: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  category?: string;
  search?: string;
};

export const productsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProductSearch: build.query<ProductSearchData, string>({
      query: (search) => `/user/product-search?search=${encodeURIComponent(search)}&limit=14`,
      transformResponse: (response: ProductSearchApiResponse) => ({
        products: response.data?.products ?? [],
        categories: response.data?.categories ?? [],
      }),
    }),
    getShopProducts: build.query<AllProductsData, ShopProductsArgs>({
      query: ({ currency, page, minPrice, maxPrice, sort, category, search }) => {
        const params = new URLSearchParams({ page: String(page), limit: "20" });
        if (minPrice != null && maxPrice != null) {
          params.set("min_price", String(minPrice));
          params.set("max_price", String(maxPrice));
        }
        if (sort) params.set("sort", sort);
        if (category) params.set("category", category);
        if (search) params.set("search", search);

        return {
          url: `/user/all-product?${params}`,
          headers: { country: currency },
        };
      },
      transformResponse: (response: AllProductsApiResponse) => response.data,
    }),
    createReview: build.mutation({
      query: (body) => ({
        url: "/user/review/create",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetShopProductsQuery, useGetProductSearchQuery, useCreateReviewMutation } = productsApi;
