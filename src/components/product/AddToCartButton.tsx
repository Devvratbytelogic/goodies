"use client";

import { useTranslations } from "next-intl";
import { LuShoppingBag, LuShoppingCart } from "react-icons/lu";
import { useAddToCartMutation } from "@/store/endpoints/cartApi";
import { useRouter } from "@/i18n/navigation";
import { getCheckoutClassicRoutePath } from "@/utils/routes";

type AddToCartButtonProps = {
  variant?: "card" | "product";
  action?: "cart" | "buy";
  disabled?: boolean;
  describedBy?: string;
  className?: string;
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
  payload,
}: AddToCartButtonProps) {
  const isBuy = action === "buy";
  const t = useTranslations(variant === "product" ? "ProductPage" : "ProductCard");
  const router = useRouter();
  const [addToCart, { isLoading }] = useAddToCartMutation();

  async function handleClick() {
    if (disabled || isLoading) return;

    try {
      const response = await addToCart(payload);
      // console.log('response -->', response);

      if (response.data) {
        if (isBuy) router.push(getCheckoutClassicRoutePath());
      }
    } catch (error) {
      console.log("Error adding to cart", error);
    }
  }

  const iconClass = variant === "product" ? "size-4 shrink-0" : "size-3.5 shrink-0 sm:size-4";
  const buttonClass = isBuy
    ? "inline-flex h-11 w-full min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 @min-[30rem]:w-auto @min-[30rem]:gap-2 @min-[30rem]:px-5"
    : variant === "product"
      ? "inline-flex h-11 w-full min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50 @min-[30rem]:w-auto @min-[30rem]:gap-2 @min-[30rem]:px-5"
      : "inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:gap-2 sm:px-4 sm:text-sm";

  const Icon = isBuy ? LuShoppingBag : LuShoppingCart;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isLoading}
      aria-describedby={describedBy}
      className={`${buttonClass} ${className} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <Icon aria-hidden className={iconClass} />
      {isBuy ? t("buyNow") : t("addToCart")}
    </button>
  );
}
