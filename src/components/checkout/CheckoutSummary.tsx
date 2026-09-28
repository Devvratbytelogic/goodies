import { getTranslations } from "next-intl/server";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { Link } from "@/i18n/navigation";
import { getProductRoutePath } from "@/utils/routes";

export type CheckoutLine = {
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type CheckoutSummaryProps = {
  lines: CheckoutLine[];
  shipping: number;
};

function formatAmount(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default async function CheckoutSummary({ lines, shipping }: CheckoutSummaryProps) {
  const t = await getTranslations("CheckoutClassicPage");
  const cards = await getTranslations("ProductCard");
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

  function money(amount: number) {
    return cards("price", { amount: formatAmount(amount) });
  }

  return (
    <aside className="overflow-hidden rounded-2xl border border-border bg-background lg:sticky lg:top-24">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-base font-bold">{t("summary")}</h2>
      </div>
      <ul className="divide-y divide-border px-5">
        {lines.map((line) => (
          <li key={line.slug} className="flex items-center gap-3 py-4">
            <Link
              href={getProductRoutePath(line.slug)}
              aria-label={line.name}
              className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-surface"
            >
              <ImageComponent
                src={line.image}
                alt=""
                width={128}
                height={128}
                sizes="64px"
                objectFit="cover"
                className="size-full"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={getProductRoutePath(line.slug)} className="line-clamp-2 text-sm font-semibold hover:text-primary">
                {line.name}
              </Link>
              <p className="mt-1 text-xs text-muted">{t("quantity", { count: line.quantity })}</p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-price">{money(line.price * line.quantity)}</p>
          </li>
        ))}
      </ul>
      <dl className="space-y-3 border-t border-border px-5 py-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted">{t("subtotal")}</dt>
          <dd className="font-semibold">{money(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted">
            {t("shipping")}
            <span className="mt-0.5 block text-xs">{t("shippingNote")}</span>
          </dt>
          <dd className="font-semibold">{money(shipping)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-xl bg-surface px-3 py-3">
          <dt className="font-bold">{t("total")}</dt>
          <dd className="text-base font-bold text-price">{money(subtotal + shipping)}</dd>
        </div>
      </dl>
    </aside>
  );
}
