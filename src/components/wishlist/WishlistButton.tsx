"use client";

import type { MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { LuHeart } from "react-icons/lu";
import { useAddToWishlistMutation, useGetWishlistQuery, useRemoveFromWishlistMutation } from "@/store/endpoints/wishlistApi";

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
  const { data } = useGetWishlistQuery();
  const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();
  const isLoading = isAdding || isRemoving;
  const saved = (data ?? []).some(
    (item) => item.product_id?._id === payload.product_id && (item.variant_sku ?? "") === payload.variant_sku,
  );
  const label = saved
    ? name
      ? t("remove", { name })
      : t("removeLabel")
    : name
      ? t("add", { name })
      : t("label");

  async function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (isLoading) return;

    try {
      if (saved) {
        await removeFromWishlist(payload).unwrap();
      } else {
        await addToWishlist(payload).unwrap();
      }
    } catch (error) {
      console.error("wishlist update failed", error);
    }
  }

  const shared = {
    type: "button" as const,
    "aria-label": label,
    "aria-pressed": saved,
    disabled: isLoading,
    onPointerDown: (event: MouseEvent<HTMLButtonElement>) => event.stopPropagation(),
    onClick: handleClick,
  };

  if (variant === "text") {
    return (
      <button
        {...shared}
        className={`inline-flex items-center gap-2.5 text-sm font-medium text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      >
        <LuHeart aria-hidden className={`size-5 ${saved ? "fill-current" : ""}`} />
        {saved ? t("removeLabel") : t("label")}
      </button>
    );
  }

  return (
    <button
      {...shared}
      className={`inline-flex size-8 items-center justify-center rounded-full bg-background/95 shadow-sm ring-1 ring-border/50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${saved ? "text-primary" : "text-muted hover:text-primary"} ${className}`}
    >
      <LuHeart aria-hidden className={`size-4 ${saved ? "fill-current" : ""}`} />
    </button>
  );
}
