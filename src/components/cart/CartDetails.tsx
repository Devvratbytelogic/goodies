"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LuMinus, LuPlus, LuTrash2, LuX } from "react-icons/lu";
import CartCoupons, { quoteCoupon, type CartCoupon } from "@/components/cart/CartCoupons";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { Link } from "@/i18n/navigation";
import { getProductRoutePath, getShopRoutePath } from "@/utils/routes";

const minQuantity = 1;
const maxQuantity = 99;

export type CartLine = {
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type CartDetailsProps = {
  lines: CartLine[];
  shipping: number;
  checkoutHref: string;
};

function formatAmount(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function CartDetails({ lines, shipping, checkoutHref }: CartDetailsProps) {
  const t = useTranslations("CartPage");
  const cards = useTranslations("ProductCard");
  const [items, setItems] = useState(lines);
  const [quantities, setQuantities] = useState(() =>
    Object.fromEntries(lines.map((line) => [line.slug, line.quantity])),
  );
  const [appliedCoupon, setAppliedCoupon] = useState<CartCoupon | null>(null);

  function money(amount: number) {
    return cards("price", { amount: formatAmount(amount) });
  }

  function setQuantity(slug: string, next: number) {
    setQuantities((current) => ({
      ...current,
      [slug]: Math.min(maxQuantity, Math.max(minQuantity, next)),
    }));
  }

  function removeLine(slug: string) {
    setItems((current) => current.filter((line) => line.slug !== slug));
  }

  const subtotal = items.reduce((sum, line) => sum + line.price * (quantities[line.slug] ?? line.quantity), 0);
  const quote = quoteCoupon(items.length === 0 ? null : appliedCoupon, subtotal, shipping);

  return (
    <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10">
      {items.length === 0 ? (
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
          {items.map((line) => {
            const quantity = quantities[line.slug] ?? line.quantity;

            return (
              <li key={line.slug} className="flex gap-4 p-4 sm:gap-5 sm:p-5">
                <Link
                  href={getProductRoutePath(line.slug)}
                  aria-label={line.name}
                  className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-border/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:size-24"
                >
                  <ImageComponent src={line.image} alt="" width={192} height={192} sizes="96px" objectFit="cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={getProductRoutePath(line.slug)}
                        className="font-semibold text-heading hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        {line.name}
                      </Link>
                      <p className="mt-1 text-sm text-muted">{money(line.price)}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={t("remove", { name: line.name })}
                      onClick={() => removeLine(line.slug)}
                      className="-me-1 -mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <LuTrash2 aria-hidden className="size-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="inline-flex h-9 items-center rounded-full border border-border bg-background">
                      <button
                        type="button"
                        aria-label={t("decrease", { name: line.name })}
                        disabled={quantity <= minQuantity}
                        onClick={() => setQuantity(line.slug, quantity - 1)}
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
                        aria-label={t("increase", { name: line.name })}
                        disabled={quantity >= maxQuantity}
                        onClick={() => setQuantity(line.slug, quantity + 1)}
                        className="inline-flex size-9 items-center justify-center rounded-full text-heading transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:text-border"
                      >
                        <LuPlus aria-hidden className="size-3.5" />
                      </button>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-price sm:text-base">{money(line.price * quantity)}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <aside className="overflow-hidden rounded-2xl border border-border bg-background lg:sticky lg:top-24">
      {items.length > 0 ? <CartCoupons appliedCode={appliedCoupon?.code ?? null} onApply={setAppliedCoupon} /> : null}

      <div className="p-5">
        <h2 className="text-lg font-bold tracking-tight">{t("summary")}</h2>
        <dl className="mt-4 space-y-3.5 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">{t("subtotal")}</dt>
            <dd className="font-semibold tabular-nums text-heading">{money(subtotal)}</dd>
          </div>
          {appliedCoupon ? (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">
                {t("couponLabel")}
                <span className="mt-0.5 block text-xs font-semibold tracking-wide text-primary">{appliedCoupon.code}</span>
              </dt>
              <dd className="flex items-center gap-1 font-semibold tabular-nums text-price">
                {quote.discount > 0 ? `−${money(quote.discount)}` : t("couponShipping")}
                <button
                  type="button"
                  aria-label={t("removeCoupon")}
                  onClick={() => setAppliedCoupon(null)}
                  className="inline-flex size-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <LuX aria-hidden className="size-3.5" />
                </button>
              </dd>
            </div>
          ) : null}
          <div className="flex items-start justify-between gap-3">
            <dt className="text-muted">
              {t("shipping")}
              <span className="mt-0.5 block text-xs text-muted/80">{t("shippingNote")}</span>
            </dt>
            <dd className="pt-0.5 font-semibold tabular-nums text-heading">{money(quote.shippingCost)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3.5 py-3">
            <dt className="text-sm font-semibold text-heading">{t("total")}</dt>
            <dd className="text-base font-bold tabular-nums text-price">{money(subtotal - quote.discount + quote.shippingCost)}</dd>
          </div>
        </dl>
        {items.length > 0 ? (
          <Link
            href={checkoutHref}
            className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("checkout")}
          </Link>
        ) : null}
      </div>
      </aside>
    </div>
  );
}
