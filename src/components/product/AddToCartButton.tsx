"use client";

import { useTranslations } from "next-intl";
import { LuLoaderCircle, LuShoppingBag, LuShoppingCart } from "react-icons/lu";
import { useCartDrawer } from "@/components/cart/CartDrawerProvider";
import { useAddToCartMutation, useGetCartQuery } from "@/store/endpoints/cartApi";

type AddToCartButtonProps = {
  variant?: "card" | "product";
  action?: "cart" | "buy";
  disabled?: boolean;
  describedBy?: string;
  className?: string;
  compact?: boolean;
  payload?: {
    product_id: string;
    quantity: number;
    variant_sku?: string;
    bundle_selections?: { product_id: string; variant_sku?: string; quantity: number }[];
  };
};

export default function AddToCartButton({
  variant = "card",
  action = "cart",
  disabled = false,
  describedBy,
  className = "",
  compact = false,
  payload,
}: AddToCartButtonProps) {
  const isBuy = action === "buy";
  const t = useTranslations(variant === "product" ? "ProductPage" : "ProductCard");
  const { openCart, openCheckout } = useCartDrawer();
  const { data: cart } = useGetCartQuery();
  const [addToCart, { isLoading }] = useAddToCartMutation();

  const existing = (cart?.items ?? []).find(
    (item) =>
      item.product_id?._id === payload?.product_id &&
      (item.variant_sku ?? "") === (payload?.variant_sku ?? ""),
  );

  async function handleClick() {
    if (disabled || isLoading || !payload) return;

    try {
      const response = await addToCart(payload);
      if (!response.data) return;
      if (isBuy) openCheckout();
      else openCart();
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  }

  const iconClass =
    variant === "product"
      ? compact
        ? "size-3.5 shrink-0 lg:size-4"
        : "size-4 shrink-0"
      : "size-3.5 shrink-0 sm:size-4";
  const productButton = isBuy
    ? "bg-primary hover:bg-primary-hover focus-visible:outline-primary"
    : "bg-accent hover:bg-accent-hover focus-visible:outline-accent";
  const buttonClass = variant === "product"
    ? compact
      ? `inline-flex h-10 w-full min-w-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full px-2 text-xs font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 @max-[22rem]:px-1 lg:h-11 lg:w-auto lg:gap-2 lg:px-5 lg:text-sm ${productButton}`
      : `inline-flex h-11 w-full min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 @min-[30rem]:w-auto @min-[30rem]:gap-2 @min-[30rem]:px-5 ${productButton}`
    : "inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:gap-2 sm:px-4 sm:text-sm";

  const Icon = isLoading ? LuLoaderCircle : isBuy ? LuShoppingBag : LuShoppingCart;
  const label = isBuy
    ? t("buyNow")
    : existing
      ? t("inCart", { count: existing.quantity })
      : t("addToCart");

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isLoading}
      aria-describedby={describedBy}
      aria-busy={isLoading}
      className={`${buttonClass} ${className}`}
    >
      <Icon aria-hidden className={`${iconClass} ${isLoading ? "animate-spin" : ""}`} />
      <span className={compact ? "min-w-0 truncate" : undefined}>{label}</span>
    </button>
  );
}
