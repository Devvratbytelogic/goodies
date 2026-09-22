"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ImageComponent from "@/components/layout/common/ImageComponent";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

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

export default function InstallAppBanner() {
  const t = useTranslations("MadeWithLoveSection");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (isStandaloneDisplay()) {
      setInstalled(true);
      return;
    }

    setIsIos(isIosDevice());

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  async function handleInstall() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      if (choice.outcome === "accepted") {
        setInstalled(true);
      }
      return;
    }

    if (isIos) {
      setShowIosHint(true);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 rounded-2xl bg-linear-to-r/oklch from-primary to-accent-deep p-2.5  sm:gap-4 sm:rounded-full sm:px-3 sm:py-2.5">
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background sm:size-14">
          <ImageComponent
            src="/logo/logo.webp"
            alt="Goodies"
            width={112}
            height={112}
            objectFit="contain"
            sizes="56px"
            className="p-1"
          />
        </div>

        <div className="min-w-0 flex-1 text-primary-foreground">
          <p className="text-sm font-bold leading-tight sm:text-base">{t("installTitle")}</p>
          <p className="mt-0.5 text-[11px] leading-snug text-primary-foreground/85 sm:text-sm">
            {t("installDescription")}
          </p>
        </div>

        <button
          type="button"
          onClick={handleInstall}
          disabled={installed}
          className="h-10 shrink-0 rounded-full bg-background px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background disabled:cursor-default disabled:opacity-70 sm:h-11 sm:px-6"
        >
          {installed ? t("installed") : t("install")}
        </button>
      </div>

      {showIosHint ? (
        <p className="mt-3 text-center text-xs leading-relaxed text-muted sm:text-sm">
          {t("iosHint")}
        </p>
      ) : null}
    </div>
  );
}
