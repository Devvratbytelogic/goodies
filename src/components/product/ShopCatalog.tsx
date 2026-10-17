import { getTranslations } from "next-intl/server";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/layout/common/Breadcrumbs";
import Pagination from "@/components/product/Pagination";
import ProductGrid from "@/components/product/ProductGrid";
import ShopFilters from "@/components/product/ShopFilters";
import { getCategories } from "@/server";
import { HomeProduct } from "@/server/types/Home";
import type { CurrencyCode } from "@/utils/currency";
import { getProductCategoryRoutePath, getShopRoutePath } from "@/utils/routes";
import { shopPageHref, shopResultWindow } from "@/utils/shopQuery";

type ShopCatalogProps = {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  products: HomeProduct[];
  activeCategoryId?: string;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  minPrice?: number;
  maxPrice?: number;
  currencySymbol?: string;
  currency: CurrencyCode;
};

export default async function ShopCatalog({
  title,
  breadcrumbs,
  products,
  activeCategoryId,
  page = 1,
  pageSize,
  totalCount,
  minPrice,
  maxPrice,
  currencySymbol,
  currency,
}: ShopCatalogProps) {
  const t = await getTranslations("ShopPage");
  const categoryList = (await getCategories(currency)) ?? [];
  const count = products.length;
  const total = totalCount ?? count;
  const size = pageSize ?? count;
  const { from, to, totalPages } = shopResultWindow(page, size, count, total);
  const path = activeCategoryId ? getProductCategoryRoutePath(activeCategoryId) : getShopRoutePath();

  return (
    <div className="container section_y_space">
      <Breadcrumbs className="mb-4" items={breadcrumbs} />
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

      <ShopFilters
        filtersLabel={t("filters")}
        closeFiltersLabel={t("closeFilters")}
        showResultsLabel={t("showResults")}
        priceTitle={t("price")}
        removePriceLabel={t("removePrice")}
        removeSearchLabel={t("removeSearch")}
        minPriceLabel={t("minPrice")}
        maxPriceLabel={t("maxPrice")}
        minPrice={minPrice}
        maxPrice={maxPrice}
        currencySymbol={currencySymbol}
        removeSortLabel={t("removeSort")}
        title={t("categories")}
        allLabel={t("allProducts")}
        total={total}
        activeCategoryId={activeCategoryId}
        showing={t("showing", { from, to, total })}
        currency={currency}
        sortFieldLabel={t("sortLabel")}
        sortOptions={[
          { value: "", label: t("sortDefault") },
          { value: "newest", label: t("sortLatest") },
          { value: "low_to_high", label: t("sortPriceAsc") },
          { value: "high_to_low", label: t("sortPriceDesc") },
        ]}
        categories={categoryList.map((category) => ({
          id: category.slug,
          label: category.name,
          count: category.count ?? 0,
        }))}
      >
        <ProductGrid products={products} />
        <Pagination
          className="mt-8 flex items-center justify-center gap-1.5"
          page={page}
          totalPages={totalPages}
          label={t("pagination")}
          previousLabel={t("previous")}
          nextLabel={t("next")}
          href={(number) => shopPageHref(path, number)}
        />
      </ShopFilters>
    </div>
  );
}
