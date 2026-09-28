import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { AccountOrderDetail } from "@/components/account/AccountOrders";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import { getAccountOrder } from "@/components/account/orders";
import { sampleOrders } from "@/data/sampleAccount";
import { routing } from "@/i18n/routing";
import { getAccountOrdersRoutePath, getAccountRoutePath, getHomeRoutePath } from "@/utils/routes";

type OrderPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

function formatDate(value: string, locale: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

const statusLabel = {
  processing: "statusProcessing",
  shipped: "statusShipped",
  delivered: "statusDelivered",
} as const;

const statusClassName = {
  processing: "bg-surface text-muted",
  shipped: "bg-primary-soft text-primary",
  delivered: "bg-surface-soft text-accent-deep",
} as const;

export function generateStaticParams() {
  return sampleOrders.map((order) => ({ id: order.id }));
}

export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const order = await getAccountOrder(id);

  if (!order || !hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "AccountPage" });
  return {
    title: t("order", { id: order.id }),
    description: t("placedOn", { date: formatDate(order.placedOn, locale) }),
  };
}

export default async function AccountOrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  const order = await getAccountOrder(id);

  if (!order) {
    notFound();
  }

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
          { label: t("orders"), href: getAccountOrdersRoutePath() },
          { label: order.id },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-heading">{t("order", { id: order.id })}</h1>
        <span className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${statusClassName[order.status]}`}>
          {t(statusLabel[order.status])}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">{t("placedOn", { date: formatDate(order.placedOn, locale) })}</p>
      <div className="mt-6">
        <AccountOrderDetail order={order} />
      </div>
    </>
  );
}
