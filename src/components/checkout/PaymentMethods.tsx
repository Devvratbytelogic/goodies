"use client";

import { useTranslations } from "next-intl";

export type PaymentMethod = "cod" | "tabby" | "ziina";

type PaymentMethodsProps = {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
};

export default function PaymentMethods({ value, onChange }: PaymentMethodsProps) {
  const t = useTranslations("CheckoutClassicPage");

  return (
    <div className="mt-6 border-t border-border pt-5">
      <h2 className="text-base font-bold">{t("paymentMethod")}</h2>
      <div className="mt-4 grid gap-3" role="radiogroup" aria-label={t("paymentMethod")}>
        {(["cod", "ziina", "tabby"] as const).map((method) => {
          const selected = value === method;
          const title = method === "ziina" ? t("payZiina") : method === "tabby" ? t("payTabby") : t("payCod");
          const note = method === "ziina" ? t("payZiinaNote") : method === "tabby" ? t("payTabbyNote") : null;

          return (
            <label
              key={method}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${selected ? "border-primary bg-primary-soft" : "border-border"}`}
            >
              <input
                type="radio"
                name="payment-method"
                value={method}
                checked={selected}
                onChange={() => onChange(method)}
                className="mt-1 size-4 accent-primary"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-heading">{title}</span>
                {note ? <span className="mt-1 block text-sm text-muted">{note}</span> : null}
              </span>
              {method === "tabby" ? (
                <span className="shrink-0 rounded-md bg-[#3cff7e] px-2 py-1 text-sm font-black tracking-tight text-black lowercase">tabby</span>
              ) : null}
              {method === "ziina" ? (
                <span className="shrink-0 rounded-md bg-black px-2 py-1 text-sm font-black tracking-tight text-white lowercase">ziina</span>
              ) : null}
            </label>
          );
        })}
      </div>
    </div>
  );
}
