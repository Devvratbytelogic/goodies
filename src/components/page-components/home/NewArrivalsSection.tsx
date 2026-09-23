"use client";

import { useTranslations } from "next-intl";
import ProductSlider from "@/components/product/ProductSlider";
import type { ProductCardItem } from "@/components/product/ProductCard";

const newArrivals: ProductCardItem[] = [
  {
    slug: "natural-vanilla-mango-icy",
    image: "/images/home/new-arrivals/vanilla-mango.webp",
    categoryKey: "iceCream",
    nameKey: "vanillaMangoIcy",
    priceFrom: 32,
    isNew: true,
  },
  {
    slug: "orange-mango-icy-with-real-fruits",
    image: "/images/home/new-arrivals/orange-mango.webp",
    categoryKey: "iceCream",
    nameKey: "orangeMangoIcy",
    priceFrom: 32,
    isNew: true,
  },
  {
    slug: "blueberry-vanilla-icy-with-blueberry-pieces",
    image: "/images/home/new-arrivals/blueberry-vanilla.webp",
    categoryKey: "iceCream",
    nameKey: "blueberryVanillaIcy",
    priceFrom: 32,
    isNew: true,
  },
  {
    slug: "strawberry-vanilla-icy-with-real-strawberry-pieces",
    image: "/images/home/new-arrivals/strawberry-vanilla.webp",
    categoryKey: "iceCream",
    nameKey: "strawberryVanillaIcy",
    priceFrom: 32,
    isNew: true,
  },
  {
    slug: "pure-mango-icecream",
    image: "/images/home/new-arrivals/pure-mango.webp",
    categoryKey: "iceCream",
    nameKey: "pureMangoIceCream",
    priceFrom: 32,
    isNew: true,
  },
  {
    slug: "crunchy-mango-waffle-snack",
    image: "/images/home/new-arrivals/mango-waffle.webp",
    categoryKey: "candy",
    nameKey: "mangoWaffle",
    priceFrom: 42,
    isNew: true,
  },
  {
    slug: "crunchy-choco-brownies-icy",
    image: "/images/home/new-arrivals/choco-brownies.webp",
    categoryKey: "iceCream",
    nameKey: "chocoBrowniesIcy",
    priceFrom: 25,
    isNew: true,
  },
  {
    slug: "crunchy-strawberry-cashew-snack",
    image: "/images/home/new-arrivals/strawberry-cashew.webp",
    categoryKey: "candy",
    nameKey: "strawberryCashew",
    priceFrom: 35,
    isNew: true,
  },
];

export default function NewArrivalsSection() {
  const t = useTranslations("NewArrivalsSection");

  return (
    <ProductSlider
      id="new-arrivals"
      variant="decorated"
      title={t("title")}
      seeAllLabel={t("seeAll")}
      previousLabel={t("previous")}
      nextLabel={t("next")}
      products={newArrivals}
    />
  );
}
