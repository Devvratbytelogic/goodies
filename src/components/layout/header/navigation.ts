import type { IconType } from "react-icons";
import {
  LuHouse,
  LuInfo,
  LuMail,
  LuStore,
} from "react-icons/lu";
import {
  getAboutUsRoutePath,
  getContactUsRoutePath,
  getHomeRoutePath,
  getShopRoutePath,
} from "@/utils/routes";

export type ShopCategory = {
  href: string;
  label: string;
};

export type NavItem = {
  href: string;
  key: "home" | "aboutUs" | "shop" | "contactUs";
  icon: IconType;
  categories?: ShopCategory[];
};

export const navItems: NavItem[] = [
  { href: getHomeRoutePath(), key: "home", icon: LuHouse },
  { href: getAboutUsRoutePath(), key: "aboutUs", icon: LuInfo },
  { href: getShopRoutePath(), key: "shop", icon: LuStore },
  { href: getContactUsRoutePath(), key: "contactUs", icon: LuMail },
];

export function isActivePath(pathname: string, href: string) {
  const path = href.split("?")[0];

  if (path === "/") {
    return pathname === "/";
  }

  return pathname === path || pathname.startsWith(`${path}/`);
}
