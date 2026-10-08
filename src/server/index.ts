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

export function getCategories(country: string) {
  return unstable_cache(
    () => getData<HomeCategory[]>("/user/categories", country),
    ["categories", country],
    { tags: ["categories"], revalidate: 600 },
  )();
}

export const getProducts = unstable_cache(
  () => getData<ProductListItem[]>("/user/products", defaultCurrency),
  ["products"],
  { tags: ["products"], revalidate: 600 },
);

export function getHomePage(country: string) {
  return unstable_cache(
    () => getData<HomePageData>("/user/home-page", country),
    ["home-page", country],
    { tags: ["home-page"], revalidate: 600 },
  )();
}

export function getAllProducts(country: string, page = 1, minPrice?: number, maxPrice?: number, sort?: string, category?: string) {
  const query = new URLSearchParams({ page: String(page), limit: "20" });
  if (minPrice != null && maxPrice != null) {
    query.set("min_price", String(minPrice));
    query.set("max_price", String(maxPrice));
  }
  if (sort) query.set("sort", sort);
  if (category) query.set("category", category);

  return unstable_cache(
    () => getData<AllProductsData>(`/user/all-product?${query}`, country),
    ["all-product", query.toString(), country],
    { tags: ["all-product"], revalidate: 600 },
  )();
}

export function getCategory(country: string, slug: string, page = 1) {
  const decoded = productSlug(slug);
  const query = new URLSearchParams({ page: String(page), limit: "5" });

  return unstable_cache(
    () => getData<SingleCategoryApiResponseData>(`/user/category/${encodeURIComponent(decoded)}?${query}`, country),
    ["category", decoded, query.toString(), country],
    { tags: ["category", `category:${decoded}`], revalidate: 600 },
  )();
}

export function getProduct(country: string, slug: string) {
  const decoded = productSlug(slug);

  return unstable_cache(
    () => getData<SingleProductData>(`/user/product/${encodeURIComponent(decoded)}`, country),
    ["product", decoded, country],
    { tags: [`product:${decoded}`], revalidate: 120 },
  )();
}
