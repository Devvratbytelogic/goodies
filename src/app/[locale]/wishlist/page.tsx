import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import WishlistDetails from "@/components/wishlist/WishlistDetails";
import { getProductBySlug } from "@/data/products";
import { sampleWishlist } from "@/data/sampleWishlist";
import { getHomeRoutePath } from "@/utils/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("WishlistPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function WishlistPage() {
  const t = await getTranslations("WishlistPage");
  const cards = await getTranslations("ProductCard");
  const nav = await getTranslations("Nav");
  const items = sampleWishlist.map((slug) => {
    const product = getProductBySlug(slug);
    if (!product) {
      throw new Error(`Missing wishlist product: ${slug}`);
    }

    return {
      slug: product.slug,
      name: cards(product.nameKey),
      image: product.image,
      category: cards(product.categoryKey),
      priceFrom: product.priceFrom,
      priceTo: product.priceTo,
      isNew: product.isNew,
    };
  });

  return (
    <div className="container section_y_space">
      <Breadcrumbs
        className="mb-4"
        items={[
          { label: nav("home"), href: getHomeRoutePath() },
          { label: t("title") },
        ]}
      />
      {/* <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1> */}
      <WishlistDetails items={items} />
    </div>
  );
}
