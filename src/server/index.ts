import { unstable_cache } from "next/cache";
import { defaultCurrency } from "@/utils/currency";
import { api } from "./api";
import { HomeCategory, HomePageData } from "./types/Home";
import { AllProductsData } from "./types/allProducts";
import { ProductListItem } from "./types/products";
import { SingleProductData } from "./types/singleProduct";
import { SingleCategoryApiResponseData } from "./types/singleCategory";

function productSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

async function getData<T>(path: string, country: string) {
  const { data } = await api.get(path, { headers: { country } });
  return data.data as T;
}

function cached<T>(country: string, key: string[], tags: string[], revalidate: number, load: () => Promise<T>) {
  return unstable_cache(load, [...key, country], { tags, revalidate })();
}

// Slug list for build-time params. Slugs do not change with currency.
export const getProducts = unstable_cache(
  () => getData<ProductListItem[]>("/user/products", defaultCurrency),
  ["products", defaultCurrency],
  { tags: ["products"], revalidate: 600 },
);

export function getAllProducts(
  page = 1,
  minPrice?: number,
  maxPrice?: number,
  sort?: string,
  category?: string,
  country = defaultCurrency,
) {
  const query = new URLSearchParams({ page: String(page), limit: "20" });
  if (minPrice != null && maxPrice != null) {
    query.set("min_price", String(minPrice));
    query.set("max_price", String(maxPrice));
  }
  if (sort) query.set("sort", sort);
  if (category) query.set("category", category);

  return cached(
    country,
    ["all-product", query.toString()],
    ["all-product"],
    600,
    () => getData<AllProductsData>(`/user/all-product?${query}`, country),
  );
}

export function getCategory(slug: string, page = 1, country = defaultCurrency) {
  const decoded = productSlug(slug);
  const query = new URLSearchParams({ page: String(page), limit: "5" });

  return cached(
    country,
    ["category", decoded, query.toString()],
    ["category", `category:${decoded}`],
    600,
    () => getData<SingleCategoryApiResponseData>(`/user/category/${encodeURIComponent(decoded)}?${query}`, country),
  );
}

export function getCategories(country = defaultCurrency) {
  return cached(country, ["categories"], ["categories"], 600, () => getData<HomeCategory[]>("/user/categories", country));
}

export function getHomePage(country = defaultCurrency) {
  return cached(country, ["home-page"], ["home-page"], 600, () => getData<HomePageData>("/user/home-page", country));
}

export function getProduct(slug: string, country = defaultCurrency) {
  const decoded = productSlug(slug);

  return cached(
    country,
    ["product", decoded],
    [`product:${decoded}`],
    120,
    () => getData<SingleProductData>(`/user/product/${encodeURIComponent(decoded)}`, country),
  );
}
