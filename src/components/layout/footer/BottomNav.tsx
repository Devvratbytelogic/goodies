"use client";

import { useTranslations } from "next-intl";
import type { IconType } from "react-icons";
import { LuHeart, LuHouse, LuShoppingCart, LuStore, LuUser } from "react-icons/lu";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCartCount } from "@/store/endpoints/cartApi";
import { useWishlistCount } from "@/store/endpoints/wishlistApi";
import { useOpenLogin } from "@/components/auth/Login";
import { Link, usePathname } from "@/i18n/navigation";
import { isActivePath } from "@/components/layout/header/navigation";
import {
  getAccountRoutePath,
  getCartRoutePath,
  getHomeRoutePath,
  getShopRoutePath,
  getWishlistRoutePath,
} from "@/utils/routes";

const items: {
  href: string;
  key: "home" | "shop" | "cart" | "favorites" | "account";
  icon: IconType;
}[] = [
  { href: getHomeRoutePath(), key: "home", icon: LuHouse },
  { href: getShopRoutePath(), key: "shop", icon: LuStore },
  { href: getCartRoutePath(), key: "cart", icon: LuShoppingCart },
  { href: getWishlistRoutePath(), key: "favorites", icon: LuHeart },
  { href: getAccountRoutePath(), key: "account", icon: LuUser },
];

function CountBadge({ count }: { count: number }) {
  return (
    <span
      aria-hidden
      className="absolute -top-1.5 -inset-e-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-semibold leading-none text-primary-foreground ring-2 ring-background"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function BottomNav() {
  const t = useTranslations("BottomNav");
  const cartCount = useCartCount();
  const wishlistCount = useWishlistCount();
  const tHeader = useTranslations("Header");
  const { token } = useAuth();
  const openLogin = useOpenLogin();
  const pathname = usePathname();

  return (
    <>
      <nav
        aria-label={t("label")}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border/40 bg-background/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        <ul className="grid h-14 grid-cols-5">
          {items.map(({ href, key, icon: Icon }) => {
            const active = isActivePath(pathname, href);
            const label =
              key === "cart"
                ? tHeader("cartLabel", { count: cartCount })
                : key === "favorites"
                  ? tHeader("wishlistLabel", { count: wishlistCount })
                  : t(key);

            const className = `flex h-full w-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              active ? "text-primary" : "text-icon-muted hover:text-primary"
            }`;
            const icon = (
              <>
                <span className="relative">
                  <Icon
                    aria-hidden
                    className={`size-5.5 ${active && key === "favorites" ? "fill-current" : ""}`}
                  />
                  {key === "cart" ? <CountBadge count={cartCount} /> : null}
                  {key === "favorites" && wishlistCount > 0 ? <CountBadge count={wishlistCount} /> : null}
                </span>
                <span>{t(key)}</span>
              </>
            );

            if (key === "account" && !token) {
              return (
                <li key={key}>
                  <button type="button" aria-label={label} onClick={openLogin} className={className}>
                    {icon}
                  </button>
                </li>
              );
            }

            return (
              <li key={key}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  aria-label={label}
                  className={className}
                >
                  {icon}
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
