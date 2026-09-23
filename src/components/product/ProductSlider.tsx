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
  variant?: "default" | "decorated";
};

export default function ProductSlider({
  id,
  title,
  seeAllLabel,
  previousLabel,
  nextLabel,
  products,
  variant = "default",
}: ProductSliderProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const prevClass = `${id}-prev`;
  const nextClass = `${id}-next`;
  const isDecorated = variant === "decorated";

  const content = (
    <>
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
        slidesPerView={1.8}
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
    </>
  );

  return (
    <section className={`container section_y_space`}>
      {isDecorated ? (
        <div className={`relative overflow-hidden rounded-3xl sm:rounded-4xl bg-linear-to-br from-primary-soft/55 via-background to-[#f7f1e6]/45 px-3 py-6 ring-1 ring-black/4 sm:px-6 sm:py-8 lg:px-8 lg:py-10`}>
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-s-24 -top-24 size-64 rounded-full bg-primary/15 blur-3xl sm:size-80"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-s-8 -top-8 size-24 rounded-full border-10 border-primary/20 sm:size-32 sm:border-12"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-e-20 -bottom-20 size-56 rounded-full bg-accent/20 blur-3xl sm:size-72"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-e-10 -bottom-10 size-28 rounded-full border-12 border-accent/30 sm:size-36 sm:border-14"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-e-16 top-1/2 size-3 -translate-y-1/2 rounded-full bg-primary/30 sm:size-4"
          />
          <div className="relative">{content}</div>
        </div>
      ) : (
        content
      )}
    </section>
  );
}
