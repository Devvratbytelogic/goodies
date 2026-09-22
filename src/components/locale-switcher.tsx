"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("LocaleSwitcher");

  return (
    <nav aria-label={t("label")} className="flex items-center gap-1">
      {routing.locales.map((nextLocale) => {
        const isActive = nextLocale === locale;

        return (
          <Link
            key={nextLocale}
            href={pathname}
            locale={nextLocale}
            hrefLang={nextLocale}
            replace
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {t(nextLocale)}
          </Link>
        );
      })}
    </nav>
  );
}
