import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { getProductRoutePath } from "@/utils/routes";

export type ProductCategoryKey = "fruits" | "vegetables" | "iceCream" | "candy";

export type ProductNameKey =
  | "coconut"
  | "sourStrawberry"
  | "mixedVegetables"
  | "sweetStrawberry"
  | "vanillaMangoIcy"
  | "orangeMangoIcy"
  | "blueberryVanillaIcy"
  | "strawberryVanillaIcy"
  | "pureMangoIceCream"
  | "mangoWaffle"
  | "chocoBrowniesIcy"
  | "strawberryCashew";

export type ProductCardItem = {
  slug: string;
  image: string;
  categoryKey: ProductCategoryKey;
  nameKey: ProductNameKey;
  priceFrom: number;
  priceTo?: number;
  isNew?: boolean;
};

function formatAedAmount(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function ProductCard({ product }: { product: ProductCardItem }) {
  const t = useTranslations("ProductCard");
  const name = t(product.nameKey);
  const priceFrom = formatAedAmount(product.priceFrom);
  const priceTo = product.priceTo ? formatAedAmount(product.priceTo) : undefined;
  const hasRange = Boolean(priceTo && product.priceTo !== product.priceFrom);

  return (
    <article className="h-full overflow-hidden rounded-xl border border-border/50 bg-background sm:rounded-2xl">
      <Link
        href={getProductRoutePath(product.slug)}
        className="flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <div className="relative aspect-square overflow-hidden bg-surface">
          <ImageComponent
            src={product.image}
            alt={name}
            width={800}
            height={800}
            objectFit="contain"
            sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 22vw"
            className="p-3 sm:p-4"
          />

          {product.isNew ? (
            <span className="absolute inset-s-2.5 top-2.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground sm:inset-s-3 sm:top-3">
              {t("new")}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5 sm:px-4 sm:pb-4 sm:pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
            {t(product.categoryKey)}
          </p>
          <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold leading-snug text-heading sm:min-h-11 sm:text-[15px]">
            {name}
          </h3>
          <p className="mt-1.5 text-sm font-semibold text-price">
            {hasRange && priceTo ? (
              <>
                <span className="sr-only">{t("priceRangeLabel", { from: priceFrom, to: priceTo })}</span>
                <span aria-hidden>{t("priceRange", { from: priceFrom, to: priceTo })}</span>
              </>
            ) : (
              <>
                <span className="sr-only">{t("priceLabel", { amount: priceFrom })}</span>
                <span aria-hidden>{t("price", { amount: priceFrom })}</span>
              </>
            )}
          </p>
        </div>
      </Link>
    </article>
  );
}
