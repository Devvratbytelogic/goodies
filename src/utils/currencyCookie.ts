import Cookies from "js-cookie";
import { countryCookie, toCurrency, type CurrencyCode } from "@/utils/currency";

export function readCurrencyCookie(): CurrencyCode {
  if (typeof document === "undefined") return toCurrency(null);
  return toCurrency(Cookies.get(countryCookie));
}

export function writeCurrencyCookie(code: CurrencyCode) {
  Cookies.set(countryCookie, code, {
    expires: 365,
    path: "/",
    sameSite: "Lax",
    secure: typeof window !== "undefined" && window.location.protocol === "https:",
  });
}
