"use client";

import { useLocale, useTranslations } from "next-intl";
import type { OrderStatusBanner, OrderTimelineEvent } from "@/server/types/order";

export default function OrderTracking({
  banner,
  timeline,
  label,
}: {
  banner?: OrderStatusBanner | null;
  timeline?: OrderTimelineEvent[] | null;
  label: (value: string) => string;
}) {
  const t = useTranslations("AccountPage");
  const locale = useLocale();
  const events = timeline ?? [];

  if (!banner && events.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border bg-background px-5 py-4">
      {banner?.title ? <h2 className="text-lg font-semibold text-heading">{label(banner.title)}</h2> : null}
      {banner?.subtitle ? <p className="mt-1 text-sm text-muted">{banner.subtitle}</p> : null}
      {banner?.courier || banner?.tracking_id ? (
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {banner.courier ? (
            <p className="text-sm text-muted">
              {t("courier")}
              <span className="mt-0.5 block font-semibold text-heading">{banner.courier}</span>
            </p>
          ) : null}
          {banner.tracking_id ? (
            <p className="text-sm text-muted">
              {t("trackingNumber")}
              <span className="mt-0.5 block font-mono text-sm font-semibold tracking-wide text-heading" dir="ltr">
                {banner.tracking_id}
              </span>
            </p>
          ) : null}
        </div>
      ) : null}
      {events.length > 0 ? (
        <ol className="mt-4" aria-label={t("orderUpdates")}>
          {events.map((event, index) => {
            const last = index === events.length - 1;
            const message = event.message?.trim();
            const reason = event.reason?.trim();
            const details = event.description?.trim();
            const shownReason = reason && reason !== message ? reason : "";
            const shownDetails = details && details !== message && details !== reason ? details : "";
            return (
              <li key={`${event.status}-${event.at}`} className="flex gap-3">
                <div className="flex w-5 shrink-0 flex-col items-center">
                  <span className={`size-5 rounded-full border-2 border-primary bg-primary ${last ? "ring-4 ring-primary-soft" : ""}`} />
                  {last ? null : <span aria-hidden className="my-1 w-0.5 flex-1 bg-primary" />}
                </div>
                <div className={`min-w-0 ${last ? "" : "pb-5"}`}>
                  <p className="text-sm font-semibold leading-5 text-heading">{label(event.status)}</p>
                  <p className="mt-0.5 text-xs text-muted">{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(event.at))}</p>
                  {message ? <p className="mt-1 text-sm leading-5 text-muted">{message}</p> : null}
                  {shownReason ? (
                    <p className="mt-1 text-sm text-muted">
                      <span className="font-medium text-heading">{t("cancelReason")}: </span>
                      {shownReason}
                    </p>
                  ) : null}
                  {shownDetails ? (
                    <p className="mt-0.5 text-sm text-muted">
                      <span className="font-medium text-heading">{t("cancelDetails")}: </span>
                      {shownDetails}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      ) : null}
    </section>
  );
}
