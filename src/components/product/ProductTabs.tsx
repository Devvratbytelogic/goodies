"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ProductReview from "@/components/product/ProductReview";
import type { ReviewsEntity } from "@/server/types/singleProduct";

type ProductTabsProps = {
  description?: string;
  customNotes?: string;
  productId: string;
  name: string;
  weight?: number | null;
  size?: string | null;
  reviews: ReviewsEntity[];
  averageRating: number;
  totalReviews: number;
};

export default function ProductTabs({ description = "", customNotes = "", productId, name, weight, size, reviews, averageRating, totalReviews }: ProductTabsProps) {
  const t = useTranslations("ProductPage");
  const [tab, setTab] = useState<"details" | "reviews">("details");

  const tabClass = (selected: boolean) =>
    `-mt-px border-t-[3px] py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${selected
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
            {t("reviews", { count: totalReviews })}
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
        {description ? <div className="category-description mb-4" dangerouslySetInnerHTML={{ __html: description }} /> : null}
        <table className="w-full border-collapse text-sm" aria-label={t("productDetails")}>
          <tbody>
            <tr>
              <th
                scope="row"
                className="w-36 border border-border px-4 py-3 text-start font-medium text-secondary-heading sm:w-44"
              >
                {t("weight")}
              </th>
              <td className="border border-border px-4 py-3 text-foreground">
                {weight && weight > 0 ? `${Math.round(weight * 1000) / 1000} kg` : '-'}
              </td>
            </tr>
            {size ? (
              <tr>
                <th
                  scope="row"
                  className="border border-border px-4 py-3 text-start font-medium text-secondary-heading"
                >
                  {t("size")}
                </th>
                <td className="border border-border px-4 py-3 text-foreground capitalize">{size}</td>
              </tr>
            ) : null}
            {customNotes ? (
              <tr>
                <th scope="row" className="border border-border px-4 py-3 text-start font-medium text-secondary-heading">
                  {t("customNotes")}
                </th>
                <td className="border border-border px-4 py-3 text-foreground">
                  <div className="category-description" dangerouslySetInnerHTML={{ __html: customNotes }} />
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div role="tabpanel" id="panel-reviews" aria-labelledby="tab-reviews" hidden={tab !== "reviews"}>
        <ProductReview
          productId={productId}
          name={name}
          reviews={reviews}
          averageRating={averageRating}
          totalReviews={totalReviews}
        />
      </div>
    </div>
  );
}
