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
  minSelection: number;
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
  minSelection,
}: ProductSelectionProps) {
  const [sizeName, setSizeName] = useState<string | null>(
    () => variants.find((item) => item.is_default)?.size ?? null,
  );
  const selectedVariant = variants.find((item) => item?.size === sizeName);
  const shownWeight = selectedVariant?.weight || (isVariant ? 0 : weight);
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
            minSelection={minSelection}
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
          />
        </div>
      </div>
      <ProductTabs name={name} weight={shownWeight} size={sizeList} />
    </>
  );
}
