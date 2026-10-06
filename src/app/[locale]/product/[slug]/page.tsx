import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import ProductCard from "@/components/product/ProductCard";
import ProductGallery from "@/components/product/ProductGallery";
import ProductSelection from "@/components/product/ProductSelection";
import { getHomeRoutePath, getProductCategoryRoutePath } from "@/utils/routes";
import { getProduct, getProducts } from "@/server";

type ProductPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  try {
    const products = (await getProducts()) ?? [];
    return products.filter((item) => item.slug).map((item) => ({ slug: item.slug }));
  } catch (error) {
    console.error("generateStaticParams: product list unavailable", error);
    return [];
  }
}

function metaText(value?: string | null) {
  const text = value?.trim();
  return text || undefined;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProduct(slug);
  const title = metaText(product.meta_title) ?? product.title;
  const description =
    metaText(product.meta_description) ??
    metaText(product.short_description) ??
    metaText(product.description);
  const image = metaText(product.og_image) ?? metaText(product.thumbnail);
  const twitterImage = metaText(product.twitter_image) ?? image;

  return {
    title,
    description,
    openGraph: {
      title: metaText(product.og_title) ?? title,
      description: metaText(product.og_description) ?? description,
      images: image ? [image] : undefined,
    },
    twitter: {
      card: twitterImage ? "summary_large_image" : "summary",
      title: metaText(product.twitter_title) ?? title,
      description: metaText(product.twitter_description) ?? description,
      images: twitterImage ? [twitterImage] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  const t = await getTranslations("ProductPage");
  const nav = await getTranslations("Nav");
  const name = product?.title ?? '';
  const category = product?.categoryId?.name ?? '';
  const categorySlug = product?.categoryId?.slug ?? '';
  const isVariant = product?.is_variant;
  const variant = product?.variant;
  const variants = product?.variants ?? [];
  const sizes = product?.sizes ?? [];
  const related = product.related_products ?? [];
  const isBundle = product?.product_type === "bundle";
  const bundleItems = product?.bundle_items ?? [];

  return (
    <div className="container section_y_space">
      {product.json_ld ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: product.json_ld }} />
      ) : null}
      <Breadcrumbs
        className="mb-5"
        items={[
          { label: nav("home"), href: getHomeRoutePath() },
          { label: category, href: getProductCategoryRoutePath(categorySlug) },
          { label: name },
        ]}
      />

      <ProductSelection
        name={name}
        slug={product.slug}
        isVariant={isVariant}
        variant={variant}
        variants={variants}
        sizes={sizes}
        currencySymbol={product.pricing_context?.currency_symbol ?? ""}
        weight={product.weight}
        productId={product._id}

        isBundle={isBundle}
        bundleItems={bundleItems}
        maxSelection={product.max_selection}
        minSelection={product.min_selection}
        bundleStock={product.stock}
      >
        <ProductGallery images={[product.thumbnail ?? "", ...(product.images ?? [])]} alt={name} />
      </ProductSelection>

      {related.length > 0 ? (
        <section className="mt-14" aria-labelledby="related-products">
          <h2 id="related-products" className="text-xl font-bold sm:text-2xl">
            {t("related")}
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
