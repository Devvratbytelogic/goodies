import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ShopCatalog from "@/components/product/ShopCatalog";
import { getHomeRoutePath } from "@/utils/routes";
import { getAllProducts } from "@/server";
import { toCurrency } from "@/utils/currency";
import { HomeProduct } from "@/server/types/Home";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ShopPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string; currency: string }>;
}) {
  const { currency } = await params;
  const country = toCurrency(currency);
  const t = await getTranslations("ShopPage");
  const nav = await getTranslations("Nav");
  const allProductsData = await getAllProducts(country);
  const products = (allProductsData.data ?? []) as HomeProduct[];
  const limit = allProductsData.pagination?.limit || 20;
  const total = allProductsData.pagination?.count || products.length;

  return (
    <ShopCatalog
      title={t("title")}
      breadcrumbs={[
        { label: nav("home"), href: getHomeRoutePath() },
        { label: t("title") },
      ]}
      products={products}
      page={1}
      pageSize={limit}
      totalCount={total}
      minPrice={allProductsData.lowest_price ?? 0}
      maxPrice={allProductsData.highest_price ?? 0}
      currencySymbol={allProductsData.pricing_context?.currency_symbol || "د.إ"}
      currency={country}
    />
  );
}
