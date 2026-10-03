"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LuHeart } from "react-icons/lu";
import ImageComponent from "@/components/layout/common/ImageComponent";
import AddToCartButton from "@/components/product/AddToCartButton";
import { Link } from "@/i18n/navigation";
import { getProductRoutePath, getShopRoutePath } from "@/utils/routes";

export type WishlistItem = {
  slug: string;
  name: string;
  image: string;
  category: string;
  priceFrom: number;
  priceTo?: number;
  isNew?: boolean;
};

function formatAedAmount(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function WishlistDetails({ items }: { items: WishlistItem[] }) {
  const t = useTranslations("WishlistPage");
  const cards = useTranslations("ProductCard");
  const [saved, setSaved] = useState(items);

  return (
    <div className="mt-6">
      <p className="text-sm text-muted">{t("count", { count: saved.length })}</p>

      {saved.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-border bg-background px-6 py-12 text-center">
          <p className="text-muted">{t("empty")}</p>
          <Link
            href={getShopRoutePath()}
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("shop")}
          </Link>
        </div>
      ) : (
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {saved.map((item) => {
            const priceFrom = formatAedAmount(item.priceFrom);
            const priceTo = item.priceTo ? formatAedAmount(item.priceTo) : undefined;
            const hasRange = Boolean(priceTo && item.priceTo !== item.priceFrom);

            return (
              <li key={item.slug}>
                <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border/50 bg-background sm:rounded-2xl">
                  <button
                    type="button"
                    aria-label={t("remove", { name: item.name })}
                    onClick={() => setSaved((current) => current.filter((savedItem) => savedItem.slug !== item.slug))}
                    className="absolute inset-e-2.5 top-2.5 z-10 inline-flex size-8 items-center justify-center rounded-full bg-background/95 text-primary shadow-sm ring-1 ring-border/50 transition-colors hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:inset-e-3 sm:top-3"
                  >
                    <LuHeart aria-hidden className="size-4 fill-current" />
                  </button>
                  <Link
                    href={getProductRoutePath(item.slug)}
                    className="flex flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <div className="relative aspect-square overflow-hidden bg-surface">
                      <ImageComponent
                        src={item.image}
                        alt={item.name}
                        width={800}
                        height={800}
                        objectFit="cover"
                        sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 20vw"
                      />
                      {item.isNew ? (
                        <span className="absolute inset-s-2.5 top-2.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground sm:inset-s-3 sm:top-3">
                          {cards("new")}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col px-3 pt-2.5 sm:px-4 sm:pt-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">{item.category}</p>
                      <h2 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold leading-snug text-heading sm:min-h-11 sm:text-[15px]">
                        {item.name}
                      </h2>
                      <p className="mt-1.5 text-sm font-semibold text-price">
                        {hasRange && priceTo ? (
                          <>
                            <span className="sr-only">{cards("priceRangeLabel", { from: priceFrom, to: priceTo })}</span>
                            <span aria-hidden>{cards("priceRange", { from: priceFrom, to: priceTo })}</span>
                          </>
                        ) : (
                          <>
                            <span className="sr-only">{cards("priceLabel", { amount: priceFrom })}</span>
                            <span aria-hidden>{cards("price", { amount: priceFrom })}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </Link>
                  <div className="px-3 pt-3 pb-3 sm:px-4 sm:pb-4">
                    {/* <AddToCartButton slug={item.slug} name={item.name} /> */}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
