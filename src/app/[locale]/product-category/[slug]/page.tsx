import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ShopCatalog from "@/components/product/ShopCatalog";
import { getCategoryKeyBySlug, getCategorySlugs, getProductsByCategory, type ProductCategoryKey } from "@/data/products";
import { routing } from "@/i18n/routing";
import { getHomeRoutePath, getShopRoutePath } from "@/utils/routes";

type ProductCategoryPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const menuCategorySlugs: Record<string, { titleKey: "freezeDriedCandy" | "freezeDriedFruits" | "chocolate" | "giftBoxes" | "bundles"; categoryKey?: ProductCategoryKey }> = {
  "freeze-dried-candy": { titleKey: "freezeDriedCandy", categoryKey: "candy" },
  "freeze-dried-fruits": { titleKey: "freezeDriedFruits", categoryKey: "fruits" },
  chocolate: { titleKey: "chocolate" },
  "gift-boxes": { titleKey: "giftBoxes" },
  bundles: { titleKey: "bundles" },
};

function categoryPage(slug: string) {
  const menuCategory = menuCategorySlugs[slug];
  if (menuCategory) {
    return menuCategory;
  }

  const categoryKey = getCategoryKeyBySlug(slug);
  if (!categoryKey) {
    return null;
  }

  return { categoryKey, titleKey: categoryKey };
}

export function generateStaticParams() {
  return [...getCategorySlugs(), ...Object.keys(menuCategorySlugs)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductCategoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = categoryPage(slug);

  if (!category || !hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "ProductCategoryPage" });
  const title = menuCategorySlugs[slug]
    ? (await getTranslations({ locale, namespace: "ShopMenu" }))(menuCategorySlugs[slug].titleKey)
    : (await getTranslations({ locale, namespace: "ProductCard" }))(category.titleKey as ProductCategoryKey);

  return {
    title,
    description: t("description", { category: title }),
  };
}

export default async function ProductCategoryPage({ params }: ProductCategoryPageProps) {
  const { slug } = await params;
  const category = categoryPage(slug);

  if (!category) {
    notFound();
  }

  const shop = await getTranslations("ShopPage");
  const nav = await getTranslations("Nav");
  const title = menuCategorySlugs[slug]
    ? (await getTranslations("ShopMenu"))(menuCategorySlugs[slug].titleKey)
    : (await getTranslations("ProductCard"))(category.titleKey as ProductCategoryKey);

  return (
    <ShopCatalog
      title={title}
      breadcrumbs={[
        { label: nav("home"), href: getHomeRoutePath() },
        { label: shop("title"), href: getShopRoutePath() },
        { label: title },
      ]}
      products={category.categoryKey ? getProductsByCategory(category.categoryKey) : []}
      activeCategoryId={category.categoryKey}
    />
  );
}
