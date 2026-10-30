"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { LuChevronLeft } from "react-icons/lu";
import { useAuth } from "@/components/auth/AuthProvider";
import CheckoutAddress from "@/components/auth/CheckoutAddress";
import EmailVerify from "@/components/auth/EmailVerify";
import CheckoutPayment, { startingMethod } from "@/components/checkout/CheckoutPayment";
import OrderSummary, { type CouponCelebration, type CouponCelebrationEvent } from "@/components/checkout/OrderSummary";
import { type PaymentMethod } from "@/components/checkout/PaymentMethods";
import Celebration from "@/components/layout/common/Celebration";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { useModal } from "@/components/layout/common/ModalProvider";
import { Link, useRouter } from "@/i18n/navigation";
import { PlacedOrder } from "@/server/types/order";
import { useGetGlobalSettingsQuery } from "@/store/endpoints/settingsApi";
import { getAccountOrderRoutePath, getHomeRoutePath } from "@/utils/routes";

type CheckoutStep = "email" | "address" | "payment";

type CheckoutAuthProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function CheckoutAuth({ open = true, onClose }: CheckoutAuthProps) {
  const t = useTranslations("EmailVerify");
  const paymentText = useTranslations("CheckoutPayment");
  const celebrate = useTranslations("Celebration");
  const router = useRouter();
  const { token } = useAuth();
  const { isOpen: isModalOpen } = useModal();
  const { data: settings } = useGetGlobalSettingsQuery();
  const dialogRef = useRef<HTMLDivElement>(null);
  const celebratedExistingRef = useRef<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [step, setStep] = useState<CheckoutStep>(token ? "address" : "email");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [couponCelebration, setCouponCelebration] = useState<CouponCelebration | null>(null);
  const visible = open && !dismissed;
  const selectedMethod = paymentMethod ?? startingMethod(settings?.default_payment_method);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) setDismissed(false);
  }, [open]);

  useEffect(() => {
    if (!visible) {
      celebratedExistingRef.current = null;
      setCouponCelebration(null);
    }
  }, [visible]);

  useEffect(() => {
    if (token && step === "email") setStep("address");
  }, [token, step]);

  const close = useCallback(() => {
    setDismissed(true);
    onClose?.();
  }, [onClose]);

  const onCouponApplied = useCallback((event: CouponCelebrationEvent) => {
    if (event.source === "existing" && celebratedExistingRef.current === event.offer) return;
    celebratedExistingRef.current = event.offer;
    setCouponCelebration({ offer: event.offer, amount: event.amount });
  }, []);

  function handlePlaced(order: PlacedOrder) {
    close();
    router.push(getAccountOrderRoutePath(order.order_id));
  }

  function handleBack() {
    if (step === "payment") {
      setStep("address");
      return;
    }
    close();
  }

  useEffect(() => {
    if (!visible) return;

    const html = document.documentElement;
    const { body } = document;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyTouchAction = body.style.touchAction;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.touchAction = "none";
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !couponCelebration && !isModalOpen) {
        event.preventDefault();
        event.stopPropagation();
        close();
      }
    }

    function blockBackgroundScroll(event: TouchEvent | WheelEvent) {
      const target = event.target;
      if (!(target instanceof Node) || !dialogRef.current?.contains(target)) {
        event.preventDefault();
      }
    }

    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("wheel", blockBackgroundScroll, { passive: false, capture: true });
    document.addEventListener("touchmove", blockBackgroundScroll, { passive: false, capture: true });

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.touchAction = previousBodyTouchAction;
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("wheel", blockBackgroundScroll, true);
      document.removeEventListener("touchmove", blockBackgroundScroll, true);
    };
  }, [visible, close, couponCelebration, isModalOpen]);

  if (!mounted || !visible) return null;

  const orderSummary = <OrderSummary paymentMethod={selectedMethod} onCouponApplied={onCouponApplied} />;
  const backLabel = step === "payment" ? paymentText("back") : t("back");

  return createPortal(
    <div className="fixed inset-0 z-200 flex justify-center" role="presentation">
      <div className="absolute inset-0 bg-black/55" aria-hidden onClick={(event) => event.stopPropagation()} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="relative z-10 flex h-full w-full flex-col bg-surface-soft outline-none sm:w-1/2 xl:w-1/3"
      >
        <header className="relative flex h-16 shrink-0 items-center justify-center bg-white px-12">
          <button
            type="button"
            onClick={handleBack}
            aria-label={backLabel}
            className="absolute inset-s-3 inline-flex size-9 items-center justify-center rounded-full text-heading transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <LuChevronLeft aria-hidden className="size-5 rtl:rotate-180" />
          </button>
          <Link href={getHomeRoutePath()} className="inline-flex">
            <ImageComponent src="/logo/logo.webp" alt={t("brand")} width={80} height={80} sizes="80px" objectFit="contain" className="h-14! w-auto" />
          </Link>
        </header>

        {step === "email" ? (
          <div className="checkout-auth-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            <div className="grid gap-3">
              {orderSummary}
              <div className="rounded-xl bg-white px-3.5 py-4">
                <EmailVerify onVerified={() => setStep("address")} />
              </div>
            </div>
          </div>
        ) : step === "address" ? (
          <CheckoutAddress onDone={() => setStep("payment")} header={orderSummary} />
        ) : (
          <CheckoutPayment header={orderSummary} onPaymentMethodChange={setPaymentMethod} onPlaced={handlePlaced} />
        )}

        {couponCelebration ? (
          <Celebration
            contained
            title={celebrate("hurray")}
            actionLabel={celebrate("thanks")}
            onClose={() => setCouponCelebration(null)}
          >
            <p>{celebrate("applied", { offer: couponCelebration.offer })}</p>
            <p className="font-bold">{celebrate("youSaved", { amount: couponCelebration.amount })}</p>
          </Celebration>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
