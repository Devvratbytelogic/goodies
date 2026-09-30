import { unstable_cache } from "next/cache";
import { cache } from "react";
import { api } from "./api";
import { HomePageData } from "./types/Home";

export type HomeCategory = {
  id: string;
  name: string;
  slug: string;
  image?: string;
};

async function getData<T>(path: string) {
  const { data } = await api.get(path);
  return data.data as T;
}

export const getHomePage = unstable_cache(
  () => getData<HomePageData>("/user/home-page"),
  ["home-page"],
  { tags: ["home-page"], revalidate: 600 }, // 10 minutes
);

export function getProduct<T = unknown>(slug: string) {
  return unstable_cache(
    () => getData<T>(`/user/product/${encodeURIComponent(slug)}`),
    ["product", slug],
    { tags: [`product:${slug}`], revalidate: 120 },
  )();
}

export const getCategories = cache(() => getData<HomeCategory[]>("/user/categories"));
