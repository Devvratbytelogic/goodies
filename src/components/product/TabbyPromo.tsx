"use client";

import { useLocale, useTranslations } from "next-intl";
import { useModal } from "@/components/layout/common/ModalProvider";
import { formatAmount } from "@/utils/price";

type TabbyPromoProps = {
  price: number;
  currencySymbol: string;
};

export default function TabbyPromo({ price, currencySymbol }: TabbyPromoProps) {
  const t = useTranslations("ProductPage");
  const locale = useLocale();
  const { openModal } = useModal();

  function openTabbyInfo() {
    const lang = locale === "ar" ? "ar" : "en";
    // Tabby only accepts currency codes (AED, SAR, KWD), not symbols
    const src = `https://checkout.tabby.ai/promos/product-page/installments/${lang}/?price=${price}&currency=AED`;

    openModal({
      title: t("tabbyModalTitle"),
      size: "md",
      content: (
        // edge to edge under the title; the background matches Tabby's page so there is no white flash while it loads
        <div className="-mx-5 -mb-5 border-t border-border bg-[#f4f3f0]">
          <iframe src={src}  className="block h-[min(75dvh,680px)] w-full border-0" />
        </div>
      ),
    });
  }

  return (
    <button
      type="button"
      onClick={openTabbyInfo}
      className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md border border-border px-3 py-3 text-start text-sm transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-4"
    >
      <span className="text-foreground">
        {t("tabbyBefore")} <strong>{formatAmount(price / 4, currencySymbol)}/{t("month")}</strong>{" "}
        {t("tabbyAfter")} <span className="font-semibold text-[#2563eb]">{t("learnMore")}</span>
      </span>
      <span className="shrink-0 rounded-md bg-[#3cff7e] px-2 py-1 text-sm font-black tracking-tight text-black lowercase">
        tabby
      </span>
    </button>
  );
}
