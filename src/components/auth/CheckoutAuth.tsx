"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LuChevronLeft } from "react-icons/lu";
import OrderSummary from "@/components/checkout/OrderSummary";
import ImageComponent from "@/components/layout/common/ImageComponent";

type CheckoutAuthProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function CheckoutAuth({ open = true, onClose }: CheckoutAuthProps) {
  const t = useTranslations("EmailVerify");
  const dialogRef = useRef<HTMLDivElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const visible = open && !dismissed;

  useEffect(() => {
    if (open) setDismissed(false);
  }, [open]);

  const close = useCallback(() => {
    setDismissed(true);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [visible, close]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-90 flex justify-center">
      <div className="absolute inset-0 bg-black/55" onClick={close} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="relative z-100 flex h-full w-full flex-col bg-surface-soft outline-none sm:w-1/2 lg:w-1/3"
      >
        <header className="relative flex h-16 shrink-0 items-center justify-center bg-white px-12">
          <button
            type="button"
            onClick={close}
            aria-label="Back"
            className="absolute inset-s-3 inline-flex size-9 items-center justify-center rounded-full text-heading transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <LuChevronLeft aria-hidden className="size-5 rtl:rotate-180" />
          </button>
          <ImageComponent src="/logo/logo.webp" alt={t("brand")} width={80} height={80} sizes="80px" objectFit="contain" className="h-14! w-auto" />
        </header>
        <div className="flex-1 overflow-y-auto bg px-4 py-4">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
