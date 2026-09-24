"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { LuStar } from "react-icons/lu";

type ProductTabsProps = {
  name: string;
  sizeSummary?: string;
};

const ratings = [1, 2, 3, 4, 5] as const;

export default function ProductTabs({ name, sizeSummary }: ProductTabsProps) {
  const t = useTranslations("ProductPage");
  const [tab, setTab] = useState<"details" | "reviews">("details");
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [ratingMissing, setRatingMissing] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating < 1) {
      setRatingMissing(true);
      return;
    }

    const form = new FormData(event.currentTarget);
    console.log("Review", {
      name: form.get("name"),
      email: form.get("email"),
      review: form.get("review"),
      rating,
    });
    setSubmitted(true);
    setRatingMissing(false);
  }

  const tabClass = (selected: boolean) =>
    `-mt-px border-t-[3px] py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
      selected
        ? "rounded-b-md border-primary bg-accent px-5 font-bold text-white"
        : "border-transparent px-1 font-semibold text-[#333333]"
    }`;

  return (
    <div className="mt-10">
      <div className="border-t border-border">
        <div role="tablist" aria-label={t("productDetails")} className="flex flex-wrap items-start gap-x-6">
          <button
            type="button"
            role="tab"
            id="tab-details"
            aria-selected={tab === "details"}
            aria-controls="panel-details"
            tabIndex={tab === "details" ? 0 : -1}
            onClick={() => setTab("details")}
            className={tabClass(tab === "details")}
          >
            {t("additionalInformation")}
          </button>
          <button
            type="button"
            role="tab"
            id="tab-reviews"
            aria-selected={tab === "reviews"}
            aria-controls="panel-reviews"
            tabIndex={tab === "reviews" ? 0 : -1}
            onClick={() => setTab("reviews")}
            className={tabClass(tab === "reviews")}
          >
            {t("reviews", { count: 0 })}
          </button>
        </div>
      </div>

      <div
        role="tabpanel"
        id="panel-details"
        aria-labelledby="tab-details"
        hidden={tab !== "details"}
        className="pt-4"
      >
        <table className="w-full border-collapse text-sm" aria-label={t("productDetails")}>
          <tbody>
            <tr>
              <th
                scope="row"
                className="w-36 border border-border px-4 py-3 text-start font-medium text-secondary-heading sm:w-44"
              >
                {t("weight")}
              </th>
              <td className="border border-border px-4 py-3 text-foreground">{t("weightValue")}</td>
            </tr>
            {sizeSummary ? (
              <tr>
                <th
                  scope="row"
                  className="border border-border px-4 py-3 text-start font-medium text-secondary-heading"
                >
                  {t("size")}
                </th>
                <td className="border border-border px-4 py-3 text-foreground">{sizeSummary}</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div
        role="tabpanel"
        id="panel-reviews"
        aria-labelledby="tab-reviews"
        hidden={tab !== "reviews"}
        className="max-w-2xl pt-6"
      >
        <p className="text-sm text-foreground">{t("noReviews")}</p>
        <h3 className="mt-6 text-lg font-semibold text-heading">{t("beFirst", { name })}</h3>
        <p className="mt-2 text-sm text-muted">{t("emailNotice")}</p>

        {submitted ? (
          <p className="mt-4 text-sm font-medium text-accent" role="status">
            {t("reviewThanks")}
          </p>
        ) : (
          <form noValidate onSubmit={onSubmit} className="mt-5 space-y-4">
            <fieldset>
              <legend className="text-sm font-semibold text-heading">
                {t("yourRating")}
                <span aria-hidden className="text-primary">
                  {" *"}
                </span>
              </legend>
              <div className="mt-2 flex gap-1" role="radiogroup" aria-label={t("yourRating")}>
                {ratings.map((value) => {
                  const selected = value <= rating;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={rating === value}
                      aria-label={t("star", { count: value })}
                      onClick={() => {
                        setRating(value);
                        setRatingMissing(false);
                      }}
                      className="inline-flex size-8 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <LuStar
                        aria-hidden
                        className={`size-5 ${selected ? "fill-amber-400 text-amber-400" : "text-border"}`}
                      />
                    </button>
                  );
                })}
              </div>
              {ratingMissing ? <p className="mt-1 text-xs font-medium text-primary">{t("required")}</p> : null}
            </fieldset>

            <label className="block text-sm font-semibold text-heading">
              {t("yourReview")}
              <span aria-hidden className="text-primary">
                {" *"}
              </span>
              <textarea
                name="review"
                required
                rows={5}
                className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm font-normal text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
            </label>

            <label className="block text-sm font-semibold text-heading">
              {t("name")}
              <span aria-hidden className="text-primary">
                {" *"}
              </span>
              <input
                name="name"
                type="text"
                required
                autoComplete="name"
                className="mt-1 h-11 w-full border border-border bg-background px-3 text-sm font-normal text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
            </label>

            <label className="block text-sm font-semibold text-heading">
              {t("email")}
              <span aria-hidden className="text-primary">
                {" *"}
              </span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1 h-11 w-full border border-border bg-background px-3 text-sm font-normal text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
            </label>

            <label className="flex items-start gap-2 text-sm font-normal text-foreground">
              <input name="save" type="checkbox" className="mt-1 accent-primary" />
              {t("saveDetails")}
            </label>

            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-8 text-sm font-medium text-white hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t("submit")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
