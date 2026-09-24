import { useTranslations } from "next-intl";
import { LuChevronRight } from "react-icons/lu";
import { Link } from "@/i18n/navigation";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { getProductCategoryRoutePath, getShopRoutePath } from "@/utils/routes";

type Category = {
  key: "fruits" | "iceCream" | "vegetables" | "candy";
  slug: string;
  image: string;
  height: number;
  borderClass: string;
};

const categories: Category[] = [
  { key: "fruits", slug: "fruits", image: "/images/home/cat1.webp", height: 290, borderClass: "border-[#e84a8a]" },
  { key: "iceCream", slug: "ice-cream", image: "/images/home/cat2.webp", height: 295, borderClass: "border-[#9b7ed9]" },
  { key: "vegetables", slug: "vegetables", image: "/images/home/cat3.webp", height: 291, borderClass: "border-[#2cb4c1]" },
  { key: "candy", slug: "candy", image: "/images/home/cat4.webp", height: 295, borderClass: "border-[#f08a4b]" },
];

const cardClassName =
  "aspect-16/7 lg:aspect-16/5 block overflow-hidden rounded-lg border sm:rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function CategorySection() {
  const t = useTranslations("CategorySection");

  return (
    <section className="container section_y_space">
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <h2 className="text-xl font-bold text-heading sm:text-2xl">{t("title")}</h2>
        <Link
          href={getShopRoutePath()}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
        >
          {t("seeAll")}
          <LuChevronRight aria-hidden className="size-4 rtl:-scale-x-100" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        {categories.map((category) => (
          <Link
            key={category.key}
            href={getProductCategoryRoutePath(category.slug)}
            className={`${cardClassName} ${category.borderClass}`}
          >
            <ImageComponent
              src={category.image}
              alt={t(category.key)}
              width={887}
              height={444}
              objectFit="cover"
              sizes="(max-width: 1024px) 48vw, 40vw"
            />
          </Link>
        ))}
      </div>

      <Link
        href={getShopRoutePath()}
        className={`${cardClassName} mt-2 sm:mt-4 border-[#037f91]`}
      >
        <ImageComponent
          src="/images/home/cat5.webp"
          alt={t("boxDeals")}
          width={887}
          height={444}
          objectFit="cover"
          sizes="(max-width: 1024px) 96vw, 80vw"
        />
      </Link>
    </section>
  );
}
