import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

/** Public path for a locale. English has no prefix. Currency is not part of the URL. */
export function canonicalPath(locale: string, path = "/") {
  const withoutQuery = path.split("?")[0]?.split("#")[0] || "/";
  const withSlash = withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
  const trimmed = withSlash.length > 1 ? withSlash.replace(/\/+$/, "") : "/";
  if (locale === routing.defaultLocale) return trimmed;
  return trimmed === "/" ? `/${locale}` : `/${locale}${trimmed}`;
}

export function pageAlternates(locale: string, path: string): Metadata["alternates"] {
  return {
    canonical: canonicalPath(locale, path),
    languages: {
      en: canonicalPath("en", path),
      ar: canonicalPath("ar", path),
      "x-default": canonicalPath(routing.defaultLocale, path),
    },
  };
}
