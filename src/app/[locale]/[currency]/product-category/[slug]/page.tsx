import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ShopCatalog from "@/components/product/ShopCatalog";
import FaqList from "@/components/layout/common/FaqList";
import { getAllProducts, getCategories, getCategory } from "@/server";
import { markdownToHtml } from "@/utils/markdown";
import { defaultCurrency, toCurrency } from "@/utils/currency";
import { getHomeRoutePath, getShopRoutePath } from "@/utils/routes";
import { HomeProduct } from "@/server/types/Home";

export const revalidate = 600;

export async function generateStaticParams() {
  try {
    const categories = (await getCategories(defaultCurrency)) ?? [];
    return categories.filter((category) => category.slug).map((category) => ({ slug: category.slug }));
  } catch (error) {
    console.error("generateStaticParams: category list unavailable", error);
    return [];
  }
}

function readSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

type ProductCategoryPageProps = {
  params: Promise<{ locale: string; currency: string; slug: string }>;
};

function metaText(value?: string | null) {
  const text = value?.trim();
  return text || undefined;
}

export async function generateMetadata({ params }: ProductCategoryPageProps): Promise<Metadata> {
  const { currency, slug } = await params;
  const data = await getCategory(toCurrency(currency), readSlug(slug));
  const category = data?.category;
  if (!category) return {};

  const title = metaText(category.meta_title) ?? category.name;
  const description = metaText(category.meta_description) ?? metaText(category.description);
  const image = metaText(category.og_image) ?? metaText(category.image);
  const twitterImage = metaText(category.twitter_image) ?? image;

  return {
    title,
    description,
    openGraph: {
      title: metaText(category.og_title) ?? title,
      description: metaText(category.og_description) ?? description,
      images: image ? [image] : undefined,
    },
    twitter: {
      card: twitterImage ? "summary_large_image" : "summary",
      title: metaText(category.twitter_title) ?? title,
      description: metaText(category.twitter_description) ?? description,
      images: twitterImage ? [twitterImage] : undefined,
    },
  };
}

export default async function ProductCategoryPage({ params }: ProductCategoryPageProps) {
  const { currency, slug: rawSlug } = await params;
  const country = toCurrency(currency);
  const slug = readSlug(rawSlug);
  const data = await getCategory(country, slug);
  const category = data?.category;

  const shop = await getTranslations("ShopPage");
  const nav = await getTranslations("Nav");
  const categoryCopy = await getTranslations("ProductCategoryPage");
  const allProductsData = await getAllProducts(country, 1, undefined, undefined, undefined, category.slug);
  const products = (allProductsData.data ?? []) as HomeProduct[];
  const limit = allProductsData.pagination?.limit || 20;
  const total = allProductsData.pagination?.count || products.length;

  return (
    <>
      {category.json_ld ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: category.json_ld }} />
      ) : null}
      <ShopCatalog
        title={category.name}
        breadcrumbs={[
          { label: nav("home"), href: getHomeRoutePath() },
          { label: shop("title"), href: getShopRoutePath() },
          { label: category.name },
        ]}
        products={products}
        activeCategoryId={category.slug}
        page={1}
        pageSize={limit}
        totalCount={total}
        minPrice={allProductsData.lowest_price ?? 0}
        maxPrice={allProductsData.highest_price ?? 0}
        currencySymbol={allProductsData.pricing_context?.currency_symbol || "د.إ"}
        currency={country}
      />
      {category.description?.trim() ? (
        <section className="container mb-10">
          <div
            className="category-description"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(category.description) }}
          />
        </section>
      ) : null}
      <FaqList title={categoryCopy("faqs")} items={category.faqs} />
    </>
  );
}
