"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { IconType } from "react-icons";
import { LuHeart, LuMenu, LuSearch, LuShoppingCart, LuUser, LuX } from "react-icons/lu";
import { Link, usePathname } from "@/i18n/navigation";
import ImageComponent from "@/components/layout/common/ImageComponent";
import {
  getAccountRoutePath,
  getCartRoutePath,
  getHomeRoutePath,
  getWishlistRoutePath,
} from "@/utils/routes";
import { DesktopNav } from "./DesktopNav";
import { LocaleToggle } from "./LocaleToggle";
import MobileMenu from "./MobileMenu";
import { SearchField } from "./SearchField";

const actionClass =
  "relative flex size-10 items-center justify-center rounded-full text-accent-deep transition-colors hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

type HeaderBarProps = {
  cartCount: number;
  wishlistCount: number;
};

function CountBadge({ count }: { count: number }) {
  if (count <= 0) {
    return null;
  }

  return (
    <span
      aria-hidden
      className="absolute -top-0.5 inset-e-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold leading-none text-primary-foreground ring-2 ring-background"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

function ActionLink({
  href,
  label,
  icon: Icon,
  count = 0,
  className = "",
}: {
  href: string;
  label: string;
  icon: IconType;
  count?: number;
  className?: string;
}) {
  return (
    <Link href={href} aria-label={label} className={`${actionClass} ${className}`}>
      <Icon aria-hidden className="size-5.5" />
      <CountBadge count={count} />
    </Link>
  );
}

function BrandLogo() {
  const t = useTranslations("Header");

  return (
    <Link
      href={getHomeRoutePath()}
      aria-label={t("brandHome")}
      className="flex w-fit shrink-0 items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <ImageComponent
        src="/logo/logo.webp"
        alt="Goodies"
        width={1000}
        height={1000}
        preload
        className="h-16! w-auto lg:h-20!"
      />
    </Link>
  );
}

export function HeaderBar({ cartCount, wishlistCount }: HeaderBarProps) {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [renderedPathname, setRenderedPathname] = useState(pathname);

  // Collapse any open overlay as soon as the route changes.
  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  // The drawer is hidden above `lg`, so drop it before it can lock body scroll.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 64rem)");

    function handleChange(event: MediaQueryListEvent) {
      if (event.matches) {
        setMenuOpen(false);
      }
    }

    desktop.addEventListener("change", handleChange);

    return () => desktop.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/85 backdrop-blur-xl">
        <div className="container">
          {/* Mobile bar */}
          <div className="grid grid-cols-3 items-center py-2.5 lg:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t("openMenu")}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={`${actionClass} -ms-2 justify-self-start`}
            >
              <LuMenu aria-hidden className="size-6" />
            </button>

            <div className="justify-self-center">
              <BrandLogo />
            </div>

            <div className="flex items-center justify-self-end">
              <ActionLink
                href={getWishlistRoutePath()}
                label={t("wishlistLabel", { count: wishlistCount })}
                icon={LuHeart}
                count={wishlistCount}
              />
              <ActionLink
                href={getCartRoutePath()}
                label={t("cartLabel", { count: cartCount })}
                icon={LuShoppingCart}
                count={cartCount}
                className="-me-2"
              />
            </div>
          </div>

          {/* Mobile search */}
          <div className="pb-3 lg:hidden">
            <SearchField />
          </div>

          {/* Desktop bar */}
          <div className="hidden grid-cols-[1fr_auto_1fr] items-center gap-6 py-2 lg:grid">
            <div className="justify-self-start">
              <BrandLogo />
            </div>

            <DesktopNav />

            <div className="flex items-center gap-1 justify-self-end">
              <button
                type="button"
                onClick={() => setSearchOpen((value) => !value)}
                aria-label={searchOpen ? t("closeSearch") : t("openSearch")}
                aria-expanded={searchOpen}
                aria-controls="header-search"
                className={`${actionClass} ${searchOpen ? "bg-primary-soft text-primary" : ""}`}
              >
                {searchOpen ? (
                  <LuX aria-hidden className="size-5.5" />
                ) : (
                  <LuSearch aria-hidden className="size-5.5" />
                )}
              </button>

              <ActionLink href={getAccountRoutePath()} label={t("account")} icon={LuUser} />
              <ActionLink
                href={getWishlistRoutePath()}
                label={t("wishlistLabel", { count: wishlistCount })}
                icon={LuHeart}
                count={wishlistCount}
              />
              <ActionLink
                href={getCartRoutePath()}
                label={t("cartLabel", { count: cartCount })}
                icon={LuShoppingCart}
                count={cartCount}
              />

              <span aria-hidden className="mx-2 h-6 w-px bg-border/70" />

              <LocaleToggle />
            </div>
          </div>

          {/* Desktop search panel */}
          <div
            id="header-search"
            inert={!searchOpen}
            className={`hidden transition-[grid-template-rows,opacity] duration-300 ease-out lg:grid ${searchOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
          >
            <div className="overflow-hidden">
              <div className="pb-4">
                <SearchField
                  focused={searchOpen}
                  onSubmitted={() => setSearchOpen(false)}
                  className="mx-auto max-w-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* <MobileMenu /> */}
    </>
  );
}
