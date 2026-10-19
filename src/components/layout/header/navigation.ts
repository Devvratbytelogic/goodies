import type { IconType } from "react-icons";
import {
  LuHouse,
  LuInfo,
  LuMail,
  LuNewspaper,
  LuStore,
} from "react-icons/lu";
import {
  getAboutUsRoutePath,
  getBlogsRoutePath,
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
  key: "home" | "aboutUs" | "shop" | "blogs" | "contactUs";
  icon: IconType;
  categories?: ShopCategory[];
};

export const navItems: NavItem[] = [
  { href: getHomeRoutePath(), key: "home", icon: LuHouse },
  { href: getAboutUsRoutePath(), key: "aboutUs", icon: LuInfo },
  { href: getShopRoutePath(), key: "shop", icon: LuStore },
  { href: getBlogsRoutePath(), key: "blogs", icon: LuNewspaper },
  { href: getContactUsRoutePath(), key: "contactUs", icon: LuMail },
];

export function isActivePath(pathname: string, href: string) {
  const path = href.split("?")[0];

  if (path === "/") {
    return pathname === "/";
  }

  if (path === "/blogs") {
    return pathname === "/blogs" || pathname.startsWith("/blog/") || pathname.startsWith("/blog-category/");
  }

  return pathname === path || pathname.startsWith(`${path}/`);
}
