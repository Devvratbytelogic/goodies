import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { HomeProduct } from "@/server/types/Home";

const ProductSlider = dynamic(() => import("@/components/product/ProductSlider"));

export default function NewArrivalsSection({ newArrivals }: { newArrivals: HomeProduct[] }) {
  const t = useTranslations("NewArrivalsSection");

  return (
    <ProductSlider
      id="new-arrivals"
      title={t("title")}
      seeAllLabel={t("seeAll")}
      previousLabel={t("previous")}
      nextLabel={t("next")}
      products={newArrivals ?? []}
    />
  );
}
