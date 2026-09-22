"use client";

import { useLocale } from "next-intl";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { A11y, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "@/i18n/navigation";
import ProductCard, { type ProductCardItem } from "@/components/product/ProductCard";
import { getShopRoutePath } from "@/utils/routes";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const navButtonClass =
  "product-slider-nav hidden size-9 items-center justify-center rounded-full border border-border/70 text-icon-muted transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-35 sm:flex";

type ProductSliderProps = {
  id: string;
  title: string;
  seeAllLabel: string;
  previousLabel: string;
  nextLabel: string;
  products: ProductCardItem[];
};

export default function ProductSlider({
  id,
  title,
  seeAllLabel,
  previousLabel,
  nextLabel,
  products,
}: ProductSliderProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const prevClass = `${id}-prev`;
  const nextClass = `${id}-next`;

  return (
    <section className="container section_y_space">
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <h2 className="text-xl font-bold text-heading sm:text-2xl">{title}</h2>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 sm:flex">
            <button type="button" className={`${prevClass} ${navButtonClass}`} aria-label={previousLabel}>
              <LuChevronLeft aria-hidden className="size-5 rtl:-scale-x-100" />
            </button>
            <button type="button" className={`${nextClass} ${navButtonClass}`} aria-label={nextLabel}>
              <LuChevronRight aria-hidden className="size-5 rtl:-scale-x-100" />
            </button>
          </div>

          <Link
            href={getShopRoutePath()}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
          >
            {seeAllLabel}
            <LuChevronRight aria-hidden className="size-4 rtl:-scale-x-100" />
          </Link>
        </div>
      </div>

      <Swiper
        key={locale}
        dir={isRtl ? "rtl" : "ltr"}
        modules={[Navigation, Pagination, A11y]}
        className="product-swiper"
        slidesPerView={2}
        spaceBetween={10}
        watchOverflow
        grabCursor
        navigation={{
          prevEl: `.${prevClass}`,
          nextEl: `.${nextClass}`,
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          480: { slidesPerView: 1.7, spaceBetween: 12 },
          640: { slidesPerView: 2.2, spaceBetween: 16 },
          768: { slidesPerView: 2.7, spaceBetween: 16 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.slug} className="h-auto!">
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
