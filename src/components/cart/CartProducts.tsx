"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useGetCartProductsQuery } from "@/store/endpoints/cartApi";

const ProductSlider = dynamic(() => import("@/components/product/ProductSlider"));

export default function CartProducts() {
  const t = useTranslations("CartPage");
  const { data: products, isLoading, isError } = useGetCartProductsQuery();

  if (isError || (!isLoading && !products?.length)) return null;

  if (isLoading || !products) {
    return (
      <section className="container section_y_space" aria-busy="true" aria-label={t("loading")}>
        <div className="h-7 w-48 animate-pulse rounded bg-surface" />
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="aspect-3/4 animate-pulse rounded-2xl bg-surface" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <ProductSlider
      id="cart-products"
      title={t("suggested")}
      seeAllLabel={t("suggestedSeeAll")}
      previousLabel={t("suggestedPrevious")}
      nextLabel={t("suggestedNext")}
      products={products}
    />
  );
}
