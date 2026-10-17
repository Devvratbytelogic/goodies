"use client";

import { useTranslations } from "next-intl";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { Link } from "@/i18n/navigation";
import type { ProductSearchCategory, ProductSearchProduct } from "@/server/types/productSearch";
import { formatAmount } from "@/utils/price";
import { getProductCategoryRoutePath, getProductRoutePath } from "@/utils/routes";

type SearchSuggestionsProps = {
  listId: string;
  activeIndex: number;
  query: string;
  products: ProductSearchProduct[];
  categories: ProductSearchCategory[];
  isFetching: boolean;
  isError: boolean;
  onPick: () => void;
};

function priceLabel(product: ProductSearchProduct) {
  const { price, max_price: maxPrice, currency_symbol: symbol } = product.prices;
  if (product.product_type === "variable" && maxPrice > price) {
    return `${formatAmount(price, symbol)} – ${formatAmount(maxPrice, symbol)}`;
  }
  return formatAmount(price, symbol);
}

export function SearchSuggestions({
  listId,
  activeIndex,
  query,
  products,
  categories,
  isFetching,
  isError,
  onPick,
}: SearchSuggestionsProps) {
  const t = useTranslations("Header");
  const hasResults = products.length > 0 || categories.length > 0;
  let optionIndex = 0;

  return (
    <div className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-border bg-background shadow-lg">
      <div id={listId} role="listbox" aria-label={t("searchSuggestions")} className="max-h-[min(24rem,70vh)] overflow-y-auto p-2">
        {isFetching && !hasResults ? <p className="px-3 py-2 text-sm text-muted">{t("searching")}</p> : null}
        {isError ? <p className="px-3 py-2 text-sm text-muted">{t("searchError")}</p> : null}
        {!isFetching && !isError && !hasResults ? (
          <p className="px-3 py-2 text-sm text-muted">{t("searchEmpty", { query })}</p>
        ) : null}

        {categories.length > 0 ? (
          <div>
            <p className="px-3 pt-1 pb-1 text-xs font-semibold tracking-wide text-muted uppercase">{t("searchCategories")}</p>
            <ul>
              {categories.map((category) => {
                const index = optionIndex++;
                return (
                  <li key={category._id} role="presentation">
                    <Link
                      id={`${listId}-option-${index}`}
                      role="option"
                      aria-selected={activeIndex === index}
                      href={getProductCategoryRoutePath(category.slug)}
                      onClick={onPick}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-heading ${activeIndex === index ? "bg-primary-soft text-primary" : "hover:bg-surface"}`}
                    >
                      <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-surface">
                        <ImageComponent src={category.thumbnail || "/images/image-fallback.svg"} alt="" fill sizes="40px" objectFit="cover" />
                      </span>
                      <span className="line-clamp-1">{category.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {products.length > 0 ? (
          <div>
            <p className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-muted uppercase">{t("searchProducts")}</p>
            <ul>
              {products.map((product) => {
                const index = optionIndex++;
                return (
                  <li key={product._id} role="presentation">
                    <Link
                      id={`${listId}-option-${index}`}
                      role="option"
                      aria-selected={activeIndex === index}
                      href={getProductRoutePath(product.slug)}
                      onClick={onPick}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 ${activeIndex === index ? "bg-primary-soft" : "hover:bg-surface"}`}
                    >
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-surface">
                        <ImageComponent src={product.thumbnail || "/images/image-fallback.svg"} alt="" fill sizes="48px" objectFit="cover" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-1 text-sm font-semibold text-heading">{product.name}</span>
                        {product.category?.name ? <span className="line-clamp-1 text-xs text-muted">{product.category.name}</span> : null}
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-price">{priceLabel(product)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>

      {hasResults ? (
        <button type="submit" className="block w-full border-t border-border px-4 py-2.5 text-center text-sm font-semibold text-primary hover:bg-primary-soft">
          {t("searchSeeAll")}
        </button>
      ) : null}
    </div>
  );
}
