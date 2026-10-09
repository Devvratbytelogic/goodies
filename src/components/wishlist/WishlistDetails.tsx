"use client";

import { useTranslations } from "next-intl";
import { LuHeart } from "react-icons/lu";
import ProductCard from "@/components/product/ProductCard";
import { Link } from "@/i18n/navigation";
import { useGetWishlistQuery } from "@/store/endpoints/wishlistApi";
import { getShopRoutePath } from "@/utils/routes";

function WishlistSkeleton() {
  const t = useTranslations("WishlistPage");

  return (
    <div
      className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4"
      aria-busy="true"
      aria-label={t("loading")}
    >
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-border/50 sm:rounded-2xl"
        >
          <div className="aspect-square animate-pulse bg-surface" />
          <div className="space-y-2 px-3 py-3 sm:px-4 sm:pb-4">
            <div className="h-3 w-1/3 animate-pulse rounded bg-surface" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-surface" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-surface" />
            <div className="mt-3 h-11 animate-pulse rounded-full bg-surface" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WishlistDetails() {
  const t = useTranslations("WishlistPage");
  const { data, isLoading, isError, refetch } = useGetWishlistQuery();
  const items = (data ?? []).filter((item) => item.product_id?._id);

  if (isLoading) return <WishlistSkeleton />;

  if (isError) {
    return (
      <div className="mt-5 rounded-2xl border border-border bg-background px-6 py-14 text-center sm:py-16">
        <h2 className="text-lg font-semibold text-heading sm:text-xl">{t("error")}</h2>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mt-5 rounded-2xl border border-border bg-background px-6 py-14 text-center sm:py-16">
        <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-primary-soft text-primary">
          <LuHeart aria-hidden className="size-6" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-heading sm:text-xl">{t("empty")}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{t("emptyNote")}</p>
        <Link
          href={getShopRoutePath()}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t("shop")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <p className="text-sm text-muted">{t("count", { count: items.length })}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <ProductCard key={item._id} product={item.product_id} />
        ))}
      </div>
    </div>
  );
}
