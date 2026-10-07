"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LuMinus, LuPlus } from "react-icons/lu";
import AddToCartButton from "@/components/product/AddToCartButton";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { BundleItemsEntity, SizesEntity, Variant, VariantsEntity } from "@/server/types/singleProduct";
import { formatAmount } from "@/utils/price";
import BundleProductCard from "./BundleProductCard";
import TabbyPromo from "./TabbyPromo";

type ProductPurchaseProps = {
  slug: string;
  name: string;
  isVariant: boolean;
  variant: Variant;
  variants: VariantsEntity[];
  currencySymbol: string;
  sizes: SizesEntity[];
  sizeName: string | null;
  onSizeChange: (sizeName: string | null) => void;
  productId: string;
  isBundle: boolean;
  bundleItems: BundleItemsEntity[];
  maxSelection: number;
  minSelection: number;
  bundleStock: number;
};

export default function ProductPurchase({ name, isVariant, variant, variants, sizes, currencySymbol, sizeName, onSizeChange, productId, isBundle, bundleItems, maxSelection, minSelection, bundleStock }: ProductPurchaseProps) {
  const t = useTranslations("ProductPage");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [picked, setPicked] = useState<Record<string, number>>({});

  const totalPicked = Object.values(picked).reduce((sum, qty) => sum + qty, 0);
  const canAddMore = totalPicked < maxSelection;
  const boxReady = totalPicked >= minSelection;

  const selectedVariant = variants.find((item) => item?.size === sizeName);
  const allSizesSoldOut = isVariant && variants.length > 0 && variants.every((item) => item?.stock === 0);

  // bundle: bundle stock, variable: selected size stock, simple: variant stock
  const maxQuantity = isBundle
    ? bundleStock
    : isVariant
      ? (selectedVariant?.stock ?? (allSizesSoldOut ? 0 : Infinity))
      : (variant?.stock ?? 0);
  const outOfStock = maxQuantity <= 0;
  const stockReached = quantity >= maxQuantity;
  const price = selectedVariant?.price ?? variant?.price ?? 0;
  const maxPrice = selectedVariant?.max_price ?? variant?.max_price ?? 0;
  const needsSize = sizes.length > 0 && !sizeName;
  const showRange = isVariant && !sizeName;
  const showMaxPrice = !showRange && maxPrice > 0 && maxPrice !== price;

  function priceLabel() {
    if (showRange) {
      return t("priceRangeLabel", {
        from: formatAmount(price, currencySymbol),
        to: formatAmount(maxPrice, currencySymbol),
      });
    }

    return t("priceLabel", { amount: formatAmount(price, currencySymbol) });
  }

  const bundleSelections = bundleItems
    .filter((item) => picked[item.product_id._id] > 0)
    .map((item) => ({
      product_id: item.product_id._id,
      variant_sku: item.variant_sku ?? undefined,
      quantity: picked[item.product_id._id],
    }));

  const payload = isBundle
    ? { product_id: productId, quantity, bundle_selections: bundleSelections }
    : { product_id: productId, quantity, variant_sku: selectedVariant?.sku ?? "" };
  const addDisabled = needsSize || outOfStock || (isBundle && !boxReady);


  const wishlistPayload = {
    product_id: productId,
    variant_sku: selectedVariant?.sku ?? "",
  };

  return (
    <div className="mt-3">
      <p className="text-[22px] font-bold leading-9" aria-live="polite">
        <span className="sr-only">{priceLabel()}</span>
        <span aria-hidden className="text-price">
          {showRange ? (
            <>
              <bdi>{formatAmount(price, currencySymbol)}</bdi>
              <span className="mx-1.5 font-bold text-heading">–</span>
              <bdi>{formatAmount(maxPrice, currencySymbol)}</bdi>
            </>
          ) : (
            <>
              {showMaxPrice ? (
                <bdi className="line-through text-muted-foreground me-1.5">{formatAmount(maxPrice, currencySymbol)}</bdi>
              ) : null}
              <bdi className="me-1.5">{formatAmount(price, currencySymbol)}</bdi>
            </>
          )}
        </span>
      </p>

      {isBundle ? (
        <div className="mt-5">
          <div className="sticky top-22 z-10 bg-background pt-2 pb-3 lg:top-24">
            <div className="rounded-xl border border-border bg-surface p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-heading">
                  {minSelection === maxSelection
                    ? t("bundleChoose", { count: maxSelection })
                    : t("bundleChooseRange", { min: minSelection, max: maxSelection })}
                </p>
                <span
                  aria-live="polite"
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${boxReady ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary"}`}
                >
                  {t("bundleSelected", { selected: totalPicked, max: maxSelection })}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-muted">
                {!boxReady
                  ? t("bundleRemaining", { count: minSelection - totalPicked })
                  : canAddMore
                    ? t("bundleCanAddMore", { count: maxSelection - totalPicked })
                    : t("bundleFull")}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {bundleItems.length > 0 ? bundleItems.map((item, index) => (
              <BundleProductCard
                key={index}
                bundleItem={item}
                quantity={picked[item.product_id._id] ?? 0}
                canAddMore={canAddMore}
                currencySymbol={currencySymbol}
                onChange={(qty) => setPicked({ ...picked, [item.product_id._id]: qty })}
              />
            )) :
              <p className="text-sm font-semibold text-foreground col-span-2">
                {t("noBundleItems")}
              </p>
            }
          </div>
        </div>
      ) : null}
      {sizes.length > 0 ? (
        <div className="mt-5">
          <p className="text-sm font-semibold text-foreground">
            {t("size")}
            {sizeName ? <span className="text-primary">: {sizeName}</span> : null}
          </p>
          <div role="radiogroup" aria-label={t("size")} className="mt-2 flex flex-wrap items-center gap-2">
            {sizes.map((size) => {
              const selected = size.name === sizeName;
              const soldOut = variants.find((item) => item?.size === size.name)?.stock === 0;
              return (
                <button
                  key={size.name}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => {
                    onSizeChange(size.name);
                    setQuantity(1);
                    setAdded(false);
                  }}
                  className={`min-h-10 min-w-16 rounded-md border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${selected
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-background text-heading hover:border-primary/40"
                    } ${soldOut ? "border-dashed line-through" : ""}`}
                >
                  {size.name}
                  {soldOut ? <span className="sr-only">, {t("outOfStock")}</span> : null}
                </button>
              );
            })}
            {sizeName ? (
              <button
                type="button"
                onClick={() => {
                  onSizeChange(null);
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
        {outOfStock ? (
          <div role="status" className="rounded-xl border border-border bg-surface p-4">
            <span className="inline-flex items-center rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
              {t("outOfStock")}
            </span>
            <p className="mt-2 text-sm text-foreground">
              {isVariant && !allSizesSoldOut ? t("outOfStockSize") : t("outOfStockProduct")}
            </p>
          </div>
        ) : (
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
                setQuantity(Number.isFinite(next) && next > 0 ? Math.min(next, maxQuantity) : 1);
                setAdded(false);
              }}
              className="h-11 w-10 border-0 bg-transparent text-center text-sm font-semibold text-heading outline-none [appearance:textfield] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              aria-label={t("increaseQuantity")}
              disabled={quantity >= maxQuantity}
              onClick={() => {
                setQuantity((current) => current + 1);
                setAdded(false);
              }}
              className="inline-flex size-11 items-center justify-center rounded-full text-heading transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:text-border"
            >
              <LuPlus aria-hidden className="size-4" />
            </button>
          </div>
          <div className="grid w-full grid-cols-2 gap-2.5 @min-[30rem]:flex @min-[30rem]:w-auto @min-[30rem]:gap-3">
            <AddToCartButton
              variant="product"
              disabled={addDisabled}
              describedBy={needsSize ? "choose-size" : undefined}
              payload={payload}
            />
            <AddToCartButton
              variant="product"
              action="buy"
              disabled={addDisabled}
              describedBy={needsSize ? "choose-size" : undefined}
              payload={payload}
            />
          </div>
        </div>
        )}
        {!outOfStock && stockReached ? (
          <p aria-live="polite" className="mt-3 text-sm font-medium text-primary">
            {t("bundleStockLimit", { count: maxQuantity })}
          </p>
        ) : null}
        {added ? (
          <p className="mt-3 text-sm font-medium text-accent" role="status">
            {t("added")}
          </p>
        ) : null}
      </div>

      <div className="mt-4 space-y-3">
        <TabbyPromo price={price} currencySymbol={currencySymbol} />
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-3 text-sm sm:px-4">
          <p className="text-foreground">
            <strong>{formatAmount(price / 4, currencySymbol)}</strong>
            {t("tamaraRest")} <span className="underline">{t("moreOptions")}</span>
          </p>
          <span className="shrink-0 rounded-md bg-linear-to-r from-[#ff8a00] via-[#ff4d8d] to-[#7c3aed] px-2 py-1 text-sm font-bold text-white">
            tamara
          </span>
        </div>
      </div>

      <WishlistButton name={name} payload={wishlistPayload} variant="text" className="mt-4" />
    </div>
  );
}
