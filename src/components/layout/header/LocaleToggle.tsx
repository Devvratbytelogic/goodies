"use client";

import { useLocale, useTranslations } from "next-intl";
import { LuGlobe } from "react-icons/lu";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleToggle({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Header");
  const tLocale = useTranslations("LocaleSwitcher");

  const nextLocale =
    routing.locales.find((candidate) => candidate !== locale) ??
    routing.defaultLocale;
  const nextLabel = tLocale(nextLocale);

  return (
    <Link
      href={pathname}
      locale={nextLocale}
      hrefLang={nextLocale}
      replace
      aria-label={t("switchLanguage", { language: nextLabel })}
      className={`inline-flex h-10 items-center gap-2 rounded-full border border-border/70 px-3.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
    >
      <LuGlobe aria-hidden className="size-4" />
      <span>{nextLabel}</span>
    </Link>
  );
}
