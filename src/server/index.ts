import { unstable_cache } from "next/cache";
import { cache } from "react";
import { api } from "./api";
import { HomePageData } from "./types/Home";
import { AllProductsData } from "./types/allProducts";
import { ProductListItem } from "./types/products";
import { SingleProductData } from "./types/singleProduct";

export type HomeCategory = {
  id: string;
  name: string;
  slug: string;
  image?: string;
};

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
  () => getData<ProductListItem[]>("/user/products"),
  ["products"],
  { tags: ["products"], revalidate: 600 },
);

export const getAllProducts = unstable_cache(
  () => getData<AllProductsData>("/user/all-product"),
  ["all-product"],
  { tags: ["all-product"], revalidate: 600 },
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

export const getCategories = cache(() => getData<HomeCategory[]>("/user/categories"));
