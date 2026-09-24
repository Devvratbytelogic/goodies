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

export type ProductSizeId = "small" | "medium";

export type ProductSize = {
  id: ProductSizeId;
  price: number;
};

export type ProductCardItem = {
  slug: string;
  image: string;
  categoryKey: ProductCategoryKey;
  nameKey: ProductNameKey;
  priceFrom: number;
  priceTo?: number;
  isNew?: boolean;
};

export type CatalogProduct = ProductCardItem & {
  images: string[];
  sizes: ProductSize[];
};

function product(
  item: ProductCardItem,
): CatalogProduct {
  const sizes: ProductSize[] = item.priceTo
    ? [
        { id: "small", price: item.priceFrom },
        { id: "medium", price: item.priceTo },
      ]
    : [];

  return {
    ...item,
    images: [item.image],
    sizes,
  };
}

const catalog: CatalogProduct[] = [
  product({
    slug: "fd-coconut",
    image: "/images/home/bestsellers/coconut.webp",
    categoryKey: "fruits",
    nameKey: "coconut",
    priceFrom: 25,
    priceTo: 75,
  }),
  product({
    slug: "strawberry-crunchy-sour-snack",
    image: "/images/home/bestsellers/sour-strawberry.webp",
    categoryKey: "fruits",
    nameKey: "sourStrawberry",
    priceFrom: 27,
    priceTo: 79,
  }),
  product({
    slug: "fd-mixed-vegetables",
    image: "/images/home/bestsellers/mixed-vegetables.webp",
    categoryKey: "vegetables",
    nameKey: "mixedVegetables",
    priceFrom: 39,
    priceTo: 45,
  }),
  product({
    slug: "crunchy-sweet-strawberry-snack",
    image: "/images/home/bestsellers/sweet-strawberry.webp",
    categoryKey: "fruits",
    nameKey: "sweetStrawberry",
    priceFrom: 25,
    priceTo: 75,
  }),
  product({
    slug: "natural-vanilla-mango-icy",
    image: "/images/home/new-arrivals/vanilla-mango.webp",
    categoryKey: "iceCream",
    nameKey: "vanillaMangoIcy",
    priceFrom: 32,
    isNew: true,
  }),
  product({
    slug: "orange-mango-icy-with-real-fruits",
    image: "/images/home/new-arrivals/orange-mango.webp",
    categoryKey: "iceCream",
    nameKey: "orangeMangoIcy",
    priceFrom: 32,
    isNew: true,
  }),
  product({
    slug: "blueberry-vanilla-icy-with-blueberry-pieces",
    image: "/images/home/new-arrivals/blueberry-vanilla.webp",
    categoryKey: "iceCream",
    nameKey: "blueberryVanillaIcy",
    priceFrom: 32,
    isNew: true,
  }),
  product({
    slug: "strawberry-vanilla-icy-with-real-strawberry-pieces",
    image: "/images/home/new-arrivals/strawberry-vanilla.webp",
    categoryKey: "iceCream",
    nameKey: "strawberryVanillaIcy",
    priceFrom: 32,
    isNew: true,
  }),
  product({
    slug: "pure-mango-icecream",
    image: "/images/home/new-arrivals/pure-mango.webp",
    categoryKey: "iceCream",
    nameKey: "pureMangoIceCream",
    priceFrom: 32,
    isNew: true,
  }),
  product({
    slug: "crunchy-mango-waffle-snack",
    image: "/images/home/new-arrivals/mango-waffle.webp",
    categoryKey: "candy",
    nameKey: "mangoWaffle",
    priceFrom: 42,
    isNew: true,
  }),
  product({
    slug: "crunchy-choco-brownies-icy",
    image: "/images/home/new-arrivals/choco-brownies.webp",
    categoryKey: "iceCream",
    nameKey: "chocoBrowniesIcy",
    priceFrom: 25,
    isNew: true,
  }),
  product({
    slug: "crunchy-strawberry-cashew-snack",
    image: "/images/home/new-arrivals/strawberry-cashew.webp",
    categoryKey: "candy",
    nameKey: "strawberryCashew",
    priceFrom: 35,
    isNew: true,
  }),
];

const bestSellerSlugs = [
  "fd-coconut",
  "strawberry-crunchy-sour-snack",
  "fd-mixed-vegetables",
  "crunchy-sweet-strawberry-snack",
];

const newArrivalSlugs = [
  "natural-vanilla-mango-icy",
  "orange-mango-icy-with-real-fruits",
  "blueberry-vanilla-icy-with-blueberry-pieces",
  "strawberry-vanilla-icy-with-real-strawberry-pieces",
  "pure-mango-icecream",
  "crunchy-mango-waffle-snack",
  "crunchy-choco-brownies-icy",
  "crunchy-strawberry-cashew-snack",
];

function requireProduct(slug: string) {
  const found = catalog.find((item) => item.slug === slug);
  if (!found) {
    throw new Error(`Missing product: ${slug}`);
  }
  return found;
}

function toCard(item: CatalogProduct): ProductCardItem {
  return {
    slug: item.slug,
    image: item.image,
    categoryKey: item.categoryKey,
    nameKey: item.nameKey,
    priceFrom: item.priceFrom,
    priceTo: item.priceTo,
    isNew: item.isNew,
  };
}

export const bestSellers: ProductCardItem[] = bestSellerSlugs.map((slug) => toCard(requireProduct(slug)));

export const newArrivals: ProductCardItem[] = newArrivalSlugs.map((slug) => toCard(requireProduct(slug)));

export function getProductBySlug(slug: string) {
  return catalog.find((item) => item.slug === slug);
}

export function getAllProductSlugs() {
  return catalog.map((item) => item.slug);
}

export function getRelatedProducts(slug: string, limit = 4): ProductCardItem[] {
  const current = getProductBySlug(slug);
  if (!current) {
    return [];
  }

  const others = catalog.filter((item) => item.slug !== slug);
  const sameCategory = others.filter((item) => item.categoryKey === current.categoryKey);
  const rest = others.filter((item) => item.categoryKey !== current.categoryKey);

  return [...sameCategory, ...rest].slice(0, limit).map(toCard);
}
