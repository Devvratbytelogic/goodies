import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ImageComponent from "@/components/layout/common/ImageComponent";
import AddToCartButton from "@/components/product/AddToCartButton";
import ProductPrice from "@/components/product/ProductPrice";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { getProductRoutePath } from "@/utils/routes";
import { HomeProduct } from "@/server/types/Home";


export default function ProductCard({ product }: { product: HomeProduct }) {
  const t = useTranslations("ProductCard");
  const name = product?.title ?? "";
  const isVariant = product?.is_variant;
  // console.log('product', product);
  const isNew = product?.new_product;
  const variant = product?.variant;
  const variants = product?.variants ?? [];


  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border/50 bg-background sm:rounded-2xl">
      <WishlistButton
        slug={product.slug}
        name={name}
        className="absolute inset-e-2.5 top-2.5 z-10 sm:inset-e-3 sm:top-3"
      />
      <Link
        href={getProductRoutePath(product.slug)}
        className="flex flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <div className="relative aspect-square overflow-hidden bg-surface">
          <ImageComponent
            src={product?.thumbnail ?? "/images/image-fallback.svg"}
            alt={name}
            width={800}
            height={800}
            objectFit="cover"
            sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 22vw"
          // className="p-3 sm:p-4"
          />

          {isNew ? (
            <span className="absolute inset-s-2.5 top-2.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground sm:inset-s-3 sm:top-3">
              {t("new")}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col px-3 pt-2.5 sm:px-4 sm:pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
            {product?.categoryId?.name ?? ""}
          </p>
          <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold leading-snug text-heading sm:min-h-11 sm:text-[15px]">
            {name}
          </h3>
          <ProductPrice
            variant={variant}
            variants={variants.filter((item) => item != null)}
            isVariant={isVariant}
            currencySymbol={product.pricing_context?.currency_symbol}
          />
        </div>
      </Link>
      <div className="px-3 pt-3 pb-3 sm:px-4 sm:pb-4">
        {isVariant ? (
          <Link
            href={getProductRoutePath(product.slug)}
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-4 sm:text-sm"
          >
            {t("selectOption")}
          </Link>
        ) : (
          <AddToCartButton slug={product.slug} name={name} />
        )}
      </div>
    </article>
  );
}
