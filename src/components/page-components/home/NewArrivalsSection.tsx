import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { newArrivals } from "@/data/products";

const ProductSlider = dynamic(() => import("@/components/product/ProductSlider"));

export default function NewArrivalsSection() {
  const t = useTranslations("NewArrivalsSection");

  return (
    <ProductSlider
      id="new-arrivals"
      title={t("title")}
      seeAllLabel={t("seeAll")}
      previousLabel={t("previous")}
      nextLabel={t("next")}
      products={newArrivals}
    />
  );
}
