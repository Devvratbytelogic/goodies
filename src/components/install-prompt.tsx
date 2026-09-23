"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const STORAGE_KEY = "goodies-pwa-install-dismissed-until";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function isInstallPromptDismissed() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return false;
    }

    const until = Number(raw);
    return Number.isFinite(until) && Date.now() < until;
  } catch {
    return false;
  }
}

function dismissInstallPromptForOneDay() {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now() + ONE_DAY_MS));
  } catch {
    // Ignore private-mode or quota failures and still hide the prompt.
  }
}

function isIosDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
}

function isStandaloneDisplay() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

export function InstallPrompt() {
  const t = useTranslations("InstallPrompt");
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandaloneDisplay()) {
      return;
    }

    const ios = isIosDevice();
    setIsIos(ios);

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      if (isInstallPromptDismissed()) {
        return;
      }

      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    if (ios && !isInstallPromptDismissed()) {
      setVisible(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    };
  }, []);

  if (!visible) {
    return null;
  }

  async function handleInstall() {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  }

  function handleDismiss() {
    dismissInstallPromptForOneDay();
    setDeferredPrompt(null);
    setVisible(false);
  }

  return (
    <aside
      role="dialog"
      aria-labelledby="install-prompt-title"
      aria-describedby="install-prompt-description"
      className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-4 z-40 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-border bg-background p-4 pt-5 shadow-lg lg:bottom-4"
    >
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-2 right-2 rounded-full p-1.5 text-icon-muted hover:bg-primary-soft hover:text-primary"
        aria-label={t("close")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-4"
          aria-hidden
        >
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>
      <div className="space-y-3 pr-7">
        <div className="space-y-1">
          <p
            id="install-prompt-title"
            className="text-sm font-medium text-heading"
          >
            {t("title")}
          </p>
          <p
            id="install-prompt-description"
            className="text-sm text-muted-foreground"
          >
            {isIos ? t("iosHint") : t("description")}
          </p>
        </div>
        {deferredPrompt ? (
          <button
            type="button"
            onClick={handleInstall}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {t("install")}
          </button>
        ) : null}
      </div>
    </aside>
  );
}
