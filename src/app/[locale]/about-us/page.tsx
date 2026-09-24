import { getTranslations } from "next-intl/server";
import { LuChevronRight } from "react-icons/lu";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { Link } from "@/i18n/navigation";
import { getHomeRoutePath } from "@/utils/routes";

export async function generateMetadata() {
  const t = await getTranslations("AboutUsPage");
  return {
    title: t("title"),
    description: t("welcome"),
  };
}

export default async function AboutUsPage() {
  const t = await getTranslations("AboutUsPage");
  const nav = await getTranslations("Nav");
  const love = await getTranslations("MadeWithLoveSection");

  return (
    <div>
      <section className="relative isolate min-h-80 w-full overflow-hidden sm:min-h-96 lg:min-h-112">
        <div className="absolute inset-0">
          <ImageComponent
            src="/images/home/pastel-sweets.webp"
            alt={love("imageAlt")}
            width={1500}
            height={857}
            objectFit="cover"
            sizes="100vw"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-black/75 via-black/50 to-black/35"
        />

        <div className="container relative z-10 flex min-h-80 flex-col justify-end py-8 sm:min-h-96 sm:py-10 lg:min-h-112 lg:py-14">
          <nav aria-label={t("breadcrumb")}>
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/80">
              <li>
                <Link
                  href={getHomeRoutePath()}
                  className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {nav("home")}
                </Link>
              </li>
              <li aria-hidden className="flex items-center text-white/60">
                <LuChevronRight className="size-3.5 rtl:-scale-x-100" />
              </li>
              <li className="font-medium text-white" aria-current="page">
                {t("title")}
              </li>
            </ol>
          </nav>

          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white! text-balance drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
        </div>
      </section>

      <section className="container section_y_space">
        <div className="mx-auto max-w-3xl space-y-5 text-sm leading-relaxed text-muted sm:text-[15px] sm:leading-7">
          <p>{t("welcome")}</p>
          <p>{t("sourcing")}</p>
          <p>{t("fusion")}</p>
          <p>{t("community")}</p>
        </div>
      </section>

      <section className="relative isolate min-h-72 w-full overflow-hidden bg-primary sm:min-h-80">
        <ImageComponent
          src="/images/home/tasty-choices-pattern.webp"
          alt=""
          width={800}
          height={533}
          aria-hidden
          objectFit="cover"
          sizes="100vw"
          className="pointer-events-none absolute inset-0 opacity-[0.22]"
        />
        <div className="relative z-10 mx-auto flex min-h-72 max-w-3xl flex-col items-center justify-center px-5 py-14 text-center sm:min-h-80 sm:px-8 sm:py-16">
          <h2 className="text-2xl font-bold tracking-tight text-primary-foreground! text-balance sm:text-3xl lg:text-4xl">
            {love("title")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-foreground/90 sm:mt-4 sm:text-[15px] sm:leading-7">
            {love("description")}
          </p>
        </div>
      </section>
    </div>
  );
}
