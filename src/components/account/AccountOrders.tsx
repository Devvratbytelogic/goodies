import { getLocale, getTranslations } from "next-intl/server";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { Link } from "@/i18n/navigation";
import { getAccountOrders, type AccountOrder } from "@/components/account/orders";
import { getProductRoutePath } from "@/utils/routes";

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
              <p className="font-semibold text-heading">{t("order", { id: order.id })}</p>
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
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm sm:px-5">
            <span className="text-muted">{t("items", { count: order.lines.reduce((sum, line) => sum + line.quantity, 0) })}</span>
            <span className="font-bold tabular-nums text-price">{cards("price", { amount: formatAmount(order.total) })}</span>
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
