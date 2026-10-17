"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LuChevronLeft, LuChevronRight, LuStar } from "react-icons/lu";
import { Link } from "@/i18n/navigation";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { useAuth } from "@/components/auth/AuthProvider";
import { useGetMyReviewsQuery } from "@/store/endpoints/userApi";
import { getProductRoutePath } from "@/utils/routes";

const ratings = [1, 2, 3, 4, 5] as const;

const reviewStatus = {
  approved: "reviewApproved",
  pending: "reviewPending",
  rejected: "reviewRejected",
} as const;

function ReviewStars({ rating, label }: { rating: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={label}>
      {ratings.map((value) => (
        <LuStar key={value} aria-hidden className={`size-4 ${value <= rating ? "fill-amber-400 text-amber-400" : "text-border"}`} />
      ))}
    </span>
  );
}

export function AccountReviewList() {
  const t = useTranslations("AccountPage");
  const locale = useLocale();
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const { data, isLoading, isUninitialized, isFetching, isError } = useGetMyReviewsQuery({ page, limit: 10 }, { skip: !token });

  if ((isLoading || isUninitialized) && !data) {
    return (
      <ul className="mt-6 grid gap-3" aria-hidden>
        {Array.from({ length: 2 }, (_, index) => (
          <li key={index} className="rounded-2xl border border-border bg-background px-5 py-4">
            <div className="h-4 w-40 animate-pulse rounded bg-surface-muted" />
            <div className="mt-3 h-4 w-24 animate-pulse rounded bg-surface-muted" />
            <div className="mt-3 h-4 w-full animate-pulse rounded bg-surface-muted" />
          </li>
        ))}
      </ul>
    );
  }

  const reviews = data?.reviews ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <>
      {isError ? <p className="mt-6 text-sm text-muted">{t("reviewsError")}</p> : null}
      {!isError && reviews.length === 0 ? <p className="mt-6 text-sm text-muted">{t("noReviews")}</p> : null}
      {reviews.length > 0 ? (
        <ul className={`mt-6 grid gap-3 ${isFetching ? "opacity-70" : ""}`}>
          {reviews.map((review) => {
            const product = review.product;
            const created = new Date(review.createdAt);
            const when = Number.isNaN(created.getTime()) ? "" : new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(created);
            const statusKey = review.status in reviewStatus ? reviewStatus[review.status as keyof typeof reviewStatus] : undefined;

            return (
              <li key={review._id} className="rounded-2xl border border-border bg-background px-4 py-4 sm:px-5">
                <div className="flex min-w-0 gap-3">
                  {product?.thumbnail ? (
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-surface">
                      <ImageComponent src={product.thumbnail} alt="" width={112} height={112} sizes="56px" objectFit="cover" />
                    </span>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      {product?.slug ? (
                        <Link
                          href={getProductRoutePath(product.slug)}
                          className="text-sm font-semibold text-heading hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          {product.title}
                        </Link>
                      ) : (
                        <p className="text-sm font-semibold text-heading">{product?.title || review.name}</p>
                      )}
                      {statusKey ? (
                        <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-primary-soft px-2.5 text-xs font-semibold text-primary">
                          {t(statusKey)}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <ReviewStars rating={review.rating} label={t("star", { count: review.rating })} />
                      {when ? <time dateTime={review.createdAt} className="text-xs text-muted">{when}</time> : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-foreground">{review.text}</p>
                    <p className="mt-1 text-xs text-muted">{review.name}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
      {totalPages > 1 ? (
        <nav aria-label={t("reviewsPagination")} className="mt-6 flex items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => setPage((current) => current - 1)}
            disabled={page <= 1 || isFetching}
            aria-label={t("reviewsPrevious")}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border text-heading transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-35"
          >
            <LuChevronLeft aria-hidden className="size-4 rtl:-scale-x-100" />
          </button>
          <span className="px-2 text-sm font-semibold text-heading">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => current + 1)}
            disabled={page >= totalPages || isFetching}
            aria-label={t("reviewsNext")}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border text-heading transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-35"
          >
            <LuChevronRight aria-hidden className="size-4 rtl:-scale-x-100" />
          </button>
        </nav>
      ) : null}
    </>
  );
}
