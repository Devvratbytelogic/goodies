import { HomeProductVariant } from "@/server/types/Home";
import { formatAmount } from "@/utils/price";


interface ProductPriceProps {
  variant?: HomeProductVariant;
  variants?: HomeProductVariant[];
  isVariant?: boolean;
  hideMaxPrice?: boolean;
  currencySymbol?: string;
  className?: string;
}
export default function ProductPrice({ variant, variants, isVariant = false, hideMaxPrice = false, currencySymbol = "", className = "mt-1.5 text-base font-semibold text-price",
}: ProductPriceProps) {
  const options = variants?.filter((item) => item != null) ?? [];
  // One variant: its max_price is the compare-at price.
  // Several variants: the summary max_price is the highest selling price.
  const single = isVariant && options.length === 1 ? options[0] : undefined;
  const price = single?.price ?? variant?.price ?? 0;
  const maxPrice = single?.max_price ?? variant?.max_price ?? 0;
  const showRange = isVariant && !single && !hideMaxPrice && maxPrice > price;
  const showMaxPrice = !hideMaxPrice && !showRange && maxPrice > 0 && maxPrice !== price;

  return (
    <p className={className}>
      {showRange ? (
        <>
          <span className="sr-only">{formatAmount(price, currencySymbol)} through {formatAmount(maxPrice, currencySymbol)}</span>
          <span aria-hidden>
            <bdi>{formatAmount(price, currencySymbol)}</bdi>
            {" – "}
            <bdi>{formatAmount(maxPrice, currencySymbol)}</bdi>
          </span>
        </>
      ) : (
        <>
          {showMaxPrice ? (
            <bdi className="me-1.5 line-through text-muted-foreground">{formatAmount(maxPrice, currencySymbol)}</bdi>
          ) : null}
          <bdi className="me-1.5 text-primary">{formatAmount(price, currencySymbol)}</bdi>
        </>
      )}
    </p>
  )
}
