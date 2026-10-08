import { createNavigation } from "next-intl/navigation";
import { currencies } from "@/utils/currency";
import { routing } from "./routing";

const navigation = createNavigation(routing);
const currencyCodes: readonly string[] = currencies;

export const { Link, redirect, useRouter, getPathname } = navigation;

export function usePathname() {
  const pathname = navigation.usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const currencyAt = routing.locales.includes(parts[0] as (typeof routing.locales)[number]) ? 1 : 0;
  if (!currencyCodes.includes(parts[currencyAt] ?? "")) return pathname;
  parts.splice(currencyAt, 1);
  return parts.length ? `/${parts.join("/")}` : "/";
}
