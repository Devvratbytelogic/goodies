import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Pagination from "@/components/product/Pagination";
import ShopCatalog from "@/components/product/ShopCatalog";
import { getHomeRoutePath, getShopRoutePath } from "@/utils/routes";
import { getAllProducts } from "@/server";

function pageHref(number: number) {
  return number <= 1 ? getShopRoutePath() : `${getShopRoutePath()}?page=${number}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ShopPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const t = await getTranslations("ShopPage");
  const nav = await getTranslations("Nav");
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const allProductsData = await getAllProducts(page);
  const products = allProductsData.data ?? [];
  const limit = allProductsData.pagination?.limit || 20;
  const total = allProductsData.pagination?.count || products.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const minPrice = allProductsData.filters?.lowest_price || 0;
  const maxPrice = allProductsData.filters?.highest_price || 0;

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
      />
      <Pagination
        page={page}
        totalPages={totalPages}
        label={t("pagination")}
        previousLabel={t("previous")}
        nextLabel={t("next")}
        href={pageHref}
      />
    </>
  );
}
