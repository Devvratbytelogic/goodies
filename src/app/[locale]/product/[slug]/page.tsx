import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import ProductCard from "@/components/product/ProductCard";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPurchase from "@/components/product/ProductPurchase";
import ProductTabs from "@/components/product/ProductTabs";
import type { ProductCategoryKey } from "@/data/products";
import { getAllProductSlugs, getProductBySlug, getRelatedProducts } from "@/data/products";
import { routing } from "@/i18n/routing";
import { getHomeRoutePath, getProductCategoryRoutePath } from "@/utils/routes";

const categorySlug: Record<ProductCategoryKey, string> = {
  fruits: "fruits",
  vegetables: "vegetables",
  iceCream: "ice-cream",
  candy: "candy",
};

type ProductPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);

  if (!product || !hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "ProductPage" });
  const cards = await getTranslations({ locale, namespace: "ProductCard" });
  const name = cards(product.nameKey);

  return {
    title: name,
    description: t("metaDescription", { name, category: cards(product.categoryKey) }),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const t = await getTranslations("ProductPage");
  const cards = await getTranslations("ProductCard");
  const nav = await getTranslations("Nav");
  const name = cards(product.nameKey);
  const category = cards(product.categoryKey);
  const related = getRelatedProducts(product.slug);
  const sizeSummary =
    product.sizes.length > 0 ? product.sizes.map((size) => t(size.id)).join(", ") : undefined;

  return (
    <div className="container section_y_space">
      <Breadcrumbs
        className="mb-5"
        items={[
          { label: nav("home"), href: getHomeRoutePath() },
          { label: category, href: getProductCategoryRoutePath(categorySlug[product.categoryKey]) },
          { label: name },
        ]}
      />

      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} alt={name} />
        <div>
          <h1 className="text-2xl font-semibold text-primary!">{name}</h1>
          <ProductPurchase
            slug={product.slug}
            name={name}
            priceFrom={product.priceFrom}
            priceTo={product.priceTo}
            sizes={product.sizes}
          />
        </div>
      </div>

      <ProductTabs name={name} sizeSummary={sizeSummary} />

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
