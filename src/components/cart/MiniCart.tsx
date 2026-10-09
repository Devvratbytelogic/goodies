"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LuShoppingBag, LuShoppingCart, LuTrash2 } from "react-icons/lu";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { Link, usePathname } from "@/i18n/navigation";
import { useGetCartQuery, useRemoveFromCartMutation } from "@/store/endpoints/cartApi";
import { formatAmount } from "@/utils/price";
import { getCartRoutePath, getCheckoutClassicRoutePath, getProductRoutePath, getShopRoutePath } from "@/utils/routes";

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
  const t = useTranslations("MiniCart");
  const cartText = useTranslations("CartPage");
  const header = useTranslations("Header");
  const pathname = usePathname();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [renderedPathname, setRenderedPathname] = useState(pathname);
  const { data: cart, isLoading } = useGetCartQuery();
  const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();

  const items = cart?.items ?? [];
  const count = items.reduce((total, item) => total + (item?.quantity ?? 0), 0);
  const symbol = cart?.summary?.currency_symbol ?? "";

  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function removeItem(itemId: string) {
    try {
      await removeFromCart(itemId).unwrap();
    } catch (error) {
      console.error("Error removing cart item", error);
    }
  }

  return (
    <div
      ref={rootRef}
      className={`relative ${className}`}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setOpen(false);
      }}
    >
      <Link
        href={getCartRoutePath()}
        aria-label={header("cartLabel", { count })}
        aria-expanded={open}
        aria-controls={panelId}
        className={`${actionClass} ${open ? "bg-primary-soft text-primary" : ""}`}
      >
        <LuShoppingCart aria-hidden className="size-5.5" />
        <CountBadge count={count} />
      </Link>

      {open ? (
        <div className="absolute inset-e-0 top-full z-50 w-[min(22rem,calc(100vw-2rem))] pt-2">
          <div
            id={panelId}
            className="overflow-hidden rounded-2xl border border-border bg-background shadow-lg"
          >
          <p className="border-b border-border px-4 py-3 text-sm font-semibold text-heading">{t("title")}</p>

          {isLoading ? (
            <p className="px-4 py-8 text-center text-sm text-muted">{cartText("loading")}</p>
          ) : items.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                <LuShoppingBag aria-hidden className="size-5" />
              </span>
              <p className="mt-3 text-sm font-semibold text-heading">{cartText("empty")}</p>
              <Link
                href={getShopRoutePath()}
                className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {cartText("shop")}
              </Link>
            </div>
          ) : (
            <>
              <ul className="max-h-80 divide-y divide-border overflow-y-auto">
                {items.map((item) => {
                  const name = item.product_id?.title ?? "";
                  return (
                    <li key={item._id} className="flex gap-3 px-4 py-3">
                      <Link
                        href={getProductRoutePath(item.product_id?.slug ?? "")}
                        className="group flex min-w-0 flex-1 gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-border/70">
                          <ImageComponent
                            src={item.product_id?.thumbnail ?? "/images/image-fallback.svg"}
                            alt=""
                            width={112}
                            height={112}
                            sizes="56px"
                            objectFit="cover"
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="line-clamp-2 text-sm font-semibold text-heading group-hover:text-primary">{name}</span>
                          <span className="mt-1 block text-xs text-muted">{cartText("itemQty", { count: item.quantity })}</span>
                          <span className="mt-0.5 block text-sm font-semibold text-price">{formatAmount(item.total, symbol)}</span>
                        </span>
                      </Link>
                      <button
                        type="button"
                        aria-label={cartText("remove", { name })}
                        disabled={isRemoving}
                        onClick={() => removeItem(item._id)}
                        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <LuTrash2 aria-hidden className="size-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-border px-4 py-3">
                <p className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted">{cartText("subtotal")}</span>
                  <span className="font-semibold text-heading">{formatAmount(cart?.summary?.subtotal ?? 0, symbol)}</span>
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <Link
                    href={getCheckoutClassicRoutePath()}
                    className="inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {cartText("checkout")}
                  </Link>
                  <Link
                    href={getCartRoutePath()}
                    className="inline-flex h-11 w-full items-center justify-center rounded-full border border-border px-4 text-sm font-semibold text-heading transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {t("viewCart")}
                  </Link>
                </div>
              </div>
            </>
          )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
