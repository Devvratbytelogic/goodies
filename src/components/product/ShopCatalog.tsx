import { getTranslations } from "next-intl/server";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/layout/common/Breadcrumbs";
import ProductCard from "@/components/product/ProductCard";
import ShopFilters from "@/components/product/ShopFilters";
import ShopSortSelect from "@/components/product/ShopSortSelect";
import { getCategories } from "@/server";
import { HomeProduct } from "@/server/types/Home";

type ShopCatalogProps = {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  products: HomeProduct[];
  activeCategoryId?: string;
  page?: number;
  pageSize?: number;
  totalCount?: number;
};

export default async function ShopCatalog({
  title,
  breadcrumbs,
  products,
  activeCategoryId,
  page = 1,
  pageSize,
  totalCount,
}: ShopCatalogProps) {
  const t = await getTranslations("ShopPage");
  const categoryList = (await getCategories()) ?? [];
  const count = products.length;
  const total = totalCount ?? count;
  const size = pageSize ?? count;
  const from = count === 0 ? 0 : (page - 1) * size + 1;
  const to = count === 0 ? 0 : from + count - 1;

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
        minPrice={15}
        maxPrice={100}
        title={t("categories")}
        allLabel={t("allProducts")}
        total={total}
        activeCategoryId={activeCategoryId}
        showing={t("showing", { from, to, total })}
        categories={categoryList.map((category) => ({
          id: category.slug,
          label: category.name,
          count: category.count ?? 0,
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
          {products.length > 0 ? products.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} />
            </li>
          )) : (
            <li>
              <p>No products found</p>
            </li>
          )}
        </ul>
      </ShopFilters>
    </div>
  );
}
