import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AccountOrderList } from "@/components/account/AccountOrders";
import { AccountGreeting, AccountProfileSummary } from "@/components/account/AccountProfileSummary";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import { Link } from "@/i18n/navigation";
import { sampleAddresses } from "@/data/sampleAddresses";
import { sampleCoupons } from "@/data/sampleAccount";
import { sampleWishlist } from "@/data/sampleWishlist";
import { getAccountOrders } from "@/components/account/orders";
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
  const orders = await getAccountOrders();
  const address = sampleAddresses[0];

  const stats = [
    { href: getAccountOrdersRoutePath(), label: t("orders"), value: orders.length },
    { href: getWishlistRoutePath(), label: t("wishlist"), value: sampleWishlist.length },
    { href: getAccountAddressRoutePath(), label: t("addresses"), value: sampleAddresses.length },
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
          <AccountOrderList orders={orders.slice(0, 2)} />
        </section>

        <div className="grid gap-4">
          <AccountProfileSummary />

          <section className="rounded-2xl border border-border bg-background px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-heading">{t("defaultAddress")}</h2>
              <Link
                href={getAccountAddressRoutePath()}
                className="text-sm font-medium text-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t("viewAll")}
              </Link>
            </div>
            <p className="mt-3 text-sm font-medium text-heading">
              {address.firstName} {address.lastName}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {address.address}
              <br />
              {address.city}
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
