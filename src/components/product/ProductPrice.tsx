import { HomeProductVariant } from "@/server/types/Home";
import { formatAmount } from "@/utils/price";


interface ProductPriceProps {
  variant?: HomeProductVariant;
  variants?: HomeProductVariant[];
  isVariant?: boolean;
  currencySymbol?: string;
  className?: string;
}
export default function ProductPrice({ variant, variants, isVariant = false, currencySymbol = "", className = "mt-1.5 text-base font-semibold text-price",
}: ProductPriceProps) {
  const price = variant?.price ?? 0;
  const maxPrice = variant?.max_price ?? 0;
  const showMaxPrice = maxPrice > 0 && maxPrice !== price;

  return (
    <p className={className}>
      {isVariant ? (
        <>
          <span className="sr-only">{formatAmount(price, currencySymbol)} through {formatAmount(maxPrice, currencySymbol)}</span>
          <span aria-hidden>{formatAmount(price, currencySymbol)} – {formatAmount(maxPrice, currencySymbol)}</span>
        </>
      ) : (
        <>
          {showMaxPrice ? (
            <span className="me-1.5 line-through text-muted-foreground">{formatAmount(maxPrice, currencySymbol)}</span>
          ) : null}
          <span className="me-1.5 text-primary">{formatAmount(price, currencySymbol)}</span>
        </>
      )}
    </p>
  )
}
