import { unstable_cache } from "next/cache";
import { cache } from "react";
import { api } from "./api";
import { HomeCategory, HomePageData } from "./types/Home";
import { AllProductsData } from "./types/allProducts";
import { ProductListItem } from "./types/products";
import { SingleProductData } from "./types/singleProduct";


function productSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

async function getData<T>(path: string) {
  const { data } = await api.get(path);
  return data.data as T;
}



export const getProducts = unstable_cache(
  () => getData<ProductListItem[]>("/user/products"), //only for get all products list in the product with title and slug for isr
  ["products"],
  { tags: ["products"], revalidate: 600 },
);

export function getAllProducts(page = 1, minPrice?: number, maxPrice?: number, sort?: string) {
  const query = new URLSearchParams({ page: String(page), limit: "20" });
  if (minPrice != null && maxPrice != null) {
    query.set("min_price", String(minPrice));
    query.set("max_price", String(maxPrice));
  }
  if (sort) query.set("sort", sort);

  return unstable_cache(
    () => getData<AllProductsData>(`/user/all-product?${query}`),
    ["all-product", query.toString()],
    { tags: ["all-product"], revalidate: 600 },
  )();
}

export const getCategories = unstable_cache(
  () => getData<HomeCategory[]>("/user/categories"),
  ["categories"],
  { tags: ["categories"], revalidate: 600 },
);

export const getHomePage = unstable_cache(
  () => getData<HomePageData>("/user/home-page"),
  ["home-page"],
  { tags: ["home-page"], revalidate: 600 }, // 10 minutes
);

export function getProduct(slug: string) {
  const decoded = productSlug(slug);

  return unstable_cache(
    () => getData<SingleProductData>(`/user/product/${encodeURIComponent(decoded)}`),
    ["product", decoded],
    { tags: [`product:${decoded}`], revalidate: 120 },
  )();
}