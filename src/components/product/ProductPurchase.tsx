"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LuCheck, LuChevronDown, LuMinus, LuPlus } from "react-icons/lu";
import AddToCartButton from "@/components/product/AddToCartButton";
import BuyNowButton from "@/components/product/BuyNowButton";
import type { ProductSize, ProductSizeId } from "@/data/products";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { useRouter } from "@/i18n/navigation";
import { getCheckoutClassicRoutePath } from "@/utils/routes";

type CurrencyCode = "AED" | "USD" | "EUR" | "SAR" | "QAR" | "KWD" | "OMR" | "BHD";

type Currency = {
  code: CurrencyCode;
  rate: number;
  symbol: string;
  position: "prefix" | "suffix";
};

const currencies: Currency[] = [
  { code: "AED", rate: 1, symbol: "د.إ", position: "suffix" },
  { code: "USD", rate: 0.2723, symbol: "$", position: "prefix" },
  { code: "EUR", rate: 0.2508, symbol: "€", position: "prefix" },
  { code: "SAR", rate: 1.021, symbol: "ر.س", position: "suffix" },
  { code: "QAR", rate: 0.991, symbol: "ر.ق", position: "suffix" },
  { code: "KWD", rate: 0.0836, symbol: "د.ك", position: "suffix" },
  { code: "OMR", rate: 0.1047, symbol: "ر.ع.", position: "suffix" },
  { code: "BHD", rate: 0.1025, symbol: "د.ب", position: "suffix" },
];

type ProductPurchaseProps = {
  slug: string;
  name: string;
  priceFrom: number;
  priceTo?: number;
  sizes: ProductSize[];
};

const flagClass = "h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] ring-1 ring-black/10";

function CurrencyFlag({ code }: { code: CurrencyCode }) {
  switch (code) {
    case "AED":
      return (
        <svg viewBox="0 0 20 14" className={flagClass} aria-hidden>
          <rect width="20" height="14" fill="#00732f" />
          <rect y="4.67" width="20" height="4.66" fill="#fff" />
          <rect y="9.33" width="20" height="4.67" fill="#000" />
          <rect width="5.5" height="14" fill="#ff0000" />
        </svg>
      );
    case "USD":
      return (
        <svg viewBox="0 0 20 14" className={flagClass} aria-hidden>
          <rect width="20" height="14" fill="#bf0a30" />
          <rect y="1.08" width="20" height="1.07" fill="#fff" />
          <rect y="3.23" width="20" height="1.07" fill="#fff" />
          <rect y="5.38" width="20" height="1.07" fill="#fff" />
          <rect y="7.54" width="20" height="1.07" fill="#fff" />
          <rect y="9.69" width="20" height="1.07" fill="#fff" />
          <rect y="11.85" width="20" height="1.07" fill="#fff" />
          <rect width="8.4" height="7.54" fill="#002868" />
        </svg>
      );
    case "EUR":
      return (
        <svg viewBox="0 0 20 14" className={flagClass} aria-hidden>
          <rect width="20" height="14" fill="#003399" />
          <g fill="#fc0">
            <circle cx="10" cy="2.2" r="0.55" />
            <circle cx="12.7" cy="3.2" r="0.55" />
            <circle cx="14.2" cy="5.4" r="0.55" />
            <circle cx="13.6" cy="8" r="0.55" />
            <circle cx="11.6" cy="9.8" r="0.55" />
            <circle cx="8.4" cy="9.8" r="0.55" />
            <circle cx="6.4" cy="8" r="0.55" />
            <circle cx="5.8" cy="5.4" r="0.55" />
            <circle cx="7.3" cy="3.2" r="0.55" />
          </g>
        </svg>
      );
    case "SAR":
      return (
        <svg viewBox="0 0 20 14" className={flagClass} aria-hidden>
          <rect width="20" height="14" fill="#006c35" />
          <rect x="4" y="3.2" width="12" height="1.1" fill="#fff" />
          <rect x="6.2" y="5.4" width="7.6" height="1.1" fill="#fff" />
          <path d="M10 6.2v4.2" stroke="#fff" strokeWidth="1.1" />
        </svg>
      );
    case "QAR":
      return (
        <svg viewBox="0 0 20 14" className={flagClass} aria-hidden>
          <rect width="20" height="14" fill="#8d1b3d" />
          <path fill="#fff" d="M0 0h7.2l1.6 1.4L7.2 2.8l1.6 1.4L7.2 5.6l1.6 1.4L7.2 8.4l1.6 1.4L7.2 11.2 8.8 12.6 7.2 14H0z" />
        </svg>
      );
    case "KWD":
      return (
        <svg viewBox="0 0 20 14" className={flagClass} aria-hidden>
          <rect width="20" height="14" fill="#fff" />
          <rect width="20" height="4.67" fill="#007a3d" />
          <rect y="9.33" width="20" height="4.67" fill="#ce1126" />
          <path fill="#000" d="M0 0l6.2 4.67L0 9.33V0z" />
        </svg>
      );
    case "OMR":
      return (
        <svg viewBox="0 0 20 14" className={flagClass} aria-hidden>
          <rect width="20" height="14" fill="#fff" />
          <rect width="20" height="4.67" fill="#db161b" />
          <rect y="9.33" width="20" height="4.67" fill="#008000" />
          <rect width="5" height="14" fill="#db161b" />
        </svg>
      );
    case "BHD":
      return (
        <svg viewBox="0 0 20 14" className={flagClass} aria-hidden>
          <rect width="20" height="14" fill="#ce1126" />
          <path fill="#fff" d="M0 0h7.4l1.8 1.75L7.4 3.5l1.8 1.75L7.4 7l1.8 1.75L7.4 10.5l1.8 1.75L7.4 14H0z" />
        </svg>
      );
  }
}

function formatAmount(amount: number, currency: Currency) {
  const value = (amount * currency.rate).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return currency.position === "prefix" ? `${currency.symbol}${value}` : `${value}\u00a0${currency.symbol}`;
}

export default function ProductPurchase({ slug, name, priceFrom, priceTo, sizes }: ProductPurchaseProps) {
  const t = useTranslations("ProductPage");
  const router = useRouter();
  const listId = useId();
  const currencyRef = useRef<HTMLDivElement>(null);
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>("AED");
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [sizeId, setSizeId] = useState<ProductSizeId | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const currency = currencies.find((item) => item.code === currencyCode) ?? currencies[0];
  const selectedSize = sizes.find((size) => size.id === sizeId);
  const needsSize = sizes.length > 0 && !selectedSize;
  const activePrice = selectedSize?.price ?? priceFrom;
  const showRange = Boolean(priceTo && priceTo !== priceFrom && !selectedSize);

  useEffect(() => {
    if (!currencyOpen) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      if (!currencyRef.current?.contains(event.target as Node)) {
        setCurrencyOpen(false);
      }
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCurrencyOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [currencyOpen]);

  function priceLabel() {
    if (showRange && priceTo) {
      return t("priceRangeLabel", {
        from: formatAmount(priceFrom, currency),
        to: formatAmount(priceTo, currency),
      });
    }

    return t("priceLabel", { amount: formatAmount(activePrice, currency) });
  }

  function addToCart() {
    if (needsSize) {
      return;
    }

    console.log("Add to cart", { slug, name, sizeId, quantity, currency: currency.code });
    setAdded(true);
  }

  function buyNow() {
    if (needsSize) {
      return;
    }

    console.log("Buy now", { slug, name, sizeId, quantity, currency: currency.code });
    router.push(getCheckoutClassicRoutePath());
  }

  return (
    <div className="mt-3">
      <p className="text-[22px] font-bold leading-9" aria-live="polite">
        <span className="sr-only">{priceLabel()}</span>
        <span aria-hidden className="text-price">
          {showRange && priceTo ? (
            <>
              <bdi>{formatAmount(priceFrom, currency)}</bdi>
              <span className="mx-1.5 font-bold text-heading">–</span>
              <bdi>{formatAmount(priceTo, currency)}</bdi>
            </>
          ) : (
            <bdi>{formatAmount(activePrice, currency)}</bdi>
          )}
        </span>
      </p>

      <div ref={currencyRef} className="relative mt-3 w-fit">
        <button
          type="button"
          aria-label={t("currency")}
          aria-haspopup="listbox"
          aria-expanded={currencyOpen}
          aria-controls={listId}
          onClick={() => setCurrencyOpen((open) => !open)}
          className={`inline-flex h-9 items-center gap-2 rounded-lg border bg-background px-2.5 text-sm font-semibold text-heading transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            currencyOpen ? "border-primary" : "border-border hover:border-primary/40"
          }`}
        >
          <CurrencyFlag code={currency.code} />
          <span>{currency.code}</span>
          <LuChevronDown
            aria-hidden
            className={`size-4 text-muted transition-transform ${currencyOpen ? "rotate-180" : ""}`}
          />
        </button>
        {currencyOpen ? (
          <ul
            id={listId}
            role="listbox"
            aria-label={t("currency")}
            className="absolute z-20 mt-1.5 max-h-60 min-w-full overflow-y-auto overscroll-contain rounded-lg border border-border bg-background py-1 shadow-md"
          >
            {currencies.map((item) => {
              const selected = item.code === currency.code;
              return (
                <li key={item.code} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setCurrencyCode(item.code);
                      setCurrencyOpen(false);
                      setAdded(false);
                    }}
                    className={`flex w-full items-center gap-2 px-2.5 py-2 text-start text-sm focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary ${
                      selected ? "bg-primary-soft font-semibold text-primary" : "text-heading hover:bg-surface"
                    }`}
                  >
                    <CurrencyFlag code={item.code} />
                    <span className="flex-1">{item.code}</span>
                    {selected ? <LuCheck aria-hidden className="size-3.5" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      {sizes.length > 0 ? (
        <div className="mt-5">
          <p className="text-sm font-semibold text-foreground">
            {t("size")}
            {selectedSize ? <span className="text-primary">: {t(selectedSize.id)}</span> : null}
          </p>
          <div role="radiogroup" aria-label={t("size")} className="mt-2 flex flex-wrap items-center gap-2">
            {sizes.map((size) => {
              const selected = size.id === sizeId;
              return (
                <button
                  key={size.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => {
                    setSizeId(size.id);
                    setAdded(false);
                  }}
                  className={`min-h-10 min-w-16 rounded-md border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    selected
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border bg-background text-heading hover:border-primary/40"
                  }`}
                >
                  {t(size.id)}
                </button>
              );
            })}
            {selectedSize ? (
              <button
                type="button"
                onClick={() => {
                  setSizeId(null);
                  setAdded(false);
                }}
                className="ms-1 text-sm text-primary underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t("clear")}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="@container mt-5 border-t border-border pt-4">
        {needsSize ? (
          <p id="choose-size" className="sr-only">
            {t("chooseSize")}
          </p>
        ) : null}
        <div className="flex flex-col gap-2.5 @min-[30rem]:flex-row @min-[30rem]:items-center @min-[30rem]:gap-3">
          <div className="inline-flex h-11 w-fit shrink-0 items-center rounded-full border border-border bg-background">
            <button
              type="button"
              aria-label={t("decreaseQuantity")}
              disabled={quantity <= 1}
              onClick={() => {
                setQuantity((current) => Math.max(1, current - 1));
                setAdded(false);
              }}
              className="inline-flex size-11 items-center justify-center rounded-full text-heading transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:text-border"
            >
              <LuMinus aria-hidden className="size-4" />
            </button>
            <label className="sr-only" htmlFor="product-quantity">
              {t("quantity", { name })}
            </label>
            <input
              id="product-quantity"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              value={quantity}
              onChange={(event) => {
                const next = Number.parseInt(event.target.value, 10);
                setQuantity(Number.isFinite(next) && next > 0 ? next : 1);
                setAdded(false);
              }}
              className="h-11 w-10 border-0 bg-transparent text-center text-sm font-semibold text-heading outline-none [appearance:textfield] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              aria-label={t("increaseQuantity")}
              onClick={() => {
                setQuantity((current) => current + 1);
                setAdded(false);
              }}
              className="inline-flex size-11 items-center justify-center rounded-full text-heading transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <LuPlus aria-hidden className="size-4" />
            </button>
          </div>
          <div className="grid w-full grid-cols-2 gap-2.5 @min-[30rem]:flex @min-[30rem]:w-auto @min-[30rem]:gap-3">
            <AddToCartButton
              slug={slug}
              name={name}
              variant="product"
              disabled={needsSize}
              describedBy={needsSize ? "choose-size" : undefined}
              onAdd={addToCart}
            />
            <BuyNowButton
              disabled={needsSize}
              describedBy={needsSize ? "choose-size" : undefined}
              onBuy={buyNow}
            />
          </div>
        </div>
        {added ? (
          <p className="mt-3 text-sm font-medium text-accent" role="status">
            {t("added")}
          </p>
        ) : null}
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-3 text-sm sm:px-4">
          <p className="text-foreground">
            {t("tabbyBefore")} <strong>{formatAmount(activePrice / 4, currency)}/{t("month")}</strong>{" "}
            {t("tabbyAfter")} <span className="font-semibold text-[#2563eb]">{t("learnMore")}</span>
          </p>
          <span className="shrink-0 rounded-md bg-[#3cff7e] px-2 py-1 text-sm font-black tracking-tight text-black lowercase">
            tabby
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-3 text-sm sm:px-4">
          <p className="text-foreground">
            <strong>{formatAmount(activePrice / 4, currency)}</strong>
            {t("tamaraRest")} <span className="underline">{t("moreOptions")}</span>
          </p>
          <span className="shrink-0 rounded-md bg-linear-to-r from-[#ff8a00] via-[#ff4d8d] to-[#7c3aed] px-2 py-1 text-sm font-bold text-white">
            tamara
          </span>
        </div>
      </div>

      <WishlistButton slug={slug} name={name} variant="text" className="mt-4" />
    </div>
  );
}
