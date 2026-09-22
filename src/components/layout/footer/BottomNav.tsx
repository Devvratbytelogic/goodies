"use client";

import { useTranslations } from "next-intl";
import type { IconType } from "react-icons";
import { LuHeart, LuHouse, LuStore, LuUser } from "react-icons/lu";
import { Link, usePathname } from "@/i18n/navigation";
import { isActivePath } from "@/components/layout/header/navigation";
import {
  getAccountRoutePath,
  getHomeRoutePath,
  getShopRoutePath,
  getWishlistRoutePath,
} from "@/utils/routes";

const items: {
  href: string;
  key: "home" | "shop" | "favorites" | "account";
  icon: IconType;
}[] = [
  { href: getHomeRoutePath(), key: "home", icon: LuHouse },
  { href: getShopRoutePath(), key: "shop", icon: LuStore },
  { href: getWishlistRoutePath(), key: "favorites", icon: LuHeart },
  { href: getAccountRoutePath(), key: "account", icon: LuUser },
];

export function BottomNav() {
  const t = useTranslations("BottomNav");
  const pathname = usePathname();

  return (
    <>
      <nav
        aria-label={t("label")}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border/40 bg-background/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        <ul className="grid h-14 grid-cols-4">
          {items.map(({ href, key, icon: Icon }) => {
            const active = isActivePath(pathname, href);

            return (
              <li key={key}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    active
                      ? "text-primary"
                      : "text-icon-muted hover:text-primary"
                  }`}
                >
                  <Icon
                    aria-hidden
                    className={`size-5.5 ${active && key === "favorites" ? "fill-current" : ""}`}
                  />
                  <span>{t(key)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div
        aria-hidden
        className="h-[calc(3.5rem+env(safe-area-inset-bottom))] lg:hidden"
      />
    </>
  );
}
