import { getTranslations } from "next-intl/server";
import { LuMail, LuMapPin, LuPhone } from "react-icons/lu";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import ImageComponent from "@/components/layout/common/ImageComponent";
import ContactForm from "@/components/page-components/contact/ContactForm";
import { EMAIL, PHONE_HREF, PHONE_LABEL } from "@/constants/contact";
import { getHomeRoutePath } from "@/utils/routes";

export async function generateMetadata() {
  const t = await getTranslations("ContactUsPage");
  return {
    title: t("title"),
    description: t("getInTouch"),
  };
}

export default async function ContactUsPage() {
  const t = await getTranslations("ContactUsPage");
  const nav = await getTranslations("Nav");
  const love = await getTranslations("MadeWithLoveSection");

  const details = [
    {
      key: "address" as const,
      value: t("addressValue"),
      href: null,
      icon: LuMapPin,
    },
    {
      key: "phone" as const,
      value: PHONE_LABEL,
      href: `tel:${PHONE_HREF}`,
      icon: LuPhone,
    },
    {
      key: "email" as const,
      value: EMAIL,
      href: `mailto:${EMAIL}`,
      icon: LuMail,
    },
  ];

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
          <Breadcrumbs
            variant="hero"
            items={[
              { label: nav("home"), href: getHomeRoutePath() },
              { label: t("title") },
            ]}
          />

          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white! text-balance drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
        </div>
      </section>

      <section className="container section_y_space">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl">
              {t("getInTouch")}
            </h2>
            <ul className="mt-6 space-y-5">
              {details.map(({ key, value, href, icon: Icon }) => (
                <li key={key} className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Icon aria-hidden className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                      {t(key)}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="mt-1 block break-all text-base font-semibold text-heading hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1 text-base font-semibold text-heading">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <ContactForm />
        </div>
      </section>
    </div>
  );
}
