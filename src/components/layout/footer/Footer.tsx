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
  "text-[11px] font-semibold uppercase tracking-[0.18em] text-accent";
const footerLinkClass =
  "text-sm text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function Footer() {
  const t = useTranslations("Footer");
  const tHeader = useTranslations("Header");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-[#111011] text-white">
      <div className="container grid gap-10 py-10 sm:py-12 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] lg:gap-8 lg:py-14">
        <div className="max-w-sm">
          <Link
            href={getHomeRoutePath()}
            aria-label={tHeader("brandHome")}
            className="inline-flex rounded-2xl bg-white p-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <ImageComponent
              src="/logo/logo.webp"
              alt="Goodies"
              width={160}
              height={160}
              sizes="72px"
              className="h-14 w-auto"
            />
          </Link>
          <p className="mt-4 text-sm font-medium text-white/90">{t("tagline")}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/65">{t("description")}</p>

          <p className={`${columnTitleClass} mt-6`}>{t("followUs")}</p>
          <ul className="mt-3 flex items-center gap-2.5">
            {socialLinks.map(({ key, href, icon: Icon }) => (
              <li key={key}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(key)}
                  className="flex size-10 items-center justify-center rounded-full bg-white/8 text-white transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Icon aria-hidden className="size-4.5" />
                </a>
              </li>
            ))}
          </ul>
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
          <ul className="mt-4 flex flex-col gap-3">
            <li>
              <a
                href={`mailto:${EMAIL}`}
                className={`inline-flex items-center gap-2.5 ${footerLinkClass}`}
              >
                <LuMail aria-hidden className="size-4 shrink-0 text-accent" />
                {EMAIL}
              </a>
            </li>
            <li>
              <a
                href={`tel:${PHONE_HREF}`}
                className={`inline-flex items-center gap-2.5 ${footerLinkClass}`}
              >
                <LuPhone aria-hidden className="size-4 shrink-0 text-accent" />
                {PHONE_LABEL}
              </a>
            </li>
            <li className="inline-flex items-center gap-2.5 text-sm text-white/75">
              <LuMapPin aria-hidden className="size-4 shrink-0 text-accent" />
              {t("location")}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-4 text-center text-xs text-white/55 sm:flex-row sm:text-start">
          <p>{t("copyright", { year })}</p>
          <p className="inline-flex items-center gap-1.5">
            <LuHeart aria-hidden className="size-3.5 fill-current text-primary" />
            {t("madeWithLove")}
          </p>
        </div>
      </div>
    </footer>
  );
}
