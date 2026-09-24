import { useLocale, useTranslations } from "next-intl";
import type { IconType } from "react-icons";
import { LuArrowRight, LuGift, LuHeart, LuLeaf, LuSnowflake } from "react-icons/lu";
import { Link } from "@/i18n/navigation";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { getShopRoutePath } from "@/utils/routes";

const highlights: { key: "natural" | "freezeDried" | "kidApproved" | "giftReady"; icon: IconType }[] = [
  { key: "natural", icon: LuLeaf },
  { key: "freezeDried", icon: LuSnowflake },
  { key: "kidApproved", icon: LuHeart },
  { key: "giftReady", icon: LuGift },
];

export default function TastyChoicesSection() {
  const t = useTranslations("TastyChoicesSection");
  const locale = useLocale();
  const shopHref = getShopRoutePath();

  return (
    <section className="container section_y_space">
      <div
        dir="ltr"
        className="overflow-hidden rounded-2xl bg-primary shadow-[0_12px_40px_rgba(214,7,81,0.12)] lg:grid lg:grid-cols-2"
      >
        <Link
          href={shopHref}
          className="relative block aspect-video h-full overflow-hidden bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:aspect-auto"
        >
          <ImageComponent
            src="/images/home/orchard-process.webp"
            alt={t("imageAlt")}
            width={1600}
            height={900}
            objectFit="cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Link>

        <div
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="relative flex flex-col justify-center px-5 py-7 text-primary-foreground sm:px-8 sm:py-10 lg:px-12"
        >
          <ImageComponent
            src="/images/home/tasty-choices-pattern.webp"
            alt=""
            width={800}
            height={533}
            aria-hidden
            objectFit="cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="pointer-events-none absolute inset-0 opacity-[0.22]"
          />

          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/70 sm:text-xs">
              {t("eyebrow")}
            </p>
            <h2 className="mt-2 text-2xl font-bold leading-tight text-primary-foreground! sm:text-3xl lg:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-primary-foreground/90 sm:mt-4 sm:text-[15px]">
              {t("description")}
            </p>

            <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-3 sm:mt-6">
              {highlights.map(({ key, icon: Icon }) => (
                <li key={key} className="flex items-center gap-2.5 text-xs font-medium sm:text-sm">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
                    <Icon aria-hidden className="size-4" />
                  </span>
                  {t(key)}
                </li>
              ))}
            </ul>

            <Link
              href={shopHref}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-foreground sm:mt-8"
            >
              {t("shopNow")}
              <LuArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
