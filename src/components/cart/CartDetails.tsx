"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LuMinus, LuPlus, LuTrash2 } from "react-icons/lu";
import CartSummary from "@/components/cart/CartSummary";
import RemoveCartItemConfirm from "@/components/cart/RemoveCartItemConfirm";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { useModal } from "@/components/layout/common/ModalProvider";
import { Link } from "@/i18n/navigation";
import { getProductRoutePath, getShopRoutePath } from "@/utils/routes";
import { useGetCartQuery, useUpdateCartItemQuantityMutation } from "@/store/endpoints/cartApi";
import { formatAmount } from "@/utils/price";

const minQuantity = 1;
const maxQuantity = 99;



type CartDetailsProps = {
  checkoutHref: string;
};

export default function CartDetails({ checkoutHref }: CartDetailsProps) {
  const t = useTranslations("CartPage");
  const { data: cart, isLoading: isLoadingCart } = useGetCartQuery();
  const [updateQuantity, { isLoading: isUpdatingQuantity }] = useUpdateCartItemQuantityMutation();
  const cartItems = cart?.items ?? [];
  const cartSummary = cart?.summary ?? null;

  const { openModal } = useModal();

  const removeCartItem = (itemId: string, name: string) => {
    openModal({
      title: t("removeTitle"),
      size: "sm",
      content: <RemoveCartItemConfirm itemId={itemId} name={name} />,
    });
  };

  const updateCartItemQuantity = async (itemId: string, quantity: number) => {
    try {
      await updateQuantity({ itemId, quantity }).unwrap();
    } catch (error) {
      console.error('Error updating quantity', error);
    }
  };

  const currencySymbol = cartSummary?.currency_symbol ?? "";

  return (
    <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10">
      {cartItems?.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background px-6 py-12 text-center">
          <p className="text-muted">{t("empty")}</p>
          <Link
            href={getShopRoutePath()}
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("shop")}
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-background">
          {cartItems?.map((item, index) => {
            const quantity = item?.quantity;
            const isBundle = item?.product_type === "bundle";
            const bundleSelections = isBundle ? (item?.bundle_selections ?? []) : [];
            // bundle: bundle stock, others: selected variant stock
            const stock = isBundle ? item?.product_id?.stock : item?.selected_variant?.stock;
            const itemMaxQuantity = Math.min(maxQuantity, stock ?? maxQuantity);

            return (
              <li key={index} className="flex gap-4 p-4 sm:gap-5 sm:p-5">
                <Link
                  href={getProductRoutePath(item?.product_id?.slug)}
                  aria-label={item?.product_id?.title}
                  className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-border/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:size-24"
                >
                  <ImageComponent src={item?.product_id?.thumbnail} alt="" width={192} height={192} sizes="96px" objectFit="cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={getProductRoutePath(item?.product_id?.slug)}
                        className="font-semibold text-heading hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        {item?.product_id?.title}
                      </Link>
                      <p className="mt-1 text-sm text-muted">{formatAmount(item?.selected_variant?.price, item?.product_id?.pricing_context?.currency_symbol ?? "")}</p>
                      {bundleSelections.length > 0 ? (
                        <div className="mt-2">
                          <p className="text-xs font-semibold text-heading">{t("bundleContains")}</p>
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
                    <button
                      type="button"
                      aria-label={t("remove", { name: item?.product_id?.title })}
                      onClick={() => removeCartItem(item?._id, item?.product_id?.title)}
                      className="-me-1 -mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <LuTrash2 aria-hidden className="size-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="inline-flex h-9 items-center rounded-full border border-border bg-background">
                      <button
                        type="button"
                        aria-label={t("decrease", { name: item?.product_id?.title })}
                        disabled={isUpdatingQuantity || quantity <= minQuantity}
                        onClick={() => updateCartItemQuantity(item?._id, quantity - 1)}
                        className="inline-flex size-9 items-center justify-center rounded-full text-heading transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:text-border"
                      >
                        <LuMinus aria-hidden className="size-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold tabular-nums text-heading" aria-hidden>
                        {quantity}
                      </span>
                      <span className="sr-only">
                        {t("quantity")} {quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={t("increase", { name: item?.product_id?.title })}
                        disabled={isUpdatingQuantity || quantity >= itemMaxQuantity}
                        onClick={() => updateCartItemQuantity(item?._id, quantity + 1)}
                        className="inline-flex size-9 items-center justify-center rounded-full text-heading transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:text-border"
                      >
                        <LuPlus aria-hidden className="size-3.5" />
                      </button>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-price sm:text-base">{formatAmount(item?.selected_variant?.price * quantity, currencySymbol)}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <CartSummary checkoutHref={checkoutHref} />
    </div>
  );
}
