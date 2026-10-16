"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { LuMinus, LuPlus } from "react-icons/lu";
import AddToCartButton from "@/components/product/AddToCartButton";

type PurchasePayload = {
  product_id: string;
  quantity: number;
  variant_sku?: string;
  bundle_selections?: { product_id: string; variant_sku?: string; quantity: number }[];
};

type PurchaseActionsProps = {
  name: string;
  quantity: number;
  maxQuantity: number;
  disabled: boolean;
  needsSize: boolean;
  payload: PurchasePayload;
  onQuantityChange: (quantity: number) => void;
};

function PurchaseControls({
  inputId,
  name,
  quantity,
  maxQuantity,
  disabled,
  needsSize,
  payload,
  onQuantityChange,
}: PurchaseActionsProps & { inputId: string }) {
  const t = useTranslations("ProductPage");

  return (
    <div className="flex flex-col gap-2.5 @min-[30rem]:flex-row @min-[30rem]:items-center @min-[30rem]:gap-3">
      <div className="inline-flex h-11 w-fit shrink-0 items-center rounded-full border border-border bg-background">
        <button
          type="button"
          aria-label={t("decreaseQuantity")}
          disabled={quantity <= 1}
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="inline-flex size-11 items-center justify-center rounded-full text-heading transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:text-border"
        >
          <LuMinus aria-hidden className="size-4" />
        </button>
        <label className="sr-only" htmlFor={inputId}>
          {t("quantity", { name })}
        </label>
        <input
          id={inputId}
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={quantity}
          onChange={(event) => {
            const next = Number.parseInt(event.target.value, 10);
            onQuantityChange(Number.isFinite(next) && next > 0 ? Math.min(next, maxQuantity) : 1);
          }}
          className="h-11 w-10 border-0 bg-transparent text-center text-sm font-semibold text-heading outline-none [appearance:textfield] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          aria-label={t("increaseQuantity")}
          disabled={quantity >= maxQuantity}
          onClick={() => onQuantityChange(quantity + 1)}
          className="inline-flex size-11 items-center justify-center rounded-full text-heading transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:text-border"
        >
          <LuPlus aria-hidden className="size-4" />
        </button>
      </div>
      <div className="grid w-full grid-cols-2 gap-2.5 @min-[30rem]:flex @min-[30rem]:w-auto @min-[30rem]:gap-3">
        <AddToCartButton
          variant="product"
          disabled={disabled}
          describedBy={needsSize ? "choose-size" : undefined}
          payload={payload}
        />
        <AddToCartButton
          variant="product"
          action="buy"
          disabled={disabled}
          describedBy={needsSize ? "choose-size" : undefined}
          payload={payload}
        />
      </div>
    </div>
  );
}

const SHOW_AFTER_SCROLL = 160;

export default function PurchaseActions(props: PurchaseActionsProps) {
  const t = useTranslations("ProductPage");
  const [bar, setBar] = useState<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [pinned, setPinned] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onScroll() {
      const next = window.scrollY > SHOW_AFTER_SCROLL;
      setPinned((current) => (current === next ? current : next));
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    if (!bar) return;

    const root = document.documentElement;
    const sync = () => {
      root.style.setProperty("--purchase-bar-offset", `${bar.offsetHeight}px`);
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(bar);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--purchase-bar-offset");
    };
  }, [bar]);

  return (
    <>
      <PurchaseControls inputId="product-quantity" {...props} />
      {mounted && pinned
        ? createPortal(
            <div
              ref={setBar}
              data-purchase-bar
              role="region"
              aria-label={t("purchaseBar")}
              className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-40 border-t border-border bg-background/95 py-2.5 shadow-[0_-12px_32px_-24px_rgb(0_0_0/0.45)] backdrop-blur-xl lg:bottom-0 lg:pb-[max(0.625rem,env(safe-area-inset-bottom))]"
            >
              <div className="@container container lg:[&>div]:justify-between">
                <PurchaseControls inputId="product-quantity-sticky" {...props} />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
