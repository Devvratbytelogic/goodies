"use client";

import { useTranslations } from "next-intl";
import { LuShoppingCart } from "react-icons/lu";

type AddToCartButtonProps = {
  slug: string;
  name: string;
};

export default function AddToCartButton({ slug, name }: AddToCartButtonProps) {
  const t = useTranslations("ProductCard");

  function handleClick() {
    console.log("Add to cart", { slug, name });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:gap-2 sm:px-4 sm:text-sm"
    >
      <LuShoppingCart aria-hidden className="size-3.5 shrink-0 sm:size-4" />
      {t("addToCart")}
    </button>
  );
}
