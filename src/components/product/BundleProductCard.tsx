"use client";

import { useTranslations } from "next-intl";
import { LuMinus, LuPlus } from "react-icons/lu";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { BundleItemsEntity } from "@/server/types/singleProduct";
import ProductPrice from "@/components/product/ProductPrice";
import { formatAmount } from "@/utils/price";

interface BundleProductCardProps {
  bundleItem: BundleItemsEntity;
  quantity: number;
  canAddMore: boolean;
  maxProductQuantity: number;
  currencySymbol: string;
  onChange: (quantity: number) => void;
}

export default function BundleProductCard({ bundleItem, quantity, canAddMore, maxProductQuantity, currencySymbol, onChange }: BundleProductCardProps) {
  const t = useTranslations("ProductPage");

  const product = bundleItem.product_id;
  const stockManage = product.variant?.stock_manage;
  const stockStatus = product.variant?.stock_status;
  // stock_manage false means the item stays available, same as the product card.
  const inStock = !(stockManage && stockStatus === "out_of_stock");
  // Only a managed item is limited by its stock count.
  const stock = product.variant?.stock ?? product.stock;
  const stockReached = Boolean(stockManage) && quantity >= stock;
  const productMaxReached = quantity >= maxProductQuantity;
  const canIncrease = canAddMore && !stockReached && !productMaxReached;

  return (
    <div className={`flex flex-col overflow-hidden rounded-xl border bg-background ${quantity > 0 ? "border-primary" : "border-border"}`}>
      <div className="relative aspect-square bg-surface">
        <ImageComponent
          src={product.thumbnail || "/images/image-fallback.svg"}
          alt={product.title}
          fill
          objectFit="cover"
          sizes="(max-width: 1024px) 45vw, 20vw"
          className={inStock ? "" : "opacity-50"}
        />
      </div>

      <div className="flex flex-1 flex-col p-2.5">
        <p className={`line-clamp-2 text-sm font-semibold text-heading ${inStock ? "" : "line-through"}`}>{product.title}</p>
        <p className="mt-1 text-sm font-semibold text-price">{formatAmount(product.variant?.price, currencySymbol)}</p>

        <div className="mt-auto pt-2.5">
          {inStock ? (
            <div className="flex h-9 items-center justify-between rounded-full border border-border">
              <button
                type="button"
                aria-label={t("bundleDecrease", { name: product.title })}
                disabled={quantity === 0}
                onClick={() => onChange(quantity - 1)}
                className="inline-flex size-9 items-center justify-center rounded-full text-heading hover:text-primary disabled:text-border"
              >
                <LuMinus aria-hidden className="size-3.5" />
              </button>
              <span className="text-sm font-semibold">{quantity}</span>
              <button
                type="button"
                aria-label={t("bundleIncrease", { name: product.title })}
                disabled={!canIncrease}
                onClick={() => onChange(quantity + 1)}
                className="inline-flex size-9 items-center justify-center rounded-full text-heading hover:text-primary disabled:text-border"
              >
                <LuPlus aria-hidden className="size-3.5" />
              </button>
            </div>
          ) : (
            <p className="flex h-9 items-center justify-center rounded-full bg-surface text-xs font-semibold text-muted">{t("outOfStock")}</p>
          )}
          {inStock && stockReached ? (
            <p aria-live="polite" className="mt-1.5 text-center text-xs font-medium text-primary">
              {t("bundleStockLimit", { count: stock })}
            </p>
          ) : null}
          {inStock && !stockReached && productMaxReached ? (
            <p aria-live="polite" className="mt-1.5 text-center text-xs font-medium text-primary">
              {t("bundleProductLimit", { count: maxProductQuantity })}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
