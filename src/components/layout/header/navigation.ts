import type { IconType } from "react-icons";
import {
  LuCandy,
  LuCherry,
  LuCookie,
  LuGift,
  LuHouse,
  LuInfo,
  LuMail,
  LuPackage,
  LuStore,
} from "react-icons/lu";
import {
  getAboutUsRoutePath,
  getContactUsRoutePath,
  getHomeRoutePath,
  getProductCategoryRoutePath,
  getShopRoutePath,
} from "@/utils/routes";

export type ShopCategory = {
  href: string;
  key: "freezeDriedCandy" | "freezeDriedFruits" | "chocolate" | "giftBoxes" | "bundles";
  icon: IconType;
};

export type NavItem = {
  href: string;
  key: "home" | "aboutUs" | "shop" | "contactUs";
  icon: IconType;
  categories?: ShopCategory[];
};

export const shopCategories: ShopCategory[] = [
  {
    href: getProductCategoryRoutePath("freeze-dried-candy"),
    key: "freezeDriedCandy",
    icon: LuCandy,
  },
  {
    href: getProductCategoryRoutePath("freeze-dried-fruits"),
    key: "freezeDriedFruits",
    icon: LuCherry,
  },
  {
    href: getProductCategoryRoutePath("chocolate"),
    key: "chocolate",
    icon: LuCookie,
  },
  {
    href: getProductCategoryRoutePath("gift-boxes"),
    key: "giftBoxes",
    icon: LuGift,
  },
  {
    href: getProductCategoryRoutePath("bundles"),
    key: "bundles",
    icon: LuPackage,
  },
];

export const navItems: NavItem[] = [
  { href: getHomeRoutePath(), key: "home", icon: LuHouse },
  { href: getAboutUsRoutePath(), key: "aboutUs", icon: LuInfo },
  { href: getShopRoutePath(), key: "shop", icon: LuStore, categories: shopCategories },
  { href: getContactUsRoutePath(), key: "contactUs", icon: LuMail },
];

export function isActivePath(pathname: string, href: string) {
  const path = href.split("?")[0];

  if (path === "/") {
    return pathname === "/";
  }

  return pathname === path || pathname.startsWith(`${path}/`);
}
