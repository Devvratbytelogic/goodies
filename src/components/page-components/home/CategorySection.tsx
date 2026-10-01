import { useTranslations } from "next-intl";
import { LuChevronRight } from "react-icons/lu";
import { Link } from "@/i18n/navigation";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { getProductCategoryRoutePath, getShopRoutePath } from "@/utils/routes";
import { HomeCategory } from "@/server/types/Home";

const cardClassName =
  "aspect-16/7 lg:aspect-16/5 block overflow-hidden rounded-lg border sm:rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const borderClasses = ["border-[#e84a8a]", "border-[#9b7ed9]", "border-[#2cb4c1]", "border-[#f08a4b]"];

export default function CategorySection({ categories }: { categories: HomeCategory[] }) {
  const t = useTranslations("CategorySection");
  const lastIsWide = categories.length % 2 === 1;

  return (
    <section className="container section_y_space">
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <h2 className="text-xl font-bold text-heading sm:text-2xl">{t("title")}</h2>
        <Link href={getShopRoutePath()} className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          {t("seeAll")}
          <LuChevronRight aria-hidden className="size-4 rtl:-scale-x-100" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        {categories.map((category, index) => {
          const wide = lastIsWide && index === categories.length - 1;
          return (
            <Link
              key={category.slug}
              href={getProductCategoryRoutePath(category.slug)}
              className={`${cardClassName} ${borderClasses[index % borderClasses.length]} ${wide ? "col-span-2" : ""}`}
            >
              <ImageComponent
                src={category.image ?? "/images/image-fallback.svg"}
                alt={category.name}
                width={887}
                height={444}
                objectFit="cover"
                sizes={wide ? "(max-width: 1024px) 96vw, 80vw" : "(max-width: 1024px) 48vw, 40vw"}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
