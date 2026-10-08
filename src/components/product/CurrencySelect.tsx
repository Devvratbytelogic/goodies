"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LuCheck, LuChevronDown } from "react-icons/lu";
import { api } from "@/store/api";
import { useAppDispatch } from "@/store/hooks";
import { currencies, type CurrencyCode } from "@/utils/currency";
import { writeCurrencyCookie } from "@/utils/currencyCookie";

const flagClass = "h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] ring-1 ring-black/10";

function CurrencyFlag({ code }: { code: CurrencyCode }) {
  switch (code) {
    case "AED":
      return (
        <svg viewBox="0 0 20 14" className={flagClass} aria-hidden>
          <rect width="20" height="14" fill="#00732f" />
          <rect y="4.67" width="20" height="4.66" fill="#fff" />
          <rect y="9.33" width="20" height="4.67" fill="#000" />
          <rect width="5.5" height="14" fill="#ff0000" />
        </svg>
      );
    case "USD":
      return (
        <svg viewBox="0 0 20 14" className={flagClass} aria-hidden>
          <rect width="20" height="14" fill="#bf0a30" />
          <rect y="1.08" width="20" height="1.07" fill="#fff" />
          <rect y="3.23" width="20" height="1.07" fill="#fff" />
          <rect y="5.38" width="20" height="1.07" fill="#fff" />
          <rect y="7.54" width="20" height="1.07" fill="#fff" />
          <rect y="9.69" width="20" height="1.07" fill="#fff" />
          <rect y="11.85" width="20" height="1.07" fill="#fff" />
          <rect width="8.4" height="7.54" fill="#002868" />
        </svg>
      );
    case "EUR":
      return (
        <svg viewBox="0 0 20 14" className={flagClass} aria-hidden>
          <rect width="20" height="14" fill="#003399" />
          <g fill="#fc0">
            <circle cx="10" cy="2.2" r="0.55" />
            <circle cx="12.7" cy="3.2" r="0.55" />
            <circle cx="14.2" cy="5.4" r="0.55" />
            <circle cx="13.6" cy="8" r="0.55" />
            <circle cx="11.6" cy="9.8" r="0.55" />
            <circle cx="8.4" cy="9.8" r="0.55" />
            <circle cx="6.4" cy="8" r="0.55" />
            <circle cx="5.8" cy="5.4" r="0.55" />
            <circle cx="7.3" cy="3.2" r="0.55" />
          </g>
        </svg>
      );
    case "SAR":
      return (
        <svg viewBox="0 0 20 14" className={flagClass} aria-hidden>
          <rect width="20" height="14" fill="#006c35" />
          <rect x="4" y="3.2" width="12" height="1.1" fill="#fff" />
          <rect x="6.2" y="5.4" width="7.6" height="1.1" fill="#fff" />
          <path d="M10 6.2v4.2" stroke="#fff" strokeWidth="1.1" />
        </svg>
      );
    case "QAR":
      return (
        <svg viewBox="0 0 20 14" className={flagClass} aria-hidden>
          <rect width="20" height="14" fill="#8d1b3d" />
          <path fill="#fff" d="M0 0h7.2l1.6 1.4L7.2 2.8l1.6 1.4L7.2 5.6l1.6 1.4L7.2 8.4l1.6 1.4L7.2 11.2 8.8 12.6 7.2 14H0z" />
        </svg>
      );
    case "KWD":
      return (
        <svg viewBox="0 0 20 14" className={flagClass} aria-hidden>
          <rect width="20" height="14" fill="#fff" />
          <rect width="20" height="4.67" fill="#007a3d" />
          <rect y="9.33" width="20" height="4.67" fill="#ce1126" />
          <path fill="#000" d="M0 0l6.2 4.67L0 9.33V0z" />
        </svg>
      );
    case "OMR":
      return (
        <svg viewBox="0 0 20 14" className={flagClass} aria-hidden>
          <rect width="20" height="14" fill="#fff" />
          <rect width="20" height="4.67" fill="#db161b" />
          <rect y="9.33" width="20" height="4.67" fill="#008000" />
          <rect width="5" height="14" fill="#db161b" />
        </svg>
      );
    case "BHD":
      return (
        <svg viewBox="0 0 20 14" className={flagClass} aria-hidden>
          <rect width="20" height="14" fill="#ce1126" />
          <path fill="#fff" d="M0 0h7.4l1.8 1.75L7.4 3.5l1.8 1.75L7.4 7l1.8 1.75L7.4 10.5l1.8 1.75L7.4 14H0z" />
        </svg>
      );
  }
}

export default function CurrencySelect({
  className = "",
  openUp = false,
  value,
}: {
  className?: string;
  openUp?: boolean;
  value: CurrencyCode;
}) {
  const t = useTranslations("Header");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const listId = useId();
  const currencyRef = useRef<HTMLDivElement>(null);
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(value);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  useEffect(() => {
    setCurrencyCode(value);
  }, [value]);

  function selectCurrency(code: CurrencyCode) {
    setCurrencyOpen(false);
    if (code === currencyCode) return;
    setCurrencyCode(code);
    writeCurrencyCookie(code);
    dispatch(api.util.resetApiState());
    router.refresh();
  }

  useEffect(() => {
    if (!currencyOpen) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      if (!currencyRef.current?.contains(event.target as Node)) {
        setCurrencyOpen(false);
      }
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCurrencyOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [currencyOpen]);

  return (
    <div ref={currencyRef} className={`relative ${className || "w-fit"}`}>
      <button
        type="button"
        aria-label={t("currency")}
        aria-haspopup="listbox"
        aria-expanded={currencyOpen}
        aria-controls={listId}
        onClick={() => setCurrencyOpen((open) => !open)}
        className={`inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border bg-background px-3.5 text-sm font-medium text-muted-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${currencyOpen ? "border-primary text-primary" : "border-border/70 hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
          }`}
      >
        <CurrencyFlag code={currencyCode} />
        <span>{currencyCode}</span>
        <LuChevronDown
          aria-hidden
          className={`size-4 text-muted transition-transform ${currencyOpen ? "rotate-180" : ""}`}
        />
      </button>
      {currencyOpen ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={t("currency")}
          className={`absolute inset-e-0 z-30 max-h-60 min-w-full overflow-y-auto overscroll-contain rounded-lg border border-border bg-background py-1 shadow-md ${openUp ? "bottom-full mb-1.5" : "mt-1.5"}`}
        >
          {currencies.map((code) => {
            const selected = code === currencyCode;
            return (
              <li key={code} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => selectCurrency(code)}
                  className={`flex w-full items-center gap-2 px-2.5 py-2 text-start text-sm focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary ${selected ? "bg-primary-soft font-semibold text-primary" : "text-heading hover:bg-surface"
                    }`}
                >
                  <CurrencyFlag code={code} />
                  <span className="flex-1">{code}</span>
                  {selected ? <LuCheck aria-hidden className="size-3.5" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
