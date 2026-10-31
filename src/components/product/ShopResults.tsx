"use client";

import type { ReactNode } from "react";
import { LuX } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import Pagination from "@/components/product/Pagination";
import ProductGrid from "@/components/product/ProductGrid";
import ProductGridSkeleton from "@/components/product/ProductGridSkeleton";
import ShopSortSelect from "@/components/product/ShopSortSelect";
import { useGetShopProductsQuery } from "@/store/endpoints/productsApi";
import type { HomeProduct } from "@/server/types/Home";
import type { CurrencyCode } from "@/utils/currency";
import { formatAmount } from "@/utils/price";
import { getProductCategoryRoutePath, getShopRoutePath } from "@/utils/routes";
import { shopSearchPath } from "@/utils/shopSearch";
import { priceParam, shopPageHref, shopPageParam, shopResultWindow, sortParam } from "@/utils/shopQuery";

type SortOption = { value: string; label: string };

type ShopResultColumnProps = {
  showing: string;
  sort: string;
  sortFieldLabel: string;
  sortOptions: SortOption[];
  filtersButton: ReactNode;
  priceLabel?: string;
  priceMin?: number;
  priceMax?: number;
  currencySymbol?: string;
  removePriceLabel?: string;
  sortLabel?: string;
  removeSortLabel?: string;
  searchLabel?: string;
  removeSearchLabel?: string;
  onClearPrice?: () => void;
  onClearSort?: () => void;
  onClearSearch?: () => void;
  clearFiltersLabel?: string;
  onClearFilters?: () => void;
  list: ReactNode;
};

export function ShopResultColumn({
  showing,
  sort,
  sortFieldLabel,
  sortOptions,
  filtersButton,
  priceLabel,
  priceMin,
  priceMax,
  currencySymbol,
  removePriceLabel,
  sortLabel,
  removeSortLabel,
  searchLabel,
  removeSearchLabel,
  onClearPrice,
  onClearSort,
  onClearSearch,
  clearFiltersLabel,
  onClearFilters,
  list,
}: ShopResultColumnProps) {
  return (
    <>
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-w-0 text-sm text-muted">{showing}</p>
        <div className="flex min-w-0 items-center gap-2">
          {filtersButton}
          <div className="min-w-0 flex-1 sm:flex-none">
            <ShopSortSelect id="shop-sort" label={sortFieldLabel} value={sort} options={sortOptions} />
          </div>
        </div>
      </div>
      {priceLabel || sortLabel || searchLabel ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {priceLabel && onClearPrice ? (
            <li>
              <button
                type="button"
                onClick={onClearPrice}
                aria-label={`${removePriceLabel}, ${priceLabel}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft py-1 ps-3 pe-1.5 text-sm font-semibold text-primary transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span dir="ltr" className="inline-flex items-center gap-1">
                  <span className="inline-flex items-center gap-1">
                    {currencySymbol ? <bdi>{currencySymbol}</bdi> : null}
                    <span>{priceMin}</span>
                  </span>
                  <span aria-hidden>–</span>
                  <span className="inline-flex items-center gap-1">
                    {currencySymbol ? <bdi>{currencySymbol}</bdi> : null}
                    <span>{priceMax}</span>
                  </span>
                </span>
                <LuX aria-hidden className="size-3.5" />
              </button>
            </li>
          ) : null}
          {searchLabel && onClearSearch ? (
            <li>
              <button
                type="button"
                onClick={onClearSearch}
                aria-label={`${removeSearchLabel}, ${searchLabel}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft py-1 ps-3 pe-1.5 text-sm font-semibold text-primary transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {searchLabel}
                <LuX aria-hidden className="size-3.5" />
              </button>
            </li>
          ) : null}
          {sortLabel && onClearSort ? (
            <li>
              <button
                type="button"
                onClick={onClearSort}
                aria-label={`${removeSortLabel}, ${sortLabel}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft py-1 ps-3 pe-1.5 text-sm font-semibold text-primary transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {sortLabel}
                <LuX aria-hidden className="size-3.5" />
              </button>
            </li>
          ) : null}
          {clearFiltersLabel && onClearFilters ? (
            <li>
              <button
                type="button"
                onClick={onClearFilters}
                className="inline-flex items-center rounded-full px-2 py-1 text-sm font-semibold text-primary underline-offset-2 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {clearFiltersLabel}
              </button>
            </li>
          ) : null}
        </ul>
      ) : null}
      {list}
    </>
  );
}

type ShopResultsProps = {
  showing: string;
  currency: CurrencyCode;
  category?: string;
  currencySymbol?: string;
  sortFieldLabel: string;
  sortOptions: SortOption[];
  removePriceLabel: string;
  removeSortLabel: string;
  removeSearchLabel: string;
  clearFiltersLabel: string;
  filtersButton: ReactNode;
  fallback: ReactNode;
};

// The server renders page 1. This loads another page, sort, or price from the browser.
export default function ShopResults({
  showing,
  currency,
  category,
  currencySymbol,
  sortFieldLabel,
  sortOptions,
  removePriceLabel,
  removeSortLabel,
  removeSearchLabel,
  clearFiltersLabel,
  filtersButton,
  fallback,
}: ShopResultsProps) {
  const shop = useTranslations("ShopPage");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = shopPageParam(searchParams.get("page"));
  const sort = sortParam(searchParams.get("sort"));
  const minPrice = priceParam(searchParams.get("min_price"));
  const maxPrice = priceParam(searchParams.get("max_price"));
  const search = searchParams.get("search")?.trim() || undefined;
  const hasPrice = minPrice != null && maxPrice != null;
  const refresh = page > 1 || Boolean(sort) || hasPrice || Boolean(search);
  const { data, isFetching, isError } = useGetShopProductsQuery(
    {
      currency,
      category,
      page,
      minPrice: hasPrice ? minPrice : undefined,
      maxPrice: hasPrice ? maxPrice : undefined,
      sort,
      search,
    },
    { skip: !refresh },
  );

  function clearSearch(updates: Record<string, string | null>) {
    router.push(shopSearchPath(pathname, window.location.search, updates), { scroll: false });
  }

  const path = category ? getProductCategoryRoutePath(category) : getShopRoutePath();
  const sortLabel = sort ? sortOptions.find((option) => option.value === sort)?.label : undefined;
  const priceLabel = hasPrice ? `${formatAmount(minPrice, currencySymbol)} – ${formatAmount(maxPrice, currencySymbol)}` : undefined;
  const activeFilters = Number(hasPrice) + Number(Boolean(sort)) + Number(Boolean(search));
  const loading = refresh && !isError && (isFetching || !data);

  let list = fallback;
  let resultShowing = showing;

  if (loading) {
    list = <ProductGridSkeleton label={shop("loading")} />;
  } else if (refresh && data) {
    const products = (data.data ?? []) as HomeProduct[];
    const limit = data.pagination?.limit || 20;
    const total = data.pagination?.count || products.length;
    const range = shopResultWindow(page, limit, products.length, total);
    resultShowing = shop("showing", { from: range.from, to: range.to, total });
    list = (
      <>
        <ProductGrid products={products} />
        <Pagination
          className="mt-8 flex items-center justify-center gap-1.5"
          page={page}
          totalPages={range.totalPages}
          label={shop("pagination")}
          previousLabel={shop("previous")}
          nextLabel={shop("next")}
          href={(number) => shopPageHref(path, number, hasPrice ? minPrice : undefined, hasPrice ? maxPrice : undefined, sort, search)}
        />
      </>
    );
  }

  return (
    <ShopResultColumn
      showing={resultShowing}
      sort={sort ?? ""}
      sortFieldLabel={sortFieldLabel}
      sortOptions={sortOptions}
      filtersButton={filtersButton}
      priceLabel={priceLabel}
      priceMin={hasPrice ? minPrice : undefined}
      priceMax={hasPrice ? maxPrice : undefined}
      currencySymbol={currencySymbol}
      removePriceLabel={removePriceLabel}
      sortLabel={sortLabel}
      removeSortLabel={removeSortLabel}
      searchLabel={search}
      removeSearchLabel={removeSearchLabel}
      onClearPrice={() => clearSearch({ min_price: null, max_price: null })}
      onClearSort={() => clearSearch({ sort: null })}
      onClearSearch={() => clearSearch({ search: null })}
      clearFiltersLabel={activeFilters > 1 ? clearFiltersLabel : undefined}
      onClearFilters={activeFilters > 1 ? () => clearSearch({ min_price: null, max_price: null, sort: null, search: null }) : undefined}
      list={list}
    />
  );
}
