"use client";

import type { MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { LuHeart } from "react-icons/lu";
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from "@/store/endpoints/wishlistApi";

type WishlistButtonProps = {
  name?: string;
  payload: {
    product_id: string;
    variant_sku: string;
  };
  variant?: "icon" | "text";
  className?: string;
};

export default function WishlistButton({
  name = "",
  payload,
  variant = "icon",
  className = "",
}: WishlistButtonProps) {
  const t = useTranslations("Wishlist");
  const [addToWishlist, { isLoading }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();  

  async function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    try {
      const response = await addToWishlist(payload);
      if (response.data) {

      }
    } catch (error) {
      console.log('error during add to wishlist', error);
    }
  }

  const shared = {
    type: "button" as const,
    "aria-label": name ? t("add", { name }) : t("label"),
    onPointerDown: (event: MouseEvent<HTMLButtonElement>) => event.stopPropagation(),
    onClick: handleClick,
  };

  if (variant === "text") {
    return (
      <button
        {...shared}
        disabled={isLoading}
        className={`inline-flex items-center gap-2.5 text-sm font-medium text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <LuHeart aria-hidden className="size-5" />
        {t("label")}
      </button>
    );
  }

  return (
    <button
      {...shared}
      disabled={isLoading}
      className={`inline-flex size-8 items-center justify-center rounded-full bg-background/95 text-muted shadow-sm ring-1 ring-border/50 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <LuHeart aria-hidden className="size-4" />
    </button>
  );
}
