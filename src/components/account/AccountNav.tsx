"use client";

import { useTranslations } from "next-intl";
import { LuHouse, LuLogOut, LuMapPin, LuPackage, LuTicket, LuUser } from "react-icons/lu";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { ProfileAvatar } from "@/components/account/AccountProfileSummary";
import { useAccountProfile } from "@/components/account/AccountProfileProvider";
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

export default function AccountNav() {
  const t = useTranslations("AccountPage");
  const router = useRouter();
  const pathname = normalize(usePathname());
  const { profile } = useAccountProfile();
  const { logout } = useAuth();
  const initials = `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`;

  return (
    <nav aria-label={t("navLabel")} className="mb-6 lg:sticky lg:top-24 lg:mb-0">
      <div className="rounded-2xl border border-border bg-background p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <ProfileAvatar photo={profile.photo} initials={initials} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-heading">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="truncate text-xs text-muted">{profile.email}</p>
          </div>
        </div>
        <ul className="mt-2 grid grid-cols-2 gap-1 border-t border-border pt-2 lg:grid-cols-1">
          {items.map((item) => {
            const path = normalize(item.href);
            const active = item.exact ? pathname === path : pathname === path || pathname.startsWith(`${path}/`);
            const Icon = item.icon;

            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-11 items-center gap-3 rounded-xl px-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    active ? "bg-primary-soft text-primary" : "text-heading hover:bg-surface"
                  }`}
                >
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                      active ? "bg-primary text-primary-foreground" : "bg-surface text-muted"
                    }`}
                  >
                    <Icon aria-hidden className="size-4" />
                  </span>
                  {t(item.key)}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-2 border-t border-border pt-2">
          <button
            type="button"
            onClick={() => {
              logout();
              router.push(getHomeRoutePath());
            }}
            className="flex h-11 w-full items-center gap-3 rounded-xl px-2.5 text-sm font-medium text-heading transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface text-muted">
              <LuLogOut aria-hidden className="size-4" />
            </span>
            {t("logout")}
          </button>
        </div>
      </div>
    </nav>
  );
}
