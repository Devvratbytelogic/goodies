"use client";

import { useTranslations } from "next-intl";
import { LuShoppingCart } from "react-icons/lu";
import { useCartDrawer } from "@/components/cart/CartDrawerProvider";
import { useCartCount } from "@/store/endpoints/cartApi";

const actionClass =
  "relative flex size-10 items-center justify-center rounded-full text-accent-deep transition-colors hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

function CountBadge({ count }: { count: number }) {
  return (
    <span
      aria-hidden
      className="absolute -top-0.5 inset-e-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold leading-none text-primary-foreground ring-2 ring-background"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function MiniCart({ className = "" }: { className?: string }) {
  const header = useTranslations("Header");
  const { open, openCart } = useCartDrawer();
  const count = useCartCount();

  return (
    <button
      type="button"
      aria-label={header("cartLabel", { count })}
      aria-expanded={open}
      aria-controls="cart-drawer"
      onClick={openCart}
      className={`${actionClass} ${className} ${open ? "bg-primary-soft text-primary" : ""}`}
    >
      <LuShoppingCart aria-hidden className="size-5.5" />
      <CountBadge count={count} />
    </button>
  );
}
