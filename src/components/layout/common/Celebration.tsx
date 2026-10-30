"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { CreateTypes, Options } from "canvas-confetti";
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

/** https://www.kirilv.com/canvas-confetti/ — Realistic Look. Several cones, so the burst is uneven. */
function fireRealistic(shoot: CreateTypes) {
  const count = 200;
  const defaults: Options = { origin: { y: 0.7 } };

  function fire(particleRatio: number, opts: Options) {
    void shoot({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

export default function Celebration({ open = true, onClose, title, children, actionLabel, contained = false }: CelebrationProps) {
  const t = useTranslations("Celebration");
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let reset: (() => void) | undefined;

    void import("canvas-confetti").then(({ default: confetti }) => {
      if (cancelled) return;
      const shoot = confetti.create(canvas, { resize: true, useWorker: true });
      reset = () => shoot.reset();
      fireRealistic(shoot);
    });

    return () => {
      cancelled = true;
      reset?.();
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={`${overlayPosition} inset-0 z-130 flex items-center justify-center p-4`}>
      <div
        className={`absolute inset-0 bg-black/60 motion-reduce:animate-none ${closing ? "animate-[celebration-backdrop-out_0.28s_ease-in_forwards]" : ""}`}
        onClick={close}
      />
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
      <canvas
        ref={canvasRef}
        className={`pointer-events-none absolute inset-0 z-160 h-full w-full motion-reduce:hidden ${closing ? "animate-[celebration-backdrop-out_0.28s_ease-in_forwards]" : ""}`}
        aria-hidden
      />
    </div>
  );
}
