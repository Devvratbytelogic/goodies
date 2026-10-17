"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LuHouse, LuLogOut, LuMapPin, LuMenu, LuPackage, LuTicket, LuUser, LuX } from "react-icons/lu";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { ProfileAvatar } from "@/components/account/AccountProfileSummary";
import { AccountNavIdentitySkeleton } from "@/components/skeletons/AccountSkeletons";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  getAccountAddressRoutePath,
  getAccountCouponsRoutePath,
  getAccountOrdersRoutePath,
  getAccountProfileRoutePath,
  getAccountRoutePath,
  getHomeRoutePath,
} from "@/utils/routes";

const items = [
  { href: getAccountRoutePath(), key: "dashboard", icon: LuHouse, exact: true },
  { href: getAccountProfileRoutePath(), key: "profile", icon: LuUser, exact: false },
  { href: getAccountOrdersRoutePath(), key: "orders", icon: LuPackage, exact: false },
  { href: getAccountAddressRoutePath(), key: "addresses", icon: LuMapPin, exact: false },
  { href: getAccountCouponsRoutePath(), key: "coupons", icon: LuTicket, exact: false },
] as const;

function normalize(path: string) {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }

  return path;
}

function AccountIdentity({ name, photo, email, pending }: { name: string; photo: string; email: string; pending: boolean }) {
  const initials = `${name[0] ?? ""}${name[1] ?? ""}`;

  if (pending) return <AccountNavIdentitySkeleton />;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <ProfileAvatar photo={photo} initials={initials} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-heading">{name}</p>
        <p className="truncate text-xs text-muted">{email}</p>
      </div>
    </div>
  );
}

function AccountLinks({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("AccountPage");
  const pathname = normalize(usePathname());

  return (
    <ul className="grid gap-1">
      {items.map((item) => {
        const path = normalize(item.href);
        const active = item.exact ? pathname === path : pathname === path || pathname.startsWith(`${path}/`);
        const Icon = item.icon;

        return (
          <li key={item.key}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={`flex h-11 items-center gap-3 rounded-xl px-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${active ? "bg-primary-soft text-primary" : "text-heading hover:bg-surface"}`}
            >
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${active ? "bg-primary text-primary-foreground" : "bg-surface text-muted"}`}>
                <Icon aria-hidden className="size-4" />
              </span>
              {t(item.key)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function AccountNav({ name, photo, email, pending = false }: { name: string; photo: string; email: string; pending?: boolean }) {
  const t = useTranslations("AccountPage");
  const menu = useTranslations("Header");
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [renderedPathname, setRenderedPathname] = useState(pathname);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);

  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    const media = window.matchMedia("(min-width: 64rem)");
    function onMedia() {
      if (media.matches) setOpen(false);
    }

    document.addEventListener("keydown", onKey);
    media.addEventListener("change", onMedia);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      media.removeEventListener("change", onMedia);
    };
  }, [open]);

  function close() {
    setOpen(false);
    openRef.current?.focus();
  }

  function signOut() {
    setOpen(false);
    logout();
    router.push(getHomeRoutePath());
  }

  const logoutButton = (
    <button
      type="button"
      onClick={signOut}
      className="flex h-11 w-full items-center gap-3 rounded-xl px-2.5 text-sm font-medium text-heading transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface text-muted">
        <LuLogOut aria-hidden className="size-4" />
      </span>
      {t("logout")}
    </button>
  );

  return (
    <>
      <button
        ref={openRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="account-menu"
        aria-label={name ? `${name}. ${menu("openMenu")}` : menu("openMenu")}
        className="mb-6 flex w-full items-center gap-3 rounded-2xl border border-border bg-background p-3 text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
      >
        <AccountIdentity name={name} photo={photo} email={email} pending={pending} />
        <LuMenu aria-hidden className="ms-auto size-5 shrink-0 text-heading" />
      </button>

      <nav aria-label={t("navLabel")} className="mb-6 hidden lg:sticky lg:top-24 lg:mb-0 lg:block">
        <div className="rounded-2xl border border-border bg-background p-3">
          <div className="px-2 py-2">
            <AccountIdentity name={name} photo={photo} email={email} pending={pending} />
          </div>
          <div className="mt-2 border-t border-border pt-2">
            <AccountLinks />
          </div>
          <div className="mt-2 border-t border-border pt-2">{logoutButton}</div>
        </div>
      </nav>

      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-60 bg-black/40 transition-opacity duration-300 ease-out motion-reduce:transition-none lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={close}
      />
      <div aria-hidden={!open} className={`fixed inset-y-0 inset-s-0 z-70 w-[min(20rem,86vw)] overflow-hidden lg:hidden ${open ? "" : "pointer-events-none"}`}>
        <div
          id="account-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t("navLabel")}
          inert={open ? undefined : true}
          className={`flex h-full flex-col border-e border-border bg-background transition-transform duration-300 ease-out motion-reduce:transition-none ${open ? "translate-x-0 shadow-[4px_0_24px_-4px_rgb(0_0_0/0.18)]" : "-translate-x-full shadow-none rtl:translate-x-full"}`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <h2 className="text-base font-bold text-heading">{t("navLabel")}</h2>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label={menu("closeMenu")}
              className="inline-flex size-10 items-center justify-center rounded-full text-heading transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <LuX aria-hidden className="size-5" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
            <div className="px-2 py-2">
              <AccountIdentity name={name} photo={photo} email={email} pending={pending} />
            </div>
            <div className="mt-2 border-t border-border pt-2">
              <AccountLinks onNavigate={() => setOpen(false)} />
            </div>
          </div>
          <div className="border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">{logoutButton}</div>
        </div>
      </div>
    </>
  );
}
