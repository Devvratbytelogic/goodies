"use client";

import { useState, type ReactNode } from "react";
import ProductPurchase from "@/components/product/ProductPurchase";
import ProductTabs from "@/components/product/ProductTabs";
import { BundleItemsEntity, SizesEntity, Variant, VariantsEntity } from "@/server/types/singleProduct";

type ProductSelectionProps = {
  children: ReactNode;
  productId: string;
  name: string;
  slug: string;
  isVariant: boolean;
  variant: Variant;
  variants: VariantsEntity[];
  sizes: SizesEntity[];
  currencySymbol: string;
  weight: number;
  isBundle: boolean;
  bundleItems: BundleItemsEntity[];
  maxSelection: number;
  maxProductQuantity: number;
  bundleStock: number;
  stockManage: boolean;
  stockStatus: "out_of_stock" | "in_stock";
};

export default function ProductSelection({
  children,
  productId,
  name,
  slug,
  isVariant,
  variant,
  variants,
  sizes,
  currencySymbol,
  weight,
  isBundle,
  bundleItems,
  maxSelection,
  maxProductQuantity,
  bundleStock,
  stockManage,
  stockStatus,
}: ProductSelectionProps) {
  const [sizeName, setSizeName] = useState<string | null>(
    () => variants.find((item) => item.is_default)?.size ?? null,
  );
  const [picked, setPicked] = useState<Record<string, number>>({});
  const selectedVariant = variants.find((item) => item?.size === sizeName);
  const bundleWeight = bundleItems.reduce((sum, item) => {
    const count = picked[item.product_id._id] ?? 0;
    const itemWeight = item.product_id.variant?.weight || item.product_id.weight || 0;
    return sum + itemWeight * count;
  }, 0);
  const shownWeight = isBundle ? bundleWeight : selectedVariant?.weight || (isVariant ? 0 : weight);
  const sizeList = sizes.map((size) => size?.name).filter(Boolean).join(", ");

  return (
    <>
      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="lg:sticky lg:top-30">{children}</div>
        <div>
          <h1 className="text-2xl font-semibold text-primary!">{name}</h1>
          <ProductPurchase
            isBundle={isBundle}
            bundleItems={bundleItems}
            maxSelection={maxSelection}
            maxProductQuantity={maxProductQuantity}
            bundleStock={bundleStock}
            stockManage={stockManage}
            stockStatus={stockStatus}
            slug={slug}
            name={name}
            isVariant={isVariant}
            variant={variant}
            variants={variants}
            sizes={sizes}
            currencySymbol={currencySymbol}
            sizeName={sizeName}
            onSizeChange={setSizeName}
            productId={productId}
            picked={picked}
            onPickedChange={setPicked}
          />
        </div>
      </div>
      <ProductTabs name={name} weight={shownWeight} size={sizeList} />
    </>
  );
}
