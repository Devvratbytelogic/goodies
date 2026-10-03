"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LuCheck, LuCircleAlert, LuX } from "react-icons/lu";

type Toast = { type: "success" | "error"; message: string };

export function ToastHost() {
  const t = useTranslations("Modal");
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    function onToast(event: Event) {
      const { type, message } = (event as CustomEvent<Toast>).detail;
      setToast({ type, message });
    }

    window.addEventListener("app-toast", onToast);
    return () => window.removeEventListener("app-toast", onToast);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const isError = toast.type === "error";
  const Icon = isError ? LuCircleAlert : LuCheck;

  return (
    <div
      role="status"
      aria-live={isError ? "assertive" : "polite"}
      className={`fixed inset-x-0 bottom-22 z-100 mx-auto flex w-[min(100%-2rem,24rem)] items-start gap-3 rounded-2xl border px-3 py-3 pe-5 shadow-[0_24px_60px_-28px_rgb(0_0_0/0.45)] lg:bottom-6 ${
        isError ? "border-primary/20 bg-primary-soft" : "border-accent/20 bg-surface-soft"
      }`}
    >
      <span
        className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-white ${
          isError ? "bg-primary" : "bg-accent"
        }`}
      >
        <Icon aria-hidden className="size-4" />
      </span>

      <p className="min-w-0 flex-1 pt-1.5 text-sm font-medium leading-5 text-heading">{toast.message}</p>

      <button
        type="button"
        aria-label={t("close")}
        onClick={() => setToast(null)}
        className={`absolute -top-3 -inset-e-3 inline-flex size-7 items-center justify-center rounded-full text-white shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          isError ? "bg-primary hover:bg-primary-hover" : "bg-accent hover:bg-accent-hover"
        }`}
      >
        <LuX aria-hidden className="size-4" />
      </button>
    </div>
  );
}
