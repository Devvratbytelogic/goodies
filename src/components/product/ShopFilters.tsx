"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LuSlidersHorizontal, LuX } from "react-icons/lu";
import { Link } from "@/i18n/navigation";
import ShopPriceFilter from "@/components/product/ShopPriceFilter";
import { getProductCategoryRoutePath, getShopRoutePath } from "@/utils/routes";

type ShopFilterCategory = {
  id: string;
  label: string;
  count?: number;
};

type ShopFiltersProps = {
  filtersLabel: string;
  closeFiltersLabel: string;
  showResultsLabel: string;
  priceTitle: string;
  minPriceLabel: string;
  maxPriceLabel: string;
  minPrice: number;
  maxPrice: number;
  title: string;
  allLabel: string;
  total: number;
  categories: ShopFilterCategory[];
  activeCategoryId?: string;
  showing: string;
  sort: ReactNode;
  children: ReactNode;
};

function FilterList({
  allLabel,
  total,
  categories,
  activeCategoryId,
}: Pick<ShopFiltersProps, "allLabel" | "total" | "categories" | "activeCategoryId">) {
  const allSelected = !activeCategoryId;

  return (
    <ul className="space-y-1">
      <li>
        <Link
          href={getShopRoutePath()}
          aria-current={allSelected ? "page" : undefined}
          className={filterRowClassName(allSelected)}
        >
          <span>{allLabel}</span>
          <span className={allSelected ? "text-primary/70" : "text-muted"}>{total}</span>
        </Link>
      </li>
      {categories.map((category) => {
        const selected = category.id === activeCategoryId;

        return (
          <li key={category.id}>
            <Link
              href={getProductCategoryRoutePath(category.id)}
              aria-current={selected ? "page" : undefined}
              className={filterRowClassName(selected)}
            >
              <span>{category.label}</span>
              {category.count != null ? (
                <span className={selected ? "text-primary/70" : "text-muted"}>{category.count}</span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function filterRowClassName(selected: boolean) {
  const row =
    "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  return selected ? `${row} bg-primary-soft font-semibold text-primary` : `${row} text-heading hover:bg-surface`;
}

function FilterBody({
  priceTitle,
  minPriceLabel,
  maxPriceLabel,
  minPrice,
  maxPrice,
  title,
  allLabel,
  total,
  categories,
  activeCategoryId,
}: Omit<ShopFiltersProps, "filtersLabel" | "closeFiltersLabel" | "showResultsLabel" | "showing" | "sort" | "children">) {
  return (
    <div className="min-w-0 space-y-5 lg:space-y-8">
      <ShopPriceFilter title={priceTitle} minLabel={minPriceLabel} maxLabel={maxPriceLabel} min={minPrice} max={maxPrice} />
      <div>
        <h2 className="text-sm font-bold text-heading">{title}</h2>
        <div className="mt-3">
          <FilterList allLabel={allLabel} total={total} categories={categories} activeCategoryId={activeCategoryId} />
        </div>
      </div>
    </div>
  );
}

export default function ShopFilters({
  filtersLabel,
  closeFiltersLabel,
  showResultsLabel,
  showing,
  sort,
  children,
  ...filters
}: ShopFiltersProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    const media = window.matchMedia("(min-width: 1024px)");
    function onMedia() {
      if (media.matches) setOpen(false);
    }

    document.addEventListener("keydown", onKey);
    media.addEventListener("change", onMedia);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      media.removeEventListener("change", onMedia);
    };
  }, [open]);

  return (
    <>
      <div className="mt-6 grid min-w-0 items-start gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden min-w-0 lg:sticky lg:top-24 lg:block">
          <FilterBody {...filters} />
        </aside>
        <div className="min-w-0">
          <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-w-0 text-sm text-muted">{showing}</p>
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-semibold text-heading transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
              >
                <LuSlidersHorizontal aria-hidden className="size-4" />
                {filtersLabel}
              </button>
              <div className="min-w-0 flex-1 sm:flex-none">{sort}</div>
            </div>
          </div>
          {children}
        </div>
      </div>
      {open ? (
        <div className="fixed inset-0 z-80 lg:hidden">
          <button type="button" aria-label={closeFiltersLabel} className="absolute inset-0 bg-heading/40" onClick={() => setOpen(false)} />
          <div role="dialog" aria-modal="true" aria-label={filtersLabel} className="absolute inset-y-0 inset-s-0 flex w-[min(100%,20rem)] flex-col bg-background shadow-xl">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <h2 className="text-base font-bold text-heading">{filtersLabel}</h2>
              <button
                type="button"
                aria-label={closeFiltersLabel}
                onClick={() => setOpen(false)}
                className="inline-flex size-10 items-center justify-center rounded-full text-heading transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <LuX aria-hidden className="size-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <FilterBody {...filters} />
            </div>
            <div className="border-t border-border p-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {showResultsLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
