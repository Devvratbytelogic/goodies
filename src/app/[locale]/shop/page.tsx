import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Pagination from "@/components/product/Pagination";
import ShopCatalog from "@/components/product/ShopCatalog";
import { getHomeRoutePath, getShopRoutePath } from "@/utils/routes";
import { getAllProducts } from "@/server";

function priceParam(value?: string) {
  if (!value) return undefined;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : undefined;
}

const sorts = ["newest", "low_to_high", "high_to_low"];

function sortParam(value?: string) {
  return sorts.includes(value ?? "") ? value : undefined;
}

function pageHref(number: number, minPrice?: number, maxPrice?: number, sort?: string) {
  const params = new URLSearchParams();
  if (number > 1) params.set("page", String(number));
  if (minPrice != null && maxPrice != null) {
    params.set("min_price", String(minPrice));
    params.set("max_price", String(maxPrice));
  }
  if (sort) params.set("sort", sort);
  const query = params.toString();
  return query ? `${getShopRoutePath()}?${query}` : getShopRoutePath();
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ShopPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; min_price?: string; max_price?: string; sort?: string }>;
}) {
  const t = await getTranslations("ShopPage");
  const nav = await getTranslations("Nav");
  const { page: pageParam, min_price: minParam, max_price: maxParam, sort: sortQuery } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const selectedMin = priceParam(minParam);
  const selectedMax = priceParam(maxParam);
  const price = selectedMin != null && selectedMax != null ? { min: selectedMin, max: selectedMax } : undefined;
  const sort = sortParam(sortQuery);
  const allProductsData = await getAllProducts(page, price?.min, price?.max, sort);
  const products = allProductsData.data ?? [];
  const limit = allProductsData.pagination?.limit || 20;
  const total = allProductsData.pagination?.count || products.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const minPrice = allProductsData.lowest_price ?? 0;
  const maxPrice = allProductsData.highest_price ?? 0;
  const currencySymbol = allProductsData.pricing_context?.currency_symbol || "د.إ";

  return (
    <>
      <ShopCatalog
        title={t("title")}
        breadcrumbs={[
          { label: nav("home"), href: getHomeRoutePath() },
          { label: t("title") },
        ]}
        products={products}
        page={page}
        pageSize={limit}
        totalCount={total}
        minPrice={minPrice}
        maxPrice={maxPrice}
        priceFrom={price?.min}
        priceTo={price?.max}
        currencySymbol={currencySymbol}
        sort={sort ?? ""}
      />
      <Pagination
        page={page}
        totalPages={totalPages}
        label={t("pagination")}
        previousLabel={t("previous")}
        nextLabel={t("next")}
        href={(number) => pageHref(number, price?.min, price?.max, sort)}
      />
    </>
  );
}
