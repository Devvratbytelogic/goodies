"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { LuMinus, LuPlus, LuShoppingBag, LuTrash2, LuX } from "react-icons/lu";
import CheckoutAuth from "@/components/auth/CheckoutAuth";
import { useCartDrawer } from "@/components/cart/CartDrawerProvider";
import RemoveCartItemConfirm from "@/components/cart/RemoveCartItemConfirm";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { useModal } from "@/components/layout/common/ModalProvider";
import { Link } from "@/i18n/navigation";
import type { CartItem } from "@/server/types/cart";
import { useGetCartQuery, useUpdateCartItemQuantityMutation } from "@/store/endpoints/cartApi";
import { formatAmount } from "@/utils/price";
import { getProductRoutePath, getShopRoutePath } from "@/utils/routes";

const minQuantity = 1;
const maxQuantity = 99;
const drawerId = "cart-drawer";

function itemSize(item: CartItem) {
  return item.selected_size || item.selected_variant?.size || item.selected_attributes?.size || "";
}

function itemColor(item: CartItem) {
  return item.selected_variant?.color || "";
}

export default function CartDrawer() {
  const t = useTranslations("MiniCart");
  const cartText = useTranslations("CartPage");
  const { open, closeCart, checkoutOpen, openCheckout, closeCheckout } = useCartDrawer();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { data: cart, isLoading } = useGetCartQuery();
  const [updateQuantity, { isLoading: isUpdatingQuantity }] = useUpdateCartItemQuantityMutation();
  const { openModal } = useModal();

  const items = cart?.items ?? [];
  const symbol = cart?.summary?.currency_symbol ?? "";
  const estimatedTotal = cart?.summary?.subtotal ?? 0;

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeCart();
    }

    document.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closeCart]);

  function removeItem(itemId: string, name: string) {
    openModal({
      title: cartText("removeTitle"),
      size: "sm",
      content: <RemoveCartItemConfirm itemId={itemId} name={name} />,
    });
  }

  async function changeQuantity(itemId: string, quantity: number) {
    try {
      await updateQuantity({ itemId, quantity }).unwrap();
    } catch (error) {
      console.error("Error updating quantity", error);
    }
  }

  return (
    <>
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-60 bg-black/40 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
      />

      <div
        aria-hidden={!open}
        className={`fixed inset-y-0 inset-e-0 z-70 w-[min(26.5rem,100vw)] overflow-hidden ${open ? "" : "pointer-events-none"}`}
      >
        <div
          id={drawerId}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
          inert={open ? undefined : true}
          className={`flex h-full flex-col border-s border-border/40 bg-background shadow-none transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none ${
            open
              ? "translate-x-0 shadow-[-4px_0_24px_-4px_rgb(0_0_0/0.18)] rtl:shadow-[4px_0_24px_-4px_rgb(0_0_0/0.18)]"
              : "translate-x-full shadow-none rtl:-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between gap-4 border-b border-border/40 px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))]">
            <h2 id="cart-drawer-title" className="text-xl font-bold tracking-tight text-heading">
              {t("title")}
            </h2>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeCart}
              aria-label={t("close")}
              className="-me-2 inline-flex size-10 shrink-0 items-center justify-center rounded-full text-heading transition-colors hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <LuX aria-hidden className="size-5" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex-1 px-5 py-8 text-center text-sm text-muted" aria-busy="true">
              {cartText("loading")}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-5 py-10 text-center">
              <span className="inline-flex size-16 items-center justify-center rounded-full bg-primary-soft text-primary">
                <LuShoppingBag aria-hidden className="size-7" />
              </span>
              <p className="mt-5 text-lg font-bold tracking-tight text-heading">{cartText("empty")}</p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-muted">{cartText("emptyNote")}</p>
              <Link
                href={getShopRoutePath()}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {cartText("shop")}
              </Link>
            </div>
          ) : (
            <>
              <ul className="min-h-0 flex-1 divide-y divide-border overflow-y-auto overscroll-contain px-5">
                {items.map((item) => {
                  const name = item.product_id?.title ?? "";
                  const quantity = item.quantity ?? 1;
                  const isBundle = item.product_type === "bundle";
                  const bundleSelections = isBundle ? (item.bundle_selections ?? []) : [];
                  const stock = isBundle ? item.product_id?.stock : item.selected_variant?.stock;
                  const itemMaxQuantity = Math.min(maxQuantity, stock ?? maxQuantity);
                  const unitPrice = item.selected_variant?.price ?? item.single_price;
                  const lineTotal = unitPrice * quantity;
                  const size = itemSize(item);
                  const color = itemColor(item);

                  return (
                    <li key={item._id} className="flex gap-3 py-4">
                      <Link
                        href={getProductRoutePath(item.product_id?.slug ?? "")}
                        aria-label={name}
                        className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-border/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <ImageComponent
                          src={item.product_id?.thumbnail ?? "/images/image-fallback.svg"}
                          alt=""
                          width={160}
                          height={160}
                          sizes="80px"
                          objectFit="cover"
                        />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link
                              href={getProductRoutePath(item.product_id?.slug ?? "")}
                              className="line-clamp-2 font-semibold text-heading hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                              {name}
                            </Link>
                            <p className="mt-1 text-sm text-muted">{formatAmount(unitPrice, item.product_id?.pricing_context?.currency_symbol || symbol)}</p>
                            {color ? <p className="mt-1 text-xs text-muted">{t("color", { value: color })}</p> : null}
                            {size ? <p className={`text-xs text-muted ${color ? "mt-0.5" : "mt-1"}`}>{t("size", { value: size })}</p> : null}
                            {bundleSelections.length > 0 ? (
                              <div className="mt-2">
                                <p className="text-xs font-semibold text-heading">{cartText("bundleContains")}</p>
                                <ul className="mt-1 space-y-0.5 text-xs text-muted">
                                  {bundleSelections.map((selection, selectionIndex) => (
                                    <li key={selection?._id ?? selectionIndex}>
                                      <span className="font-semibold text-heading">{selection?.quantity} ×</span>{" "}
                                      <Link
                                        href={getProductRoutePath(selection?.product_id?.slug ?? "")}
                                        className="underline-offset-2 hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                      >
                                        {selection?.product_id?.title}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : null}
                          </div>
                          <p className="shrink-0 text-sm font-semibold tabular-nums text-price">{formatAmount(lineTotal, symbol)}</p>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <div className="inline-flex h-9 items-center rounded-full border border-border bg-background">
                            <button
                              type="button"
                              aria-label={cartText("decrease", { name })}
                              disabled={isUpdatingQuantity || quantity <= minQuantity}
                              onClick={() => changeQuantity(item._id, quantity - 1)}
                              className="inline-flex size-9 items-center justify-center rounded-full text-heading transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:text-border"
                            >
                              <LuMinus aria-hidden className="size-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold tabular-nums text-heading" aria-hidden>
                              {quantity}
                            </span>
                            <span className="sr-only">
                              {cartText("quantity")} {quantity}
                            </span>
                            <button
                              type="button"
                              aria-label={cartText("increase", { name })}
                              disabled={isUpdatingQuantity || quantity >= itemMaxQuantity}
                              onClick={() => changeQuantity(item._id, quantity + 1)}
                              className="inline-flex size-9 items-center justify-center rounded-full text-heading transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:text-border"
                            >
                              <LuPlus aria-hidden className="size-3.5" />
                            </button>
                          </div>
                          <button
                            type="button"
                            aria-label={cartText("remove", { name })}
                            onClick={() => removeItem(item._id, name)}
                            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          >
                            <LuTrash2 aria-hidden className="size-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-border px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <p className="flex items-center justify-between gap-3">
                  <span className="text-base font-semibold text-heading">{t("estimatedTotal")}</span>
                  <span className="text-base font-bold tabular-nums text-heading">{formatAmount(estimatedTotal, symbol)}</span>
                </p>
                <p className="mt-1 text-xs leading-5 text-muted">{t("estimatedNote")}</p>
                <button
                  type="button"
                  onClick={openCheckout}
                  className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {cartText("checkout")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {checkoutOpen ? <CheckoutAuth onClose={closeCheckout} /> : null}
    </>
  );
}
