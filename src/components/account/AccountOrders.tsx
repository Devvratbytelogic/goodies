import moment from "moment";
import { getLocale, getTranslations } from "next-intl/server";
import { LuChevronRight } from "react-icons/lu";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { Link } from "@/i18n/navigation";
import { getAccountOrders, orderTrackingSteps, type AccountOrder } from "@/components/account/orders";
import { sampleAddresses } from "@/data/sampleAddresses";
import { getAccountOrderRoutePath, getProductRoutePath } from "@/utils/routes";

const statusClassName = {
  processing: "bg-surface text-muted",
  shipped: "bg-primary-soft text-primary",
  delivered: "bg-surface-soft text-accent-deep",
} as const;

const statusLabel = {
  processing: "statusProcessing",
  shipped: "statusShipped",
  delivered: "statusDelivered",
} as const;

const trackLabel = {
  placed: "trackPlaced",
  processing: "trackProcessing",
  shipped: "trackShipped",
  delivered: "trackDelivered",
} as const;

const trackNote = {
  placed: "trackPlacedNote",
  processing: "trackProcessingNote",
  shipped: "trackShippedNote",
  delivered: "trackDeliveredNote",
} as const;

function formatAmount(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(value: string, locale: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function formatDateTime(value: string, locale: string) {
  return moment.utc(value).utcOffset(4).locale(locale).format("MMM D, YYYY, h:mm A");
}

export async function AccountOrderList({ orders }: { orders: AccountOrder[] }) {
  const t = await getTranslations("AccountPage");
  const cards = await getTranslations("ProductCard");
  const locale = await getLocale();

  if (orders.length === 0) {
    return <p className="text-sm text-muted">{t("noOrders")}</p>;
  }

  return (
    <ul className="grid gap-4">
      {orders.map((order) => (
        <li key={order.id} className="overflow-hidden rounded-2xl border border-border bg-background">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
            <div>
              <Link
                href={getAccountOrderRoutePath(order.id)}
                className="font-semibold text-heading hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t("order", { id: order.id })}
              </Link>
              <p className="mt-0.5 text-sm text-muted">{t("placedOn", { date: formatDate(order.placedOn, locale) })}</p>
            </div>
            <span className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${statusClassName[order.status]}`}>
              {t(statusLabel[order.status])}
            </span>
          </div>
          <ul className="divide-y divide-border">
            {order.lines.map((line) => (
              <li key={line.slug} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                <Link
                  href={getProductRoutePath(line.slug)}
                  aria-label={line.name}
                  className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-border/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <ImageComponent src={line.image} alt="" width={112} height={112} sizes="56px" objectFit="cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={getProductRoutePath(line.slug)}
                    className="font-medium text-heading hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {line.name}
                  </Link>
                  <p className="mt-0.5 text-sm text-muted">{t("lineQuantity", { count: line.quantity })}</p>
                </div>
                <p className="text-sm font-semibold tabular-nums text-price">{cards("price", { amount: formatAmount(line.price * line.quantity) })}</p>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between gap-4 border-t border-border bg-surface/60 px-4 py-3.5 sm:px-5">
            <div>
              <p className="text-xs font-medium text-muted">{t("orderTotal")}</p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-price">{cards("price", { amount: formatAmount(order.total) })}</p>
              <p className="mt-0.5 text-xs text-muted">{t("items", { count: order.lines.reduce((sum, line) => sum + line.quantity, 0) })}</p>
            </div>
            <Link
              href={getAccountOrderRoutePath(order.id)}
              className="inline-flex h-10 shrink-0 items-center gap-1 rounded-full border border-border bg-background px-4 text-sm font-semibold text-heading transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {t("viewDetails")}
              <LuChevronRight aria-hidden className="size-4 rtl:-scale-x-100" />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

export async function AccountOrderSection({ limit }: { limit?: number }) {
  const orders = await getAccountOrders();
  return <AccountOrderList orders={limit ? orders.slice(0, limit) : orders} />;
}

export async function AccountOrderDetail({ order }: { order: AccountOrder }) {
  const t = await getTranslations("AccountPage");
  const cards = await getTranslations("ProductCard");
  const locale = await getLocale();
  const address = sampleAddresses[0];
  const current = orderTrackingSteps.indexOf(order.status);

  return (
    <div className="grid gap-4">
      <section className="rounded-2xl border border-border bg-background px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-heading">{t("tracking")}</h2>
          {order.trackingNumber ? (
            <p className="text-xs text-muted">
              {t("trackingNumber")}
              <span className="mt-0.5 block font-mono text-sm font-semibold tracking-wide text-heading" dir="ltr">
                {order.trackingNumber}
              </span>
            </p>
          ) : (
            <p className="max-w-56 text-xs text-muted">{t("trackingSoon")}</p>
          )}
        </div>
        <ol className="mt-4">
          {orderTrackingSteps.map((step, index) => {
            const event = order.history.find((item) => item.step === step);
            const reached = index <= current;
            const active = index === current;
            const last = index === orderTrackingSteps.length - 1;

            return (
              <li key={step} className="flex gap-3">
                <div className="flex w-5 shrink-0 flex-col items-center">
                  <span
                    className={`size-5 rounded-full border-2 ${
                      reached ? "border-primary bg-primary" : "border-border bg-background"
                    } ${active ? "ring-4 ring-primary-soft" : ""}`}
                  />
                  {last ? null : <span aria-hidden className={`my-1 w-0.5 flex-1 ${index < current ? "bg-primary" : "bg-border"}`} />}
                </div>
                <div className={`min-w-0 ${last ? "" : "pb-5"}`}>
                  <p className={`text-sm font-semibold leading-5 ${reached ? "text-heading" : "text-muted"}`}>{t(trackLabel[step])}</p>
                  {event ? <p className="mt-0.5 text-xs text-muted">{formatDateTime(event.at, locale)}</p> : null}
                  {reached ? <p className="mt-0.5 text-sm text-muted">{t(trackNote[step])}</p> : null}
                </div>
              </li>
            );
          })}
        </ol>
      </section>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
        <section className="overflow-hidden rounded-2xl border border-border bg-background">
          <h2 className="border-b border-border px-4 py-3 text-sm font-semibold text-heading sm:px-5">{t("orderItems")}</h2>
          <ul className="divide-y divide-border">
            {order.lines.map((line) => (
              <li key={line.slug} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                <Link
                  href={getProductRoutePath(line.slug)}
                  aria-label={line.name}
                  className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-border/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <ImageComponent src={line.image} alt="" width={112} height={112} sizes="56px" objectFit="cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={getProductRoutePath(line.slug)}
                    className="font-medium text-heading hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {line.name}
                  </Link>
                  <p className="mt-0.5 text-sm text-muted">{t("lineQuantity", { count: line.quantity })}</p>
                </div>
                <p className="text-sm font-semibold tabular-nums text-price">{cards("price", { amount: formatAmount(line.price * line.quantity) })}</p>
              </li>
            ))}
          </ul>
        </section>
        <div className="grid content-start gap-4">
          <section className="rounded-2xl border border-border bg-background px-5 py-4">
            <h2 className="text-sm font-semibold text-heading">{t("shipTo")}</h2>
            <p className="mt-2 text-sm font-medium text-heading">
              {address.firstName} {address.lastName}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {address.address}
              <br />
              {address.city}
            </p>
            <p className="mt-2 text-sm text-heading" dir="ltr">
              {address.phone}
            </p>
          </section>
          <section className="rounded-2xl border border-border bg-background px-5 py-4">
            <h2 className="text-sm font-semibold text-heading">{t("orderSummary")}</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">{t("subtotal")}</dt>
                <dd className="font-semibold tabular-nums text-heading">{cards("price", { amount: formatAmount(order.subtotal) })}</dd>
              </div>
              {order.discount > 0 ? (
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted">
                    {t("orderCoupon")}
                    {order.couponCode ? <span className="mt-0.5 block text-xs font-semibold tracking-wide text-primary">{order.couponCode}</span> : null}
                  </dt>
                  <dd className="font-semibold tabular-nums text-price">−{cards("price", { amount: formatAmount(order.discount) })}</dd>
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">{t("shipping")}</dt>
                <dd className="font-semibold tabular-nums text-heading">{cards("price", { amount: formatAmount(order.shipping) })}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2.5">
                <dt className="font-semibold text-heading">{t("orderTotal")}</dt>
                <dd className="font-bold tabular-nums text-price">{cards("price", { amount: formatAmount(order.total) })}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
