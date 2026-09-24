import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import ProductCard from "@/components/product/ProductCard";
import ShopFilters from "@/components/product/ShopFilters";
import ShopSortSelect from "@/components/product/ShopSortSelect";
import { getCatalogProducts, shopCategoryOrder } from "@/data/products";
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
  const cards = await getTranslations("ProductCard");
  const nav = await getTranslations("Nav");
  const catalog = getCatalogProducts();
  const prices = catalog.flatMap((product) =>
    product.priceTo ? [product.priceFrom, product.priceTo] : [product.priceFrom],
  );
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return (
    <div className="container section_y_space">
      <Breadcrumbs
        className="mb-4"
        items={[
          { label: nav("home"), href: getHomeRoutePath() },
          { label: t("title") },
        ]}
      />
      <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        <ShopFilters
          filtersLabel={t("filters")}
          priceTitle={t("price")}
          minPriceLabel={t("minPrice")}
          maxPriceLabel={t("maxPrice")}
          minPrice={minPrice}
          maxPrice={maxPrice}
          title={t("categories")}
          allLabel={t("allProducts")}
          total={catalog.length}
          categories={shopCategoryOrder.map((key) => ({
            id: key,
            label: cards(key),
            count: catalog.filter((product) => product.categoryKey === key).length,
          }))}
        />

        <div>
          <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              {t("showing", { from: 1, to: catalog.length, total: catalog.length })}
            </p>
            <ShopSortSelect
              id="shop-sort"
              label={t("sortLabel")}
              defaultValue="default"
              options={[
                { value: "default", label: t("sortDefault") },
                { value: "latest", label: t("sortLatest") },
                { value: "price-asc", label: t("sortPriceAsc") },
                { value: "price-desc", label: t("sortPriceDesc") },
              ]}
            />
          </div>

          <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
            {catalog.map((product) => (
              <li key={product.slug}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
