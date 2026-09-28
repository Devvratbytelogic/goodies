import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import { getProductBySlug } from "@/data/products";
import { sampleCart, sampleShipping } from "@/data/sampleCart";
import { getCartRoutePath, getHomeRoutePath, getShopRoutePath } from "@/utils/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CheckoutClassicPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CheckoutClassicPage() {
  const t = await getTranslations("CheckoutClassicPage");
  const cards = await getTranslations("ProductCard");
  const nav = await getTranslations("Nav");
  const cart = await getTranslations("CartPage");
  const lines = sampleCart.map((item) => {
    const product = getProductBySlug(item.slug);
    if (!product) {
      throw new Error(`Missing checkout product: ${item.slug}`);
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
          { label: cart("title"), href: getCartRoutePath() },
          { label: t("title") },
        ]}
      />
      {/* <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1> */}
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
        <CheckoutForm shopHref={getShopRoutePath()} />
        <CheckoutSummary lines={lines} shipping={sampleShipping} />
      </div>
    </div>
  );
}
