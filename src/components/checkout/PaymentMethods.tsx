"use client";

import { useTranslations } from "next-intl";
import { useGetCartQuery } from "@/store/endpoints/cartApi";
import { formatAmount } from "@/utils/price";

export type PaymentMethod = "cod" | "tabby" | "ziina" | "tamara";

type PaymentMethodsProps = {
  value: PaymentMethod | null;
  onChange: (method: PaymentMethod) => void;
  variant?: "default" | "sheet";
  /** Settings default — shown as a badge, not auto-selected. */
  primaryMethod?: PaymentMethod | null;
};

export default function PaymentMethods({ value, onChange, variant = "default", primaryMethod = null }: PaymentMethodsProps) {
  const t = useTranslations("CheckoutClassicPage");
  const { data: cart } = useGetCartQuery(value ?? undefined);
  const cod = cart?.summary?.cod_status ? cart.cod_method : null;
  const methods = (["cod", "ziina", "tabby", "tamara"] as const).filter((method) => method !== "cod" || cod);
  const sheet = variant === "sheet";

  return (
    <div className={sheet ? "grid gap-3" : "mt-6 border-t border-border pt-5"}>
      {sheet ? null : <h2 className="text-base font-bold">{t("paymentMethod")}</h2>}
      <div className={sheet ? "grid gap-3" : "mt-4 grid gap-3"} role="radiogroup" aria-label={t("paymentMethod")}>
        {methods.map((method) => {
          const selected = value === method;
          const isPrimary = primaryMethod === method;
          const title = method === "ziina" ? t("payZiina") : method === "tabby" ? t("payTabby") : method === "tamara" ? t("payTamara") : t("payCod");
          const note = method === "ziina" ? t("payZiinaNote") : method === "tabby" ? t("payTabbyNote") : method === "tamara" ? t("payTamaraNote") : null;

          return (
            <label
              key={method}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border ${sheet ? "p-3.5" : "p-4"} ${selected ? "border-primary bg-primary-soft" : "border-border"}`}
            >
              <input
                type="radio"
                name={sheet ? "checkout-auth-payment-method" : "payment-method"}
                value={method}
                checked={selected}
                onChange={() => onChange(method)}
                className="mt-1 size-4 accent-primary"
              />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-heading">{title}</span>
                  {isPrimary ? (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">{t("primaryMethod")}</span>
                  ) : null}
                </span>
                {note ? <span className="mt-1 block text-sm text-muted">{note}</span> : null}
              </span>
              {method === "cod" && cod ? (
                <span className="shrink-0 text-end text-sm font-bold tabular-nums text-price">
                  {cod.is_free
                    ? t("free")
                    : t("codExtra", { amount: formatAmount(cod.charge, cart?.summary?.currency_symbol ?? "") })}
                </span>
              ) : null}
              {method === "tabby" ? (
                <span className="shrink-0 rounded-md bg-[#3cff7e] px-2 py-1 text-sm font-black tracking-tight text-black lowercase">tabby</span>
              ) : null}
              {method === "ziina" ? (
                <span className="shrink-0 rounded-md bg-black px-2 py-1 text-sm font-black tracking-tight text-white lowercase">ziina</span>
              ) : null}
              {method === "tamara" ? (
                <span className="shrink-0 rounded-md bg-linear-to-r from-[#ff8a00] via-[#ff4d8d] to-[#7c3aed] px-2 py-1 text-sm font-bold text-white">tamara</span>
              ) : null}
            </label>
          );
        })}
      </div>
    </div>
  );
}
