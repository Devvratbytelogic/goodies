import { useTranslations } from "next-intl";
import type { IconType } from "react-icons";
import { FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa6";
import { LuHeart, LuMail, LuMapPin, LuPhone } from "react-icons/lu";
import { Link } from "@/i18n/navigation";
import ImageComponent from "@/components/layout/common/ImageComponent";
import {
  getAboutUsRoutePath,
  getContactUsRoutePath,
  getHomeRoutePath,
  getProductCategoryRoutePath,
  getShopRoutePath,
  getWishlistRoutePath,
} from "@/utils/routes";

const EMAIL = "Shremzeina@gmail.com";
const PHONE_HREF = "+971589700754";
const PHONE_LABEL = "+971 58 970 0754";

const shopLinks = [
  { key: "allProducts" as const, href: getShopRoutePath() },
  { key: "fruits" as const, href: getProductCategoryRoutePath("fruits") },
  { key: "iceCream" as const, href: getProductCategoryRoutePath("ice-cream") },
  { key: "vegetables" as const, href: getProductCategoryRoutePath("vegetables") },
  { key: "candy" as const, href: getProductCategoryRoutePath("candy") },
  { key: "boxDeals" as const, href: getShopRoutePath() },
];

const quickLinks = [
  { key: "home" as const, href: getHomeRoutePath() },
  { key: "aboutUs" as const, href: getAboutUsRoutePath() },
  { key: "shop" as const, href: getShopRoutePath() },
  { key: "wishlist" as const, href: getWishlistRoutePath() },
  { key: "contactUs" as const, href: getContactUsRoutePath() },
];

const socialLinks: { key: "instagram" | "youtube" | "whatsapp"; href: string; icon: IconType }[] = [
  {
    key: "instagram",
    href: "https://www.instagram.com/qarqusha.goodies",
    icon: FaInstagram,
  },
  {
    key: "youtube",
    href: "https://www.youtube.com/@zeinashrem7499",
    icon: FaYoutube,
  },
  {
    key: "whatsapp",
    href: `https://wa.me/${PHONE_HREF}`,
    icon: FaWhatsapp,
  },
];

const columnTitleClass =
  "text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-deep";
const footerLinkClass =
  "text-sm text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const socialButtonClass =
  "flex size-10 items-center justify-center rounded-full bg-background text-primary shadow-[0_4px_12px_rgba(15,23,42,0.06)] ring-1 ring-border/70 transition-colors hover:bg-primary hover:text-primary-foreground hover:ring-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const mobileSocialClass: Record<(typeof socialLinks)[number]["key"], string> = {
  instagram:
    "bg-linear-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-[0_8px_18px_rgba(238,42,123,0.28)]",
  youtube: "bg-[#ff0033] text-white shadow-[0_8px_18px_rgba(255,0,51,0.28)]",
  whatsapp: "bg-[#128C7E] text-white shadow-[0_8px_18px_rgba(18,140,126,0.28)]",
};

function BrandMark({ logoClassName }: { logoClassName: string }) {
  const tHeader = useTranslations("Header");

  return (
    <Link
      href={getHomeRoutePath()}
      aria-label={tHeader("brandHome")}
      className="inline-flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <ImageComponent
        src="/logo/logo.webp"
        alt="Goodies"
        width={1100}
        height={1100}
        className={logoClassName}
      />
    </Link>
  );
}

function SocialLinks() {
  const t = useTranslations("Footer");

  return (
    <ul className="flex items-center gap-2.5">
      {socialLinks.map(({ key, href, icon: Icon }) => (
        <li key={key}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(key)}
            className={socialButtonClass}
          >
            <Icon aria-hidden className="size-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}

function ContactList() {
  const t = useTranslations("Footer");

  return (
    <ul className="flex flex-col gap-3">
      <li>
        <a
          href={`mailto:${EMAIL}`}
          className={`inline-flex items-center gap-2.5 ${footerLinkClass}`}
        >
          <LuMail aria-hidden className="size-4 shrink-0 text-primary" />
          {EMAIL}
        </a>
      </li>
      <li>
        <a
          href={`tel:${PHONE_HREF}`}
          className={`inline-flex items-center gap-2.5 ${footerLinkClass}`}
        >
          <LuPhone aria-hidden className="size-4 shrink-0 text-primary" />
          {PHONE_LABEL}
        </a>
      </li>
      <li className="inline-flex items-center gap-2.5 text-sm text-muted">
        <LuMapPin aria-hidden className="size-4 shrink-0 text-primary" />
        {t("location")}
      </li>
    </ul>
  );
}

function MobileFooter() {
  const t = useTranslations("Footer");
  const tHeader = useTranslations("Header");

  const contactItems = [
    {
      key: "email",
      href: `mailto:${EMAIL}`,
      icon: LuMail,
      label: EMAIL,
      bubbleClass: "bg-primary-soft text-primary",
    },
    {
      key: "phone",
      href: `tel:${PHONE_HREF}`,
      icon: LuPhone,
      label: PHONE_LABEL,
      bubbleClass: "bg-accent/15 text-accent-deep",
    },
    {
      key: "location",
      href: null,
      icon: LuMapPin,
      label: t("location"),
      bubbleClass: "bg-primary-soft text-primary",
    },
  ] as const;

  return (
    <div className="container py-6 lg:hidden">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-linear-to-br from-primary-soft via-background to-accent/10 px-5 pt-7 pb-6 text-center shadow-[0_16px_40px_rgba(214,7,81,0.08)] ring-1 ring-primary/10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -inset-e-10 size-40 rounded-full bg-primary/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -inset-s-8 size-36 rounded-full bg-accent/20 blur-3xl"
        />

        <div className="relative flex flex-col items-center">
          <Link
            href={getHomeRoutePath()}
            aria-label={tHeader("brandHome")}
            className="relative block size-24 overflow-hidden rounded-full shadow-[0_10px_28px_rgba(214,7,81,0.16)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <ImageComponent
              src="/logo/logo.webp"
              alt="Goodies"
              width={300}
              height={300}
              className="size-full scale-[1.12] object-cover"
            />
          </Link>
          <p className="mt-4 text-base font-semibold tracking-tight text-heading">{t("tagline")}</p>
          <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-muted">{t("description")}</p>

          <p className={`${columnTitleClass} mt-6`}>{t("followUs")}</p>
          <ul className="mt-3 flex items-center gap-3">
            {socialLinks.map(({ key, href, icon: Icon }) => (
              <li key={key}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(key)}
                  className={`flex size-11 items-center justify-center rounded-full transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95 ${mobileSocialClass[key]}`}
                >
                  <Icon aria-hidden className="size-4.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ul className="mt-3 flex flex-col gap-2.5">
        {contactItems.map(({ key, href, icon: Icon, label, bubbleClass }) => {
          const content = (
            <>
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${bubbleClass}`}>
                <Icon aria-hidden className="size-4" />
              </span>
              <span className="min-w-0 break-all text-sm font-medium text-heading">{label}</span>
            </>
          );

          return (
            <li key={key}>
              {href ? (
                <a
                  href={href}
                  className="flex min-h-14 items-center gap-3 rounded-2xl bg-background px-3.5 py-2.5 shadow-[0_6px_18px_rgba(15,23,42,0.04)] ring-1 ring-border/60 transition-colors hover:ring-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {content}
                </a>
              ) : (
                <div className="flex min-h-14 items-center gap-3 rounded-2xl bg-background px-3.5 py-2.5 shadow-[0_6px_18px_rgba(15,23,42,0.04)] ring-1 ring-border/60">
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/40 bg-linear-to-b from-primary-soft/40 via-background to-surface">
      <MobileFooter />

      <div className="container hidden gap-10 py-10 sm:grid-cols-2 sm:py-12 lg:grid lg:gap-8 lg:py-14 xl:grid-cols-4">
        <div>
          <BrandMark logoClassName="h-30! w-auto" />
          <p className="mt-4 text-sm font-medium text-heading">{t("tagline")}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t("description")}</p>

          <p className={`${columnTitleClass} mt-6`}>{t("followUs")}</p>
          <div className="mt-3">
            <SocialLinks />
          </div>
        </div>

        <nav aria-labelledby="footer-shop-heading">
          <h2 id="footer-shop-heading" className={columnTitleClass}>
            {t("shop")}
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {shopLinks.map(({ key, href }) => (
              <li key={key}>
                <Link href={href} className={footerLinkClass}>
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-links-heading">
          <h2 id="footer-links-heading" className={columnTitleClass}>
            {t("quickLinks")}
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {quickLinks.map(({ key, href }) => (
              <li key={key}>
                <Link href={href} className={footerLinkClass}>
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={columnTitleClass}>{t("contact")}</h2>
          <div className="mt-4">
            <ContactList />
          </div>
        </div>
      </div>

      <div className="bg-accent-deep text-accent-foreground">
        <div className="container flex flex-col items-center justify-between gap-2 py-3.5 text-center text-xs sm:flex-row sm:text-start">
          <p>{t("copyright", { year })}</p>
          <p className="inline-flex items-center gap-1.5">
            <LuHeart aria-hidden className="size-3.5 fill-current" />
            {t("madeWithLove")}
          </p>
        </div>
      </div>
    </footer>
  );
}
