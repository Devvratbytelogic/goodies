"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LuArrowRight, LuChevronDown } from "react-icons/lu";
import { Link, usePathname } from "@/i18n/navigation";
import { isActivePath, navItems } from "./navigation";

const itemClass =
  "relative inline-flex items-center gap-1.5 px-3.5 py-2 text-[15px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function DesktopNav() {
  const t = useTranslations("Nav");
  const tShop = useTranslations("ShopMenu");
  const tHeader = useTranslations("Header");
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);

  useEffect(() => {
    if (!openKey) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenKey(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenKey(null);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openKey]);

  return (
    <nav
      ref={navRef}
      aria-label={tHeader("primaryNavigation")}
      className="justify-self-center"
    >
      <ul className="flex items-center gap-1">
        {navItems.map((item) => {
          const active = isActivePath(pathname, item.href);
          const isOpen = openKey === item.key;

          const indicator = (
            <span
              aria-hidden
              className={`absolute inset-x-3.5 bottom-0 h-0.5 origin-center rounded-full bg-primary transition-transform duration-300 ${
                active ? "scale-x-100" : "scale-x-0"
              }`}
            />
          );

          if (!item.categories) {
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`${itemClass} ${active ? "text-primary" : "text-foreground hover:text-primary"}`}
                >
                  {t(item.key)}
                  {indicator}
                </Link>
              </li>
            );
          }

          return (
            <li
              key={item.key}
              className="relative"
              onMouseEnter={() => setOpenKey(item.key)}
              onMouseLeave={() => setOpenKey(null)}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`header-menu-${item.key}`}
                onClick={() => setOpenKey(isOpen ? null : item.key)}
                className={`${itemClass} ${active || isOpen ? "text-primary" : "text-foreground hover:text-primary"}`}
              >
                {t(item.key)}
                <LuChevronDown
                  aria-hidden
                  className={`size-4 transition-transform duration-300 ${isOpen ? "-rotate-180" : ""}`}
                />
                {indicator}
              </button>

              <div
                id={`header-menu-${item.key}`}
                className={`absolute start-0 top-full z-50 pt-3 transition duration-200 ${
                  isOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-1 opacity-0"
                }`}
              >
                <div className="w-72 rounded-2xl border border-border/70 bg-background p-2 shadow-[0_24px_60px_-28px_rgb(0_0_0/0.45)]">
                  <ul>
                    {item.categories.map((category) => (
                      <li key={category.key}>
                        <Link
                          href={category.href}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary"
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-soft text-accent-deep">
                            <category.icon aria-hidden className="size-4.5" />
                          </span>
                          {tShop(category.key)}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-1 border-t border-border/60 pt-1">
                    <Link
                      href={item.href}
                      className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft"
                    >
                      {tHeader("shopAll")}
                      <LuArrowRight
                        aria-hidden
                        className="size-4 rtl:-scale-x-100"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
