"use client";

import { useTranslations } from "next-intl";
import { LuShoppingBag } from "react-icons/lu";

type BuyNowButtonProps = {
  disabled?: boolean;
  describedBy?: string;
  className?: string;
  onBuy: () => void;
};

export default function BuyNowButton({
  disabled = false,
  describedBy,
  className = "",
  onBuy,
}: BuyNowButtonProps) {
  const t = useTranslations("ProductPage");

  return (
    <button
      type="button"
      onClick={onBuy}
      disabled={disabled}
      aria-describedby={describedBy}
      className={`inline-flex h-11 w-full min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 @min-[30rem]:w-auto @min-[30rem]:gap-2 @min-[30rem]:px-5 ${className}`}
    >
      <LuShoppingBag aria-hidden className="size-4 shrink-0" />
      {t("buyNow")}
    </button>
  );
}
