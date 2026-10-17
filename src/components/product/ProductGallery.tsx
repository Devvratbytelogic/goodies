"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { LuChevronLeft, LuChevronRight, LuSearch, LuX } from "react-icons/lu";
import ImageComponent from "@/components/layout/common/ImageComponent";

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const t = useTranslations("ProductPage");
  const titleId = useId();
  const openerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [headerOffset, setHeaderOffset] = useState(0);
  const current = images[active] ?? images[0];
  const hasMany = images.length > 1;

  function step(direction: number) {
    setActive((index) => (index + direction + images.length) % images.length);
  }

  function measureHeader() {
    const header = document.querySelector("header");
    setHeaderOffset(header ? Math.max(0, Math.round(header.getBoundingClientRect().bottom)) : 0);
  }

  function openLightbox() {
    measureHeader();
    setOpen(true);
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    measureHeader();
    dialogRef.current?.querySelector<HTMLElement>("[data-gallery-close]")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      const rtl = document.documentElement.dir === "rtl";
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(rtl ? -1 : 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(rtl ? 1 : -1);
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const items = [...dialogRef.current.querySelectorAll<HTMLButtonElement>("button")].filter(
        (item) => !item.disabled,
      );
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", measureHeader);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", measureHeader);
      openerRef.current?.focus();
    };
  }, [open, images.length]);

  if (!current) {
    return null;
  }

  const lightbox = open ? (
    <div className="fixed inset-0 z-100" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-black/80" />
      <div
        className="relative flex h-full flex-col items-center overflow-hidden px-4 pb-4"
        style={{ paddingTop: headerOffset }}
      >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className="relative flex w-full max-w-5xl flex-col items-center"
      >
        <h2 id={titleId} className="sr-only">
          {alt}
        </h2>
        <button
          type="button"
          data-gallery-close
          onClick={() => setOpen(false)}
          aria-label={t("close")}
          className="fixed inset-e-4 top-4 z-10 inline-flex size-10 items-center justify-center rounded-full bg-background text-heading shadow-sm ring-1 ring-white/20 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <LuX aria-hidden className="size-5" />
        </button>

        <div
          className="relative aspect-square max-w-full"
          style={{ width: `min(100%, 48rem, calc(100dvh - ${headerOffset}px - ${hasMany ? "9rem" : "1.5rem"}))` }}
        >
          <div className="relative size-full overflow-hidden rounded-2xl bg-background shadow-[0_24px_80px_-20px_rgb(0_0_0/0.65)]">
            <ImageComponent
              src={current}
              alt={alt}
              fill
              objectFit="contain"
              sizes="(max-width: 1024px) 92vw, 48rem"
            />
          </div>
          {hasMany ? (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={t("galleryPrevious")}
                className="absolute inset-s-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-background text-heading shadow-md ring-1 ring-black/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <LuChevronLeft aria-hidden className="size-5 rtl:-scale-x-100" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={t("galleryNext")}
                className="absolute inset-e-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-background text-heading shadow-md ring-1 ring-black/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <LuChevronRight aria-hidden className="size-5 rtl:-scale-x-100" />
              </button>
            </>
          ) : null}
        </div>

        {hasMany ? (
          <div className="mt-4 flex max-w-full flex-col items-center gap-3">
            <p className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
              {t("galleryCount", { current: active + 1, total: images.length })}
            </p>
            <ol className="flex max-w-full gap-2 overflow-x-auto px-1 pb-1">
              {images.map((src, index) => {
                const selected = index === active;
                return (
                  <li key={`${src}-${index}`} className="shrink-0">
                    <button
                      type="button"
                      aria-label={`${alt} ${index + 1}`}
                      aria-current={selected ? "true" : undefined}
                      onClick={() => setActive(index)}
                      className={`relative size-16 overflow-hidden rounded-xl bg-background ring-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${selected ? "ring-white" : "ring-white/25 opacity-80 hover:opacity-100"}`}
                    >
                      <ImageComponent src={src} alt="" width={128} height={128} objectFit="cover" sizes="64px" />
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        ) : null}
      </div>
      </div>
    </div>
  ) : null;

  return (
    <div>
      <div className="relative bg-surface">
        <button
          ref={openerRef}
          type="button"
          onClick={openLightbox}
          aria-label={t("viewGallery")}
          className="relative block aspect-4/3 w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ImageComponent
            src={current}
            alt={alt}
            width={1200}
            height={900}
            objectFit="contain"
            sizes="(max-width: 1024px) 92vw, 42vw"
            preload={active === 0}
            fetchPriority={active === 0 ? "high" : "auto"}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-e-3 top-3 inline-flex size-10 items-center justify-center rounded-full bg-background/90 text-heading shadow-sm ring-1 ring-border/80"
          >
            <LuSearch className="size-5" />
          </span>
        </button>
      </div>

      {hasMany ? (
        <ol className="mt-3 flex flex-wrap gap-3">
          {images.map((src, index) => {
            const selected = index === active;
            return (
              <li key={src}>
                <button
                  type="button"
                  aria-label={`${alt} ${index + 1}`}
                  aria-current={selected ? "true" : undefined}
                  onClick={() => setActive(index)}
                  className={`relative size-24 overflow-hidden bg-surface ring-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:size-28 ${selected ? "ring-2 ring-heading" : "ring-border"}`}
                >
                  <ImageComponent src={src} alt="" width={224} height={224} objectFit="cover" sizes="112px" />
                </button>
              </li>
            );
          })}
        </ol>
      ) : null}

      {typeof document !== "undefined" && lightbox ? createPortal(lightbox, document.body) : null}
    </div>
  );
}
