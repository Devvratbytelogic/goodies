"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { LuCircleCheck, LuStar } from "react-icons/lu";
import type { InferType } from "yup";
import { RequiredMark } from "@/components/form/RequiredMark";
import type { ReviewsEntity } from "@/server/types/singleProduct";
import { useCreateReviewMutation } from "@/store/endpoints/productsApi";
import { productReviewValidationSchema } from "@/validations";

type ReviewValues = InferType<typeof productReviewValidationSchema>;
type ValidationMessageKey = "required" | "emailInvalid" | "invalidText" | "tooLong";

const ratings = [1, 2, 3, 4, 5] as const;

const initialValues: ReviewValues = {
  rating: 0,
  text: "",
  name: "",
  email: "",
};

const fieldClassName =
  "mt-2 w-full rounded-2xl border border-border bg-background px-4 text-sm font-normal text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition-colors focus:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-primary";

function ReviewStars({ rating, label, size = "size-4" }: { rating: number; label: string; size?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={label}>
      {ratings.map((value) => (
        <LuStar key={value} aria-hidden className={`${size} ${value <= rating ? "fill-amber-400 text-amber-400" : "text-border"}`} />
      ))}
    </span>
  );
}

function reviewDate(value: string, locale: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
}

export default function ProductReview({
  productId,
  name,
  reviews,
  averageRating,
  totalReviews,
}: {
  productId: string;
  name: string;
  reviews: ReviewsEntity[];
  averageRating: number;
  totalReviews: number;
}) {
  const t = useTranslations("ProductPage");
  const locale = useLocale();
  const [createReview] = useCreateReviewMutation();
  const [submitted, setSubmitted] = useState(false);
  const [writing, setWriting] = useState(false);
  const [hovered, setHovered] = useState(0);

  const formik = useFormik<ReviewValues>({
    initialValues,
    validationSchema: productReviewValidationSchema,
    onSubmit: async (values) => {
      if (!productId) return;
      await createReview({
        product_id: productId,
        rating: values.rating,
        text: values.text.trim(),
        name: values.name.trim(),
        email: values.email.trim(),
      }).unwrap();
      setSubmitted(true);
      setWriting(false);
    },
  });

  function fieldError(field: keyof ReviewValues) {
    const error = formik.touched[field] ? formik.errors[field] : undefined;
    return error ? t(error as ValidationMessageKey) : undefined;
  }

  const shownRating = hovered || formik.values.rating;
  const hasReviews = reviews.length > 0;
  const ratingText = Number.isInteger(averageRating) ? String(averageRating) : averageRating.toFixed(1);

  const addButtonClass = writing
    ? "inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold text-heading transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    : "inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <div className="mt-6 rounded-2xl border border-border bg-surface/70 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {hasReviews ? (
          <div className="flex items-center gap-3">
            <ReviewStars rating={averageRating} label={t("averageRating", { rating: ratingText })} size="size-5" />
            <div>
              <p className="text-sm font-bold text-heading">{t("averageRating", { rating: ratingText })}</p>
              <p className="text-xs text-muted">{t("reviews", { count: totalReviews })}</p>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted">{t("noReviews")}</p>
            <h3 className="mt-0.5 text-lg font-bold tracking-tight text-heading">{t("beFirst", { name })}</h3>
          </div>
        )}
        {submitted ? null : (
          <button
            type="button"
            aria-expanded={writing}
            aria-controls="review-form"
            onClick={() => setWriting((open) => !open)}
            className={addButtonClass}
          >
            {writing ? t("close") : t("addReview")}
          </button>
        )}
      </div>

      {submitted ? (
        <div role="status" className="mt-5 flex items-start gap-3 rounded-2xl border border-border bg-background px-4 py-4">
          <LuCircleCheck aria-hidden className="mt-0.5 size-6 shrink-0 text-primary" />
          <p className="text-sm font-semibold text-heading">{t("reviewThanks")}</p>
        </div>
      ) : null}
      {writing && !submitted ? (
        <form id="review-form" noValidate onSubmit={formik.handleSubmit} className="mt-5 space-y-4 rounded-2xl border border-border bg-background p-4 sm:p-5">
          <h3 className="text-lg font-bold tracking-tight text-heading">{t("addReview")}</h3>
          <p className="text-sm text-muted">{t("emailNotice")}</p>
          <fieldset>
            <legend className="text-sm font-semibold text-heading">
              {t("yourRating")}
              <RequiredMark />
            </legend>
            <div
              className="mt-2 flex items-center gap-1"
              role="radiogroup"
              aria-label={t("yourRating")}
              aria-invalid={Boolean(fieldError("rating"))}
              onMouseLeave={() => setHovered(0)}
            >
              {ratings.map((value) => {
                const selected = value <= shownRating;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={formik.values.rating === value}
                    aria-label={t("star", { count: value })}
                    onMouseEnter={() => setHovered(value)}
                    onFocus={() => setHovered(value)}
                    onBlur={() => setHovered(0)}
                    onClick={() => {
                      formik.setFieldValue("rating", value);
                      formik.setFieldTouched("rating", true, false);
                    }}
                    className="inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <LuStar aria-hidden className={`size-6 ${selected ? "fill-amber-400 text-amber-400" : "text-border"}`} />
                  </button>
                );
              })}
              {shownRating > 0 ? <span className="ms-2 text-sm font-medium text-muted">{t("star", { count: shownRating })}</span> : null}
            </div>
            {fieldError("rating") ? <p className="mt-1 text-xs font-medium text-primary">{fieldError("rating")}</p> : null}
          </fieldset>

          <label className="block text-sm font-semibold text-heading">
            {t("yourReview")}
            <RequiredMark />
            <textarea
              name="text"
              rows={5}
              value={formik.values.text}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(fieldError("text"))}
              className={`${fieldClassName} min-h-32 resize-y py-3`}
            />
            {fieldError("text") ? <p className="mt-1.5 text-xs font-medium text-primary">{fieldError("text")}</p> : null}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-heading">
              {t("name")}
              <RequiredMark />
              <input
                name="name"
                type="text"
                autoComplete="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(fieldError("name"))}
                className={`${fieldClassName} h-12`}
              />
              {fieldError("name") ? <p className="mt-1.5 text-xs font-medium text-primary">{fieldError("name")}</p> : null}
            </label>

            <label className="block text-sm font-semibold text-heading">
              {t("email")}
              <RequiredMark />
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(fieldError("email"))}
                className={`${fieldClassName} h-12`}
              />
              {fieldError("email") ? <p className="mt-1.5 text-xs font-medium text-primary">{fieldError("email")}</p> : null}
            </label>
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70 sm:w-auto"
          >
            {t("submit")}
          </button>
        </form>
      ) : null}

      {hasReviews ? (
        <ul className="mt-5 space-y-3">
          {reviews.map((review) => {
            const when = reviewDate(review.createdAt, locale);
            const initial = review.name.trim().charAt(0).toUpperCase();
            return (
              <li key={review._id} className="flex gap-3 rounded-2xl border border-border bg-background p-4">
                <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                  {initial}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-heading">{review.name}</p>
                    {when ? (
                      <time dateTime={review.createdAt} className="shrink-0 text-xs text-muted">
                        {when}
                      </time>
                    ) : null}
                  </div>
                  <ReviewStars rating={review.rating} label={t("star", { count: review.rating })} />
                  <p className="mt-2 text-sm leading-6 text-foreground">{review.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
