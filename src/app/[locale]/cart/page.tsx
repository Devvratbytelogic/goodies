import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CartDetails from "@/components/cart/CartDetails";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import { getProductBySlug } from "@/data/products";
import { sampleCart, sampleShipping } from "@/data/sampleCart";
import { getCheckoutClassicRoutePath, getHomeRoutePath } from "@/utils/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CartPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CartPage() {
  const t = await getTranslations("CartPage");
  const cards = await getTranslations("ProductCard");
  const nav = await getTranslations("Nav");
  const lines = sampleCart.map((item) => {
    const product = getProductBySlug(item.slug);
    if (!product) {
      throw new Error(`Missing cart product: ${item.slug}`);
    }

    return {
      slug: item.slug,
      name: cards(product.nameKey),
      image: product.image,
      price: item.price,
      quantity: item.quantity,
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

      <CartDetails lines={lines} shipping={sampleShipping} checkoutHref={getCheckoutClassicRoutePath()} />
    </div>
  );
}
