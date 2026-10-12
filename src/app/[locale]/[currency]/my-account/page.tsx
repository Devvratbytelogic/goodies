import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AccountDefaultAddress, AccountGreeting, AccountProfileSummary } from "@/components/account/AccountProfileSummary";
import { AccountAddressCount } from "@/components/account/AccountAddresses";
import { AccountOrdersCount, AccountRecentOrders } from "@/components/account/AccountRecentOrders";
import { AccountWishlistCount } from "@/components/account/AccountWishlistCount";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import { Link } from "@/i18n/navigation";
import { sampleCoupons } from "@/data/sampleAccount";
import {
  getAccountAddressRoutePath,
  getAccountCouponsRoutePath,
  getAccountOrdersRoutePath,
  getHomeRoutePath,
  getWishlistRoutePath,
} from "@/utils/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AccountPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function MyAccountPage() {
  const t = await getTranslations("AccountPage");
  const nav = await getTranslations("Nav");
  const stats = [
    { href: getAccountOrdersRoutePath(), label: t("orders"), value: <AccountOrdersCount /> },
    { href: getWishlistRoutePath(), label: t("wishlist"), value: <AccountWishlistCount /> },
    { href: getAccountAddressRoutePath(), label: t("addresses"), value: <AccountAddressCount /> },
    { href: getAccountCouponsRoutePath(), label: t("coupons"), value: sampleCoupons.length },
  ];

  return (
    <>
      <Breadcrumbs
        className="mb-4"
        items={[
          { label: nav("home"), href: getHomeRoutePath() },
          { label: t("title") },
        ]}
      />
      <AccountGreeting />
      <p className="mt-1 text-sm text-muted">{t("description")}</p>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <li key={stat.href}>
            <Link
              href={stat.href}
              className="block rounded-2xl border border-border bg-background px-4 py-3 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="block text-2xl font-bold tabular-nums text-heading">{stat.value}</span>
              <span className="mt-0.5 block text-sm text-muted">{stat.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)]">
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-heading">{t("recentOrders")}</h2>
            <Link
              href={getAccountOrdersRoutePath()}
              className="text-sm font-medium text-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {t("viewAll")}
            </Link>
          </div>
          <AccountRecentOrders />
        </section>

        <div className="grid gap-4">
          <AccountProfileSummary />
          <AccountDefaultAddress />
        </div>
      </div>
    </>
  );
}
