"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  bar = false,
}: PurchaseActionsProps & { inputId: string; bar?: boolean }) {
  const t = useTranslations("ProductPage");
  const stepButton =
    "inline-flex size-9 items-center justify-center rounded-full text-heading transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:text-border @max-[22rem]:size-8 lg:size-11";

  return (
    <div className={`flex w-full flex-row items-center gap-2 lg:gap-3 ${bar ? "lg:justify-between" : ""}`}>
      <div className="inline-flex h-10 shrink-0 items-center rounded-full border border-border bg-background lg:h-11">
        <button
          type="button"
          aria-label={t("decreaseQuantity")}
          disabled={quantity <= 1}
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className={stepButton}
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
          className="h-10 w-7 border-0 bg-transparent text-center text-sm font-semibold text-heading outline-none [appearance:textfield] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:h-11 lg:w-10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          aria-label={t("increaseQuantity")}
          disabled={quantity >= maxQuantity}
          onClick={() => onQuantityChange(quantity + 1)}
          className={stepButton}
        >
          <LuPlus aria-hidden className="size-4" />
        </button>
      </div>
      <div
        className="grid min-w-0 flex-1 grid-cols-2 gap-2 lg:flex lg:w-auto lg:flex-none lg:gap-3"
      >
        <AddToCartButton
          variant="product"
          compact
          disabled={disabled}
          describedBy={needsSize ? "choose-size" : undefined}
          payload={payload}
        />
        <AddToCartButton
          variant="product"
          compact
          action="buy"
          disabled={disabled}
          describedBy={needsSize ? "choose-size" : undefined}
          payload={payload}
        />
      </div>
    </div>
  );
}

export default function PurchaseActions(props: PurchaseActionsProps) {
  const t = useTranslations("ProductPage");
  const anchorRef = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [pinned, setPinned] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // The sticky header covers the top, and the mobile nav covers the bottom.
    // The in-page controls count as on screen only in the space between them.
    function sync() {
      const node = anchorRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const header = 72;
      const nav = window.matchMedia("(min-width: 1024px)").matches ? 0 : 56;
      const visible = rect.bottom > header && rect.top < window.innerHeight - nav;
      setPinned((current) => (current === !visible ? current : !visible));
    }

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  useLayoutEffect(() => {
    if (!bar) return;

    const root = document.documentElement;
    const sync = () => {
      root.style.setProperty("--purchase-bar-offset", pinned ? `${bar.offsetHeight}px` : "0px");
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(bar);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--purchase-bar-offset");
    };
  }, [bar, pinned]);

  return (
    <>
      <div ref={anchorRef}>
        <PurchaseControls inputId="product-quantity" {...props} />
      </div>
      {mounted
        ? createPortal(
            <div
              ref={setBar}
              data-purchase-bar
              role="region"
              aria-label={t("purchaseBar")}
              aria-hidden={!pinned}
              inert={!pinned}
              className={`fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-40 border-t border-border bg-background/95 py-2 shadow-[0_-12px_32px_-24px_rgb(0_0_0/0.45)] backdrop-blur-xl transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none lg:bottom-0 lg:py-2.5 lg:pb-[max(0.625rem,env(safe-area-inset-bottom))] ${
                pinned
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-[calc(100%+3.5rem+env(safe-area-inset-bottom))] opacity-0 lg:translate-y-full"
              }`}
            >
              <div className="@container container">
                <PurchaseControls inputId="product-quantity-sticky" bar {...props} />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
