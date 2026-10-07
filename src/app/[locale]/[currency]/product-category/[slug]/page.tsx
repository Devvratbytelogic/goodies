import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Pagination from "@/components/product/Pagination";
import ShopCatalog from "@/components/product/ShopCatalog";
import FaqList from "@/components/layout/common/FaqList";
import { getAllProducts, getCategory } from "@/server";
import { markdownToHtml } from "@/utils/markdown";
import { toCurrency } from "@/utils/currency";
import { getHomeRoutePath, getProductCategoryRoutePath, getShopRoutePath } from "@/utils/routes";

function priceParam(value?: string) {
  if (!value) return undefined;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : undefined;
}

const sorts = ["newest", "low_to_high", "high_to_low"];

function sortParam(value?: string) {
  return sorts.includes(value ?? "") ? value : undefined;
}

function readSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function pageHref(slug: string, number: number, minPrice?: number, maxPrice?: number, sort?: string) {
  const params = new URLSearchParams();
  if (number > 1) params.set("page", String(number));
  if (minPrice != null && maxPrice != null) {
    params.set("min_price", String(minPrice));
    params.set("max_price", String(maxPrice));
  }
  if (sort) params.set("sort", sort);
  const path = getProductCategoryRoutePath(slug);
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

type ProductCategoryPageProps = {
  params: Promise<{ currency: string; slug: string }>;
  searchParams: Promise<{ page?: string; min_price?: string; max_price?: string; sort?: string }>;
};

function metaText(value?: string | null) {
  const text = value?.trim();
  return text || undefined;
}

export async function generateMetadata({ params }: ProductCategoryPageProps): Promise<Metadata> {
  const { currency, slug } = await params;
  const data = await getCategory(readSlug(slug), 1, toCurrency(currency));
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

export default async function ProductCategoryPage({ params, searchParams }: ProductCategoryPageProps) {
  const { currency, slug: rawSlug } = await params;
  const country = toCurrency(currency);
  const slug = readSlug(rawSlug);
  const data = await getCategory(slug, 1, country);
  const category = data?.category;

  const shop = await getTranslations("ShopPage");
  const nav = await getTranslations("Nav");
  const categoryCopy = await getTranslations("ProductCategoryPage");
  const { page: pageParam, min_price: minParam, max_price: maxParam, sort: sortQuery } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const selectedMin = priceParam(minParam);
  const selectedMax = priceParam(maxParam);
  const price = selectedMin != null && selectedMax != null ? { min: selectedMin, max: selectedMax } : undefined;
  const sort = sortParam(sortQuery);
  const allProductsData = await getAllProducts(page, price?.min, price?.max, sort, category.slug, country);
  const products = allProductsData.data ?? [];
  const limit = allProductsData.pagination?.limit || 20;
  const total = allProductsData.pagination?.count || products.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
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
        page={page}
        pageSize={limit}
        totalCount={total}
        minPrice={allProductsData.lowest_price ?? 0}
        maxPrice={allProductsData.highest_price ?? 0}
        priceFrom={price?.min}
        priceTo={price?.max}
        currencySymbol={allProductsData.pricing_context?.currency_symbol || "د.إ"}
        currency={country}
        sort={sort ?? ""}
      />
      <Pagination
        page={page}
        totalPages={totalPages}
        label={shop("pagination")}
        previousLabel={shop("previous")}
        nextLabel={shop("next")}
        href={(number) => pageHref(category.slug, number, price?.min, price?.max, sort)}
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
