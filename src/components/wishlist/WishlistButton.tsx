"use client";

import type { MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { LuHeart } from "react-icons/lu";

type WishlistButtonProps = {
  slug: string;
  name: string;
  className?: string;
};

export default function WishlistButton({ slug, name, className = "" }: WishlistButtonProps) {
  const t = useTranslations("Wishlist");

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    console.log("Wishlist", { slug, name });
  }

  return (
    <button
      type="button"
      aria-label={t("add", { name })}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={handleClick}
      className={`inline-flex size-8 items-center justify-center rounded-full bg-background/95 text-muted shadow-sm ring-1 ring-border/50 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
    >
      <LuHeart aria-hidden className="size-4" />
    </button>
  );
}
