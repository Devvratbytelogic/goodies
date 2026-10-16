"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { RequiredMark } from "@/components/form/RequiredMark";
import { useModal } from "@/components/layout/common/ModalProvider";
import { useCancelOrderMutation } from "@/store/endpoints/orderApi";
import type { OrderDetails, OrderDetailsItem } from "@/server/types/order";
import { formatAmount } from "@/utils/price";
import { cancelOrderValidationSchema } from "@/validations";

type CancelValues = {
  order_item_ids: string[];
  reason: string;
  description: string;
};

const reasons = ["changedMind", "orderedByMistake", "deliveryLate", "other"] as const;

const reasonLabel = {
  changedMind: "cancelReasonChangedMind",
  orderedByMistake: "cancelReasonMistake",
  deliveryLate: "cancelReasonDelivery",
  other: "cancelReasonOther",
} as const;

const fieldClassName =
  "mt-1.5 h-12 w-full rounded-xl font-normal! border border-border bg-surface px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:bg-background";

const quietButtonClassName =
  "inline-flex h-10 items-center justify-center rounded-full border border-border px-5 text-sm font-semibold text-heading transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60";

const primaryButtonClassName =
  "inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70";

function ProductRow({ item, currency }: { item: OrderDetailsItem; currency: string }) {
  const t = useTranslations("AccountPage");

  return (
    <div className="flex items-center gap-3">
      <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-background ring-1 ring-border/70">
        <ImageComponent src={item.image || item.thumbnail || ""} alt="" width={112} height={112} sizes="56px" objectFit="cover" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-sm font-medium leading-5 text-heading">{item.title}</span>
        <span className="mt-1 inline-flex h-6 items-center rounded-full bg-background px-2 text-xs font-semibold text-muted ring-1 ring-border">
          {t("lineQuantity", { count: item.quantity })}
        </span>
      </span>
      <span className="shrink-0 text-sm font-semibold tabular-nums text-price">{formatAmount(item.line_total, item.currency_symbol || currency)}</span>
    </div>
  );
}

function CancelOrderForm({ order }: { order: OrderDetails }) {
  const t = useTranslations("AccountPage");
  const { closeModal } = useModal();
  const [cancelOrder, { isLoading }] = useCancelOrderMutation();
  const items = (order.items ?? []).filter((item) => !item.cancelled);
  const multiple = items.length > 1;
  const currency = order.summary?.currency_symbol || "";
  const [step, setStep] = useState<"select" | "details">(multiple ? "select" : "details");
  const formik = useFormik<CancelValues>({
    initialValues: {
      order_item_ids: items.length === 1 ? [items[0].item_id] : [],
      reason: "",
      description: "",
    },
    validationSchema: cancelOrderValidationSchema,
    onSubmit: async (values) => {
      try {
        await cancelOrder({
          orderId: order.order_id,
          reason: t(reasonLabel[values.reason as (typeof reasons)[number]]),
          description: values.description.trim(),
          order_item_ids: values.order_item_ids,
        }).unwrap();
        closeModal();
      } catch (error) {
        console.error("Error canceling order", error);
      }
    },
  });

  const selected = formik.values.order_item_ids;
  const chosen = items.filter((item) => selected.includes(item.item_id));
  function fieldText(error?: string) {
    if (error === "required" || error === "tooLong") return t(error);
    return "";
  }

  const reasonError = formik.touched.reason ? fieldText(formik.errors.reason) : "";
  const descriptionError = formik.touched.description ? fieldText(formik.errors.description) : "";
  const itemsError = formik.touched.order_item_ids ? fieldText(typeof formik.errors.order_item_ids === "string" ? formik.errors.order_item_ids : "") : "";

  function toggle(item: OrderDetailsItem) {
    const next = selected.includes(item.item_id) ? selected.filter((id) => id !== item.item_id) : [...selected, item.item_id];
    formik.setFieldValue("order_item_ids", next);
  }

  async function continueToDetails() {
    formik.setFieldTouched("order_item_ids", true);
    const errors = await formik.validateForm();
    if (!errors.order_item_ids) setStep("details");
  }

  if (step === "select") {
    return (
      <div>
        <p className="text-sm text-muted">{t("cancelSelect")}</p>
        <ul className="mt-4 grid gap-3">
          {items.map((item) => {
            const checked = selected.includes(item.item_id);
            return (
              <li key={item.item_id} className={`rounded-xl border px-3 py-3 ${checked ? "border-primary bg-primary-soft/40" : "border-border bg-surface"}`}>
                <label className="flex cursor-pointer items-center gap-3">
                  <input type="checkbox" checked={checked} onChange={() => toggle(item)} className="size-4 shrink-0 accent-primary" />
                  <div className="min-w-0 flex-1">
                    <ProductRow item={item} currency={currency} />
                  </div>
                </label>
              </li>
            );
          })}
        </ul>
        {itemsError ? <p className="mt-3 text-xs text-primary">{itemsError}</p> : null}
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={closeModal} className={quietButtonClassName}>
            {t("cancel")}
          </button>
          <button type="button" onClick={continueToDetails} className={primaryButtonClassName}>
            {t("cancelContinue")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={formik.handleSubmit}>
      {chosen.length > 0 ? (
        <ul className="grid gap-2" aria-label={t("orderItems")}>
          {chosen.map((item) => (
            <li key={item.item_id} className="rounded-xl bg-surface px-3 py-2.5">
              <ProductRow item={item} currency={currency} />
            </li>
          ))}
        </ul>
      ) : null}
      <label className="block text-[13px] font-semibold text-heading">
        {t("cancelReason")}
        <RequiredMark />
        <select name="reason" value={formik.values.reason} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={Boolean(reasonError)} className={fieldClassName}>
          <option value="">{t("cancelReasonPlaceholder")}</option>
          {reasons.map((key) => (
            <option key={key} value={key}>
              {t(reasonLabel[key])}
            </option>
          ))}
        </select>
        {reasonError ? <p className="mt-1.5 text-xs font-normal text-primary">{reasonError}</p> : null}
      </label>
      <label className="block text-[13px] font-semibold text-heading">
        {t("cancelDetails")}
        {formik.values.reason === "other" ? <RequiredMark /> : null}
        <textarea
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          aria-invalid={Boolean(descriptionError)}
          rows={3}
          spellCheck={false}
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
          placeholder={t("cancelDetailsPlaceholder")}
          className="mt-1.5 w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm font-normal text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-primary focus:bg-background"
        />
        {descriptionError ? <p className="mt-1.5 text-xs font-normal text-primary">{descriptionError}</p> : null}
      </label>
      <div className="flex justify-end gap-3">
        <button type="button" onClick={multiple ? () => setStep("select") : closeModal} disabled={isLoading} className={quietButtonClassName}>
          {multiple ? t("cancelBack") : t("cancel")}
        </button>
        <button type="submit" disabled={isLoading} className={primaryButtonClassName}>
          {isLoading ? t("cancelSubmitting") : t("cancelConfirm")}
        </button>
      </div>
    </form>
  );
}

export default function OrderCancellation({ order }: { order: OrderDetails }) {
  const t = useTranslations("AccountPage");
  const { openModal } = useModal();

  if (!order.can_cancel) return null;

  return (
    <div>
      {order.cancel_message ? <p className="text-sm text-muted">{order.cancel_message}</p> : null}
      <button
        type="button"
        onClick={() => openModal({ title: t("cancelOrder"), size: "lg", content: <CancelOrderForm order={order} /> })}
        className="mt-3 inline-flex h-10 items-center justify-center rounded-full border border-border px-5 text-sm font-semibold text-heading transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t("cancelOrder")}
      </button>
    </div>
  );
}
