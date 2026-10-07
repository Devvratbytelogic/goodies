import { createNavigation } from "next-intl/navigation";
import { isCurrencyCode } from "@/utils/currency";
import { routing } from "./routing";

const navigation = createNavigation(routing);

export const { Link, redirect, useRouter, getPathname } = navigation;

export function usePathname() {
  const pathname = navigation.usePathname();
  const [first, ...rest] = pathname.split("/").filter(Boolean);
  if (!isCurrencyCode(first)) return pathname;
  return rest.length ? `/${rest.join("/")}` : "/";
}
