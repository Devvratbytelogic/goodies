"use client";

import { useLocale, useTranslations } from "next-intl";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { A11y, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "@/i18n/navigation";
import ProductCard, { type ProductCardItem } from "@/components/product/ProductCard";
import { getShopRoutePath } from "@/utils/routes";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const bestSellers: ProductCardItem[] = [
  {
    slug: "fd-coconut",
    image: "/images/home/bestsellers/coconut.webp",
    categoryKey: "fruits",
    nameKey: "coconut",
    priceFrom: 25,
    priceTo: 75,
    isNew: true,
  },
  {
    slug: "strawberry-crunchy-sour-snack",
    image: "/images/home/bestsellers/sour-strawberry.webp",
    categoryKey: "fruits",
    nameKey: "sourStrawberry",
    priceFrom: 27,
    priceTo: 79,
    isNew: true,
  },
  {
    slug: "fd-mixed-vegetables",
    image: "/images/home/bestsellers/mixed-vegetables.webp",
    categoryKey: "vegetables",
    nameKey: "mixedVegetables",
    priceFrom: 39,
    priceTo: 45,
    isNew: true,
  },
  {
    slug: "crunchy-sweet-strawberry-snack",
    image: "/images/home/bestsellers/sweet-strawberry.webp",
    categoryKey: "fruits",
    nameKey: "sweetStrawberry",
    priceFrom: 25,
    priceTo: 75,
    isNew: true,
  },
];

const navButtonClass =
  "hidden size-9 items-center justify-center rounded-full border border-border/70 text-icon-muted transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-35 sm:flex";

export default function BestSellerSection() {
  const t = useTranslations("BestSellerSection");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <section className="container section_y_space">
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <h2 className="text-xl font-bold text-heading sm:text-2xl">{t("title")}</h2>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 sm:flex">
            <button type="button" className={`best-seller-prev ${navButtonClass}`} aria-label={t("previous")}>
              <LuChevronLeft aria-hidden className="size-5 rtl:-scale-x-100" />
            </button>
            <button type="button" className={`best-seller-next ${navButtonClass}`} aria-label={t("next")}>
              <LuChevronRight aria-hidden className="size-5 rtl:-scale-x-100" />
            </button>
          </div>

          <Link
            href={getShopRoutePath()}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
          >
            {t("seeAll")}
            <LuChevronRight aria-hidden className="size-4 rtl:-scale-x-100" />
          </Link>
        </div>
      </div>

      <Swiper
        key={locale}
        dir={isRtl ? "rtl" : "ltr"}
        modules={[Navigation, Pagination, A11y]}
        className="best-seller-swiper"
        slidesPerView={2}
        spaceBetween={10}
        watchOverflow
        grabCursor
        navigation={{
          prevEl: ".best-seller-prev",
          nextEl: ".best-seller-next",
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          480: { slidesPerView: 1.7, spaceBetween: 12 },
          640: { slidesPerView: 2.2, spaceBetween: 16 },
          768: { slidesPerView: 2.7, spaceBetween: 16 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
        }}
      >
        {bestSellers.map((product) => (
          <SwiperSlide key={product.slug} className="h-auto!">
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
