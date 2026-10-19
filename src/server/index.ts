import { unstable_cache } from "next/cache";
import { defaultCurrency } from "@/utils/currency";
import { api } from "./api";
import { HomeCategory, HomePageData } from "./types/Home";
import { GlobalData } from "./types/global";
import { AllProductsData } from "./types/allProducts";
import { ProductListItem } from "./types/products";
import { SingleProductData } from "./types/singleProduct";
import { SingleCategoryApiResponseData } from "./types/singleCategory";
import { Article, ArticleCategory, ArticlesResponseData, BlogCategoryResponseData } from "./types/article";

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

export function getGlobal(country: string) {
  return unstable_cache(
    () => getData<GlobalData>("/user/get-global", country),
    ["get-global", country],
    { tags: ["get-global"], revalidate: 600 },
  )();
}

export async function getGlobalSettings(country: string) {
  try {
    return await getGlobal(country);
  } catch (error) {
    const digest = typeof error === "object" && error && "digest" in error ? String(error.digest) : "";
    if (digest.startsWith("NEXT_REDIRECT")) throw error;
    console.error(`get-global failed: ${error instanceof Error ? error.message : "request failed"}`);
    return null;
  }
}

export function getHomePage(country: string) {
  return unstable_cache(
    () => getData<HomePageData>("/user/home-page", country),
    ["home-page", country],
    { tags: ["home-page"], revalidate: 600 },
  )();
}

export function getAllProducts(country: string, page = 1, minPrice?: number, maxPrice?: number, sort?: string, category?: string, search?: string) {
  const query = new URLSearchParams({ page: String(page), limit: "20" });
  if (minPrice != null && maxPrice != null) {
    query.set("min_price", String(minPrice));
    query.set("max_price", String(maxPrice));
  }
  if (sort) query.set("sort", sort);
  if (category) query.set("category", category);
  if (search) query.set("search", search);

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
    // "products" is already cleared on save, so bundle pages refresh with the edited item.
    { tags: ["products", `product:${decoded}`], revalidate: 600 },
  )();
}

export function getArticles(country: string, page = 1, search?: string) {
  const query = new URLSearchParams({ page: String(page), limit: "9" });
  if (search) query.set("search", search);

  return unstable_cache(
    () => getData<ArticlesResponseData>(`/user/get-articles?${query}`, country),
    ["articles", query.toString(), country],
    { tags: ["articles"], revalidate: 600 },
  )();
}

export function getLatestArticles(country: string, limit = 6) {
  const query = new URLSearchParams({ limit: String(limit) });

  return unstable_cache(
    () => getData<Article[]>(`/user/latest-articles?${query}`, country),
    ["latest-articles", query.toString(), country],
    { tags: ["articles"], revalidate: 600 },
  )();
}

export function getBlogCategories(country: string) {
  return unstable_cache(
    () => getData<ArticleCategory[]>("/user/get-blog-categories", country),
    ["blog-categories", country],
    { tags: ["articles"], revalidate: 600 },
  )();
}

export function getBlogCategory(country: string, slug: string, page = 1, search?: string) {
  const decoded = productSlug(slug);
  const query = new URLSearchParams({ page: String(page), limit: "9" });
  if (search) query.set("search", search);

  return unstable_cache(
    () => getData<BlogCategoryResponseData>(`/user/get-blog-category/${encodeURIComponent(decoded)}?${query}`, country),
    ["blog-category", decoded, query.toString(), country],
    { tags: ["articles", `blog-category:${decoded}`], revalidate: 600 },
  )();
}

export function getArticle(country: string, slug: string) {
  const decoded = productSlug(slug);

  return unstable_cache(
    () => getData<Article>(`/user/get-article/${encodeURIComponent(decoded)}`, country),
    ["article", decoded, country],
    { tags: ["articles", `article:${decoded}`], revalidate: 600 },
  )();
}
