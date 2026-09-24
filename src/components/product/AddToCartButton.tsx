"use client";

import { useTranslations } from "next-intl";
import { LuShoppingCart } from "react-icons/lu";

type AddToCartButtonProps = {
  slug: string;
  name: string;
  variant?: "card" | "product";
  disabled?: boolean;
  describedBy?: string;
  className?: string;
  onAdd?: () => void;
};

export default function AddToCartButton({
  slug,
  name,
  variant = "card",
  disabled = false,
  describedBy,
  className = "",
  onAdd,
}: AddToCartButtonProps) {
  const t = useTranslations(variant === "product" ? "ProductPage" : "ProductCard");

  function handleClick() {
    if (disabled) {
      return;
    }

    if (onAdd) {
      onAdd();
      return;
    }

    console.log("Add to cart", { slug, name });
  }

  const iconClass = variant === "product" ? "size-4 shrink-0" : "size-3.5 shrink-0 sm:size-4";
  const buttonClass =
    variant === "product"
      ? "inline-flex h-11 w-full min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50 @min-[30rem]:w-auto @min-[30rem]:gap-2 @min-[30rem]:px-5"
      : "inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:gap-2 sm:px-4 sm:text-sm";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-describedby={describedBy}
      className={`${buttonClass} ${className}`}
    >
      <LuShoppingCart aria-hidden className={iconClass} />
      {t("addToCart")}
    </button>
  );
}
