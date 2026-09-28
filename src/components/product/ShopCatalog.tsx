import { getTranslations } from "next-intl/server";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/layout/common/Breadcrumbs";
import ProductCard from "@/components/product/ProductCard";
import ShopFilters from "@/components/product/ShopFilters";
import ShopSortSelect from "@/components/product/ShopSortSelect";
import { getCatalogProducts, shopCategoryOrder, type ProductCardItem, type ProductCategoryKey } from "@/data/products";

type ShopCatalogProps = {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  products: ProductCardItem[];
  activeCategoryId?: ProductCategoryKey;
};

export default async function ShopCatalog({ title, breadcrumbs, products, activeCategoryId }: ShopCatalogProps) {
  const t = await getTranslations("ShopPage");
  const cards = await getTranslations("ProductCard");
  const catalog = getCatalogProducts();
  const pricedProducts = products.length > 0 ? products : catalog;
  const prices = pricedProducts.flatMap((product) =>
    product.priceTo ? [product.priceFrom, product.priceTo] : [product.priceFrom],
  );
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const count = products.length;

  return (
    <div className="container section_y_space">
      <Breadcrumbs className="mb-4" items={breadcrumbs} />
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

      <ShopFilters
        filtersLabel={t("filters")}
        closeFiltersLabel={t("closeFilters")}
        showResultsLabel={t("showResults")}
        priceTitle={t("price")}
        minPriceLabel={t("minPrice")}
        maxPriceLabel={t("maxPrice")}
        minPrice={minPrice}
        maxPrice={maxPrice}
        title={t("categories")}
        allLabel={t("allProducts")}
        total={catalog.length}
        activeCategoryId={activeCategoryId}
        showing={t("showing", { from: count === 0 ? 0 : 1, to: count, total: count })}
        categories={shopCategoryOrder.map((key) => ({
          id: key,
          label: cards(key),
          count: catalog.filter((product) => product.categoryKey === key).length,
        }))}
        sort={
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
        }
      >
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
          {products.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </ShopFilters>
    </div>
  );
}
