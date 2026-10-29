"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { LuX } from "react-icons/lu";
import ImageComponent from "@/components/layout/common/ImageComponent";

type CelebrationProps = {
  open?: boolean;
  onClose?: () => void;
  title: string;
  children: ReactNode;
  actionLabel?: string;
  /** Cover the nearest positioned parent instead of the viewport (width % follows that parent). */
  contained?: boolean;
};

const EXIT_MS = 280;

const CONFETTI_COLORS = ["#ff5b8a", "#ffd166", "#7ce577", "#5ad1e8", "#ff8a4c", "#c084fc", "#f472b6", "#ffffff", "#2cb4c1", "#d60751", "#facc15", "#fb7185"];

function confettiShape(index: number) {
  const kind = index % 5;
  if (kind === 0) return { width: `${5 + (index % 4)}px`, height: `${5 + (index % 4)}px`, radius: "999px" };
  if (kind === 1) return { width: `${5 + (index % 5)}px`, height: `${5 + (index % 5)}px`, radius: "1px" };
  return { width: `${2 + (index % 3)}px`, height: `${10 + (index % 12)}px`, radius: "1px" };
}

const CONFETTI_COUNT = 280;

const confetti = Array.from({ length: CONFETTI_COUNT }, (_, index) => {
  const duration = 3.2 + (index % 10) * 0.28;
  return {
    left: `${(index * 3.7) % 100}%`,
    delay: `${-((index / CONFETTI_COUNT) * duration)}s`,
    duration: `${duration}s`,
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    ...confettiShape(index),
    dx: `${(index % 2 ? 1 : -1) * (18 + (index % 36))}px`,
    rot: `${(index % 2 ? 1 : -1) * (220 + (index % 18) * 38)}deg`,
  };
});

export default function Celebration({ open = true, onClose, title, children, actionLabel, contained = false }: CelebrationProps) {
  const t = useTranslations("Celebration");
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const [closing, setClosing] = useState(false);
  const visible = open && !dismissed;
  const overlayPosition = contained ? "absolute" : "fixed";

  useEffect(() => {
    if (open) {
      setDismissed(false);
      setClosing(false);
    }
  }, [open]);

  const finishClose = useCallback(() => {
    setDismissed(true);
    setClosing(false);
    onClose?.();
  }, [onClose]);

  const close = useCallback(() => {
    if (closing) return;

    const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      finishClose();
      return;
    }

    setClosing(true);
  }, [closing, finishClose]);

  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(finishClose, EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [closing, finishClose]);

  useEffect(() => {
    if (!visible || closing) return;

    dialogRef.current?.focus();
    const autoClose = window.setTimeout(close, 2000);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("keydown", onKeyDown);

    if (contained) {
      return () => {
        window.clearTimeout(autoClose);
        document.removeEventListener("keydown", onKeyDown);
      };
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(autoClose);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [visible, closing, close, contained]);

  if (!visible) return null;

  return (
    <div className={`${overlayPosition} inset-0 z-130 flex items-center justify-center p-4`}>
      <div
        className={`absolute inset-0 bg-black/60 motion-reduce:animate-none ${closing ? "animate-[celebration-backdrop-out_0.28s_ease-in_forwards]" : ""}`}
        onClick={close}
      />
      <div
        className={`pointer-events-none ${overlayPosition} inset-0 z-140 overflow-hidden motion-reduce:hidden ${closing ? "animate-[celebration-backdrop-out_0.28s_ease-in_forwards]" : ""}`}
        aria-hidden
      >
        {confetti.map((piece, index) => (
          <span
            key={index}
            className="absolute top-0"
            style={{
              left: piece.left,
              width: piece.width,
              height: piece.height,
              borderRadius: piece.radius,
              background: piece.color,
              animation: `celebration-fall ${piece.duration} linear ${piece.delay} infinite`,
              ["--dx" as string]: piece.dx,
              ["--rot" as string]: piece.rot,
            }}
          />
        ))}
      </div>

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className={`relative z-150 w-[90%] rounded-2xl bg-background px-8 pb-2 pt-8 text-center shadow-lg outline-none motion-reduce:animate-none ${
          closing
            ? "animate-[celebration-exit_0.28s_ease-in_forwards]"
            : "animate-[celebration-pop_0.28s_ease-out]"
        }`}
      >
        <div className="pointer-events-none absolute left-1/2 top-0 w-36 -translate-x-1/2 translate-y-[-70%] drop-shadow-md">
          <ImageComponent src="/images/celebration/party-popper.webp" alt="" width={144} height={144} sizes="144px" objectFit="contain" />
        </div>
        <button
          type="button"
          onClick={close}
          aria-label={t("close")}
          className="absolute top-3.5 inset-e-3.5 text-muted transition-colors hover:text-heading focus-visible:rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <LuX aria-hidden className="size-5" />
        </button>
        <h2 id={titleId} className="text-[1.75rem] font-bold tracking-tight text-heading">
          {title}
        </h2>
        <div id={descriptionId} className="mt-3 space-y-1 text-[15px] leading-6 text-heading">
          {children}
        </div>
        {actionLabel ? (
          <button
            type="button"
            onClick={close}
            className="mt-4 text-[15px] font-semibold text-primary transition-colors hover:text-primary-hover focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
