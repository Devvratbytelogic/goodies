import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { countryCookie, isCurrencyCode, toCurrency } from "./utils/currency";

const handleI18n = createMiddleware(routing);

function pathnameWithCurrency(pathname: string, currency: string) {
  const trailing = pathname.length > 1 && pathname.endsWith("/");
  const parts = pathname.split("/").filter(Boolean);
  const hasLocale = routing.locales.includes(parts[0] as (typeof routing.locales)[number]);
  if (!hasLocale) parts.unshift(routing.defaultLocale);
  if (isCurrencyCode(parts[1])) parts[1] = currency;
  else parts.splice(1, 0, currency);
  const next = `/${parts.join("/")}`;
  return trailing ? `${next}/` : next;
}

export default function proxy(request: NextRequest) {
  const response = handleI18n(request);
  if (response.status >= 300 && response.status < 400) return response;

  const currency = toCurrency(request.cookies.get(countryCookie)?.value);
  const rewriteHeader = response.headers.get("x-middleware-rewrite");
  const url = rewriteHeader ? new URL(rewriteHeader) : request.nextUrl.clone();
  const nextPath = pathnameWithCurrency(url.pathname, currency);
  if (nextPath === url.pathname) return response;

  url.pathname = nextPath;
  const requestHeaders = new Headers(request.headers);
  const locale = routing.locales.find((item) => url.pathname === `/${item}` || url.pathname.startsWith(`/${item}/`));
  if (locale) requestHeaders.set("X-NEXT-INTL-LOCALE", locale);

  const rewritten = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  for (const cookie of response.headers.getSetCookie()) rewritten.headers.append("set-cookie", cookie);
  const link = response.headers.get("link");
  if (link) rewritten.headers.set("link", link);
  return rewritten;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
