"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { IconType } from "react-icons";
import { LuChevronDown, LuHeart, LuShoppingCart, LuUser, LuX } from "react-icons/lu";
import { Link, usePathname } from "@/i18n/navigation";
import ImageComponent from "@/components/layout/common/ImageComponent";
import {
  getAccountRoutePath,
  getCartRoutePath,
  getHomeRoutePath,
  getShopRoutePath,
  getWishlistRoutePath,
} from "@/utils/routes";
import { LocaleToggle } from "./LocaleToggle";
import { isActivePath, navItems } from "./navigation";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  cartCount?: number;
  wishlistCount?: number;
};

const accountLinks: {
  href: string;
  key: "account" | "wishlist" | "cart";
  icon: IconType;
  countKey?: "wishlist" | "cart";
}[] = [
  { href: getAccountRoutePath(), key: "account", icon: LuUser },
  {
    href: getWishlistRoutePath(),
    key: "wishlist",
    icon: LuHeart,
    countKey: "wishlist",
  },
  { href: getCartRoutePath(), key: "cart", icon: LuShoppingCart, countKey: "cart" },
];

const actionClass =
  "flex size-10 items-center justify-center rounded-full text-accent-deep transition-colors hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const sectionLabelClass =
  "px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-deep";

const itemClass =
  "relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary overflow-hidden";

const iconWrapClass =
  "flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-soft text-accent-deep";

const shopChildLinkClass =
  "flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary";

function NavIndicator({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={`absolute inset-y-2 inset-s-0 w-0.5 rounded-full bg-primary transition-opacity duration-200 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

function menuItemState(active: boolean) {
  return active
    ? "bg-primary-soft/70 text-primary"
    : "text-foreground hover:bg-surface hover:text-primary";
}

function MenuItemLink({
  href,
  label,
  icon: Icon,
  active,
  onClose,
  ariaLabel,
  count = 0,
  fillIconWhenActive = false,
}: {
  href: string;
  label: string;
  icon: IconType;
  active: boolean;
  onClose: () => void;
  ariaLabel?: string;
  count?: number;
  fillIconWhenActive?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      aria-label={ariaLabel ?? label}
      onClick={onClose}
      className={`${itemClass} ${menuItemState(active)}`}
    >
      <NavIndicator active={active} />
      <span className={`${iconWrapClass} relative`}>
        <Icon
          aria-hidden
          className={`size-4.5 ${fillIconWhenActive && active ? "fill-current" : ""}`}
        />
        {count > 0 ? (
          <span
            aria-hidden
            className="absolute -top-0.5 inset-e-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold leading-none text-primary-foreground ring-2 ring-background"
          >
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </span>
      <span className="flex-1">{label}</span>
    </Link>
  );
}

export default function MobileMenu({
  open,
  onClose,
  cartCount = 0,
  wishlistCount = 0,
}: MobileMenuProps) {
  const t = useTranslations("Nav");
  const tShop = useTranslations("ShopMenu");
  const tHeader = useTranslations("Header");
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();

      if (isActivePath(pathname, getShopRoutePath())) {
        setExpandedKey("shop");
      }
    } else {
      setExpandedKey(null);
    }
  }, [open, pathname]);

  return (
    <>
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-60 bg-black/40 transition-opacity duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        aria-hidden={!open}
        className={`fixed inset-y-0 inset-s-0 z-70 w-[min(20rem,86vw)] overflow-hidden lg:hidden ${
          open ? "" : "pointer-events-none"
        }`}
      >
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={tHeader("menu")}
          inert={open ? undefined : true}
          className={`flex h-full flex-col border-e border-border/40 bg-background/95 backdrop-blur-xl transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none ${
            open
              ? "translate-x-0 shadow-[4px_0_24px_-4px_rgb(0_0_0/0.18)]"
              : "-translate-x-full shadow-none rtl:translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-border/40 px-4 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))]">
            <Link
              href={getHomeRoutePath()}
              aria-label={tHeader("brandHome")}
              onClick={onClose}
              className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <ImageComponent
                src="/logo/logo.webp"
                alt="Goodies"
                width={112}
                height={112}
                sizes="56px"
                className="h-14! w-auto"
              />
            </Link>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label={tHeader("closeMenu")}
              className={actionClass}
            >
              <LuX aria-hidden className="size-5.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain">
            <nav aria-label={tHeader("primaryNavigation")} className="py-4">
              <p className={`${sectionLabelClass} mb-3`}>
                {tHeader("primaryNavigation")}
              </p>

              <ul className="space-y-0.5 px-3">
              {navItems.map((item) => {
                const active = isActivePath(pathname, item.href);
                const isExpanded = expandedKey === item.key;
                const highlighted = active || isExpanded;

                if (!item.categories) {
                  return (
                    <li key={item.key}>
                      <MenuItemLink
                        href={item.href}
                        label={t(item.key)}
                        icon={item.icon}
                        active={active}
                        onClose={onClose}
                      />
                    </li>
                  );
                }

                return (
                  <li key={item.key}>
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={`mobile-menu-${item.key}`}
                      onClick={() =>
                        setExpandedKey(isExpanded ? null : item.key)
                      }
                      className={`${itemClass} ${menuItemState(highlighted)}`}
                    >
                      <NavIndicator active={highlighted} />
                      <span className={iconWrapClass}>
                        <item.icon aria-hidden className="size-4.5" />
                      </span>
                      <span className="flex-1 text-start">{t(item.key)}</span>
                      <LuChevronDown
                        aria-hidden
                        className={`size-4 text-icon-muted transition-transform duration-300 ${
                          isExpanded ? "-rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>

                    <div
                      id={`mobile-menu-${item.key}`}
                      className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                        isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div className="ms-4 me-2 border-s-2 border-primary/20 bg-surface/60 py-1">
                          <ul className="divide-y divide-border/35">
                            {item.categories.map((category) => {
                              const categoryActive = isActivePath(
                                pathname,
                                category.href,
                              );

                              return (
                                <li key={category.key}>
                                  <Link
                                    href={category.href}
                                    aria-current={
                                      categoryActive ? "page" : undefined
                                    }
                                    onClick={onClose}
                                    className={`${shopChildLinkClass} ${
                                      categoryActive
                                        ? "bg-primary-soft/70 text-primary"
                                        : "text-muted-foreground hover:bg-background hover:text-primary"
                                    }`}
                                  >
                                    <span
                                      className={`flex size-7 shrink-0 items-center justify-center rounded-md transition-colors ${
                                        categoryActive
                                          ? "bg-background text-primary"
                                          : "bg-surface-soft text-accent-deep"
                                      }`}
                                    >
                                      <category.icon
                                        aria-hidden
                                        className="size-3.5"
                                      />
                                    </span>
                                    {tShop(category.key)}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
              </ul>
            </nav>

            <div className="border-t border-border/40 py-4">
              <p className={`${sectionLabelClass} mb-3`}>{tHeader("account")}</p>

              <ul className="space-y-0.5 px-3">
                {accountLinks.map(({ href, key, icon, countKey }) => {
                  const count =
                    countKey === "cart"
                      ? cartCount
                      : countKey === "wishlist"
                        ? wishlistCount
                        : 0;
                  const active = isActivePath(pathname, href);
                  const ariaLabel =
                    countKey === "cart"
                      ? tHeader("cartLabel", { count })
                      : countKey === "wishlist"
                        ? tHeader("wishlistLabel", { count })
                        : tHeader(key);

                  return (
                    <li key={key}>
                      <MenuItemLink
                        href={href}
                        label={tHeader(key)}
                        icon={icon}
                        active={active}
                        onClose={onClose}
                        ariaLabel={ariaLabel}
                        count={count}
                        fillIconWhenActive={key === "wishlist"}
                      />
                    </li>
                  );
                })}
              </ul>

              {/* <p className="mt-4 px-3 text-center text-xs text-muted">
                {tHeader("tagline")}
              </p> */}
            </div>
          </div>

          <div className="shrink-0 border-t border-border/40 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <LocaleToggle className="w-full justify-center" />
          </div>
        </div>
      </div>
    </>
  );
}
