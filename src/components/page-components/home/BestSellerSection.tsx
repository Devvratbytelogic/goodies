import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
// import { bestSellers } from "@/data/products";
import { HomeProduct } from "@/server/types/Home";

const ProductSlider = dynamic(() => import("@/components/product/ProductSlider"));

export default function BestSellerSection({ bestSellers }: { bestSellers: HomeProduct[] }) {
  const t = useTranslations("BestSellerSection");

  return (
    <ProductSlider
      id="best-sellers"
      title={t("title")}
      seeAllLabel={t("seeAll")}
      previousLabel={t("previous")}
      nextLabel={t("next")}
      products={bestSellers}
    />
  );
}
