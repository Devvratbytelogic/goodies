import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ShopCatalog from "@/components/product/ShopCatalog";
import { getCatalogProducts } from "@/data/products";
import { getHomeRoutePath } from "@/utils/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ShopPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ShopPage() {
  const t = await getTranslations("ShopPage");
  const nav = await getTranslations("Nav");

  return (
    <ShopCatalog
      title={t("title")}
      breadcrumbs={[
        { label: nav("home"), href: getHomeRoutePath() },
        { label: t("title") },
      ]}
      products={getCatalogProducts()}
    />
  );
}
