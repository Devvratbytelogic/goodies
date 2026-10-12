import type { AllProductsApiResponse, AllProductsData } from "@/server/types/allProducts";
import type { CurrencyCode } from "@/utils/currency";
import { api } from "../api";

export type ShopProductsArgs = {
  currency: CurrencyCode;
  page: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  category?: string;
};

export const productsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getShopProducts: build.query<AllProductsData, ShopProductsArgs>({
      query: ({ currency, page, minPrice, maxPrice, sort, category }) => {
        const params = new URLSearchParams({ page: String(page), limit: "20" });
        if (minPrice != null && maxPrice != null) {
          params.set("min_price", String(minPrice));
          params.set("max_price", String(maxPrice));
        }
        if (sort) params.set("sort", sort);
        if (category) params.set("category", category);

        return {
          url: `/user/all-product?${params}`,
          headers: { country: currency },
        };
      },
      transformResponse: (response: AllProductsApiResponse) => response.data,
    }),
  }),
});

export const { useGetShopProductsQuery } = productsApi;
