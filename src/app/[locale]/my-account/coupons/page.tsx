import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import { Link } from "@/i18n/navigation";
import { sampleCoupons, sampleUsedCoupons } from "@/data/sampleAccount";
import { getAccountRoutePath, getCartRoutePath, getHomeRoutePath } from "@/utils/routes";

function formatDate(value: string, locale: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AccountPage");
  return {
    title: t("coupons"),
    description: t("couponsIntro"),
  };
}

export default async function AccountCouponsPage() {
  const t = await getTranslations("AccountPage");
  const nav = await getTranslations("Nav");
  const locale = await getLocale();

  return (
    <>
      <Breadcrumbs
        className="mb-4"
        items={[
          { label: nav("home"), href: getHomeRoutePath() },
          { label: t("title"), href: getAccountRoutePath() },
          { label: t("coupons") },
        ]}
      />
      <h1 className="text-2xl font-bold tracking-tight text-heading">{t("coupons")}</h1>
      <p className="mt-1 text-sm text-muted">{t("couponsIntro")}</p>
      <section className="mt-6">
        <h2 className="text-sm font-semibold text-heading">{t("couponsAvailable")}</h2>
        <ul className="mt-3 grid gap-4 sm:grid-cols-2">
          {sampleCoupons.map((coupon) => (
            <li key={coupon.code} className="rounded-2xl border border-dashed border-primary/40 bg-primary-soft/40 px-5 py-4">
              <p className="font-mono text-sm font-bold tracking-wide text-primary">{coupon.code}</p>
              <p className="mt-2 text-sm text-heading">{t(coupon.labelKey)}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">
          <Link
            href={getCartRoutePath()}
            className="font-medium text-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("useAtCheckout")}
          </Link>
        </p>
      </section>
      <section className="mt-8">
        <h2 className="text-sm font-semibold text-heading">{t("couponsUsed")}</h2>
        <ul className="mt-3 grid gap-4 sm:grid-cols-2">
          {sampleUsedCoupons.map((coupon) => (
            <li key={coupon.code} className="rounded-2xl border border-border bg-surface px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-sm font-bold tracking-wide text-muted">{coupon.code}</p>
                <span className="inline-flex h-6 items-center rounded-full bg-background px-2.5 text-xs font-semibold text-muted">{t("couponsUsed")}</span>
              </div>
              <p className="mt-2 text-sm text-heading">{t(coupon.labelKey)}</p>
              <p className="mt-2 text-sm text-muted">
                {t("usedOn", { date: formatDate(coupon.usedOn, locale) })}
                {" · "}
                {t("order", { id: coupon.orderId })}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
