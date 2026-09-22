import { useTranslations } from "next-intl";
import ImageComponent from "@/components/layout/common/ImageComponent";
import InstallAppBanner from "@/components/page-components/home/InstallAppBanner";

export default function MadeWithLoveSection() {
  const t = useTranslations("MadeWithLoveSection");

  return (
    <section className="section_y_space">
      <div className="relative isolate min-h-80 w-full overflow-hidden sm:min-h-96 lg:min-h-105">
        <div className="absolute inset-0">
          <ImageComponent
            src="/images/home/pastel-sweets.webp"
            alt={t("imageAlt")}
            width={1500}
            height={857}
            objectFit="cover"
            sizes="100vw"
          />
        </div>

        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/15"
        />

        <div className="relative z-10 mx-auto flex min-h-80 max-w-3xl flex-col items-center justify-center px-5 py-16 text-center sm:min-h-96 sm:px-8 sm:py-20 lg:min-h-105">
          <p className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent sm:text-xs">
            <span aria-hidden className="hidden h-px w-6 bg-accent/60 sm:block" />
            {t("eyebrow")}
            <span aria-hidden className="hidden h-px w-6 bg-accent/60 sm:block" />
          </p>
          <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-white! text-balance drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-3xl lg:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)] sm:mt-4 sm:text-[15px] sm:leading-7">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="container relative z-10 -mt-6 sm:-mt-8">
        <div className="mx-auto max-w-xl sm:max-w-2xl lg:max-w-3xl">
          <InstallAppBanner />
        </div>
      </div>
    </section>
  );
}
