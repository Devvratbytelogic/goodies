import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const ProductSlider = dynamic(() => import("@/components/product/ProductSlider"));
import type { ProductCardItem } from "@/components/product/ProductCard";

const bestSellers: ProductCardItem[] = [
  {
    slug: "fd-coconut",
    image: "/images/home/bestsellers/coconut.webp",
    categoryKey: "fruits",
    nameKey: "coconut",
    priceFrom: 25,
    priceTo: 75,
  },
  {
    slug: "strawberry-crunchy-sour-snack",
    image: "/images/home/bestsellers/sour-strawberry.webp",
    categoryKey: "fruits",
    nameKey: "sourStrawberry",
    priceFrom: 27,
    priceTo: 79,
  },
  {
    slug: "fd-mixed-vegetables",
    image: "/images/home/bestsellers/mixed-vegetables.webp",
    categoryKey: "vegetables",
    nameKey: "mixedVegetables",
    priceFrom: 39,
    priceTo: 45,
  },
  {
    slug: "crunchy-sweet-strawberry-snack",
    image: "/images/home/bestsellers/sweet-strawberry.webp",
    categoryKey: "fruits",
    nameKey: "sweetStrawberry",
    priceFrom: 25,
    priceTo: 75,
  },
];

export default function BestSellerSection() {
  const t = useTranslations("BestSellerSection");

  return (
    <ProductSlider
      id="best-sellers"
      // variant="decorated"
      title={t("title")}
      seeAllLabel={t("seeAll")}
      previousLabel={t("previous")}
      nextLabel={t("next")}
      products={bestSellers}
    />
  );
}
