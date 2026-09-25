import ShopPriceFilter from "@/components/product/ShopPriceFilter";

type ShopFilterCategory = {
  id: string;
  label: string;
  count: number;
};

type ShopFiltersProps = {
  filtersLabel: string;
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
      <li className={filterRowClassName(allSelected)}>
        <span>{allLabel}</span>
        <span className={allSelected ? "text-primary/70" : "text-muted"}>{total}</span>
      </li>
      {categories.map((category) => {
        const selected = category.id === activeCategoryId;

        return (
          <li key={category.id} className={filterRowClassName(selected)}>
            <span>{category.label}</span>
            <span className={selected ? "text-primary/70" : "text-muted"}>{category.count}</span>
          </li>
        );
      })}
    </ul>
  );
}

function filterRowClassName(selected: boolean) {
  return selected
    ? "flex items-center justify-between rounded-md bg-primary-soft px-3 py-2 text-sm font-semibold text-primary"
    : "flex items-center justify-between rounded-md px-3 py-2 text-sm text-heading";
}

export default function ShopFilters({
  filtersLabel,
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
}: ShopFiltersProps) {
  const price = (
    <ShopPriceFilter
      title={priceTitle}
      minLabel={minPriceLabel}
      maxLabel={maxPriceLabel}
      min={minPrice}
      max={maxPrice}
    />
  );
  const categoriesList = (
    <FilterList allLabel={allLabel} total={total} categories={categories} activeCategoryId={activeCategoryId} />
  );

  return (
    <aside>
      <details open className="rounded-xl border border-border lg:rounded-none lg:border-0">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-heading lg:hidden">{filtersLabel}</summary>
        <div className="space-y-5 border-t border-border px-4 py-4 lg:space-y-8 lg:border-0 lg:p-0">
          {price}
          <div>
            <h2 className="text-sm font-bold text-heading">{title}</h2>
            <div className="mt-3">{categoriesList}</div>
          </div>
        </div>
      </details>
    </aside>
  );
}
