"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { LuChevronLeft, LuChevronRight, LuMaximize, LuMinimize, LuSearch, LuX, LuZoomIn, LuZoomOut } from "react-icons/lu";
import ImageComponent from "@/components/layout/common/ImageComponent";

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const SCALE_STEP = 0.5;

const viewerButtonClass =
  "inline-flex size-9 items-center justify-center rounded-full bg-background text-heading shadow-sm ring-1 ring-black/10 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-40 lg:size-10 lg:ring-white/20";

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const t = useTranslations("ProductPage");
  const titleId = useId();
  const openerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(1);
  const expandedRef = useRef(false);
  const dragRef = useRef<{ pointerId: number; x: number; y: number; panX: number; panY: number } | null>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [headerOffset, setHeaderOffset] = useState(0);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const current = images[active] ?? images[0];
  const hasMany = images.length > 1;
  scaleRef.current = scale;
  expandedRef.current = expanded;

  function showImage(index: number) {
    setActive(index);
    setScale(1);
    setPan({ x: 0, y: 0 });
    dragRef.current = null;
    setDragging(false);
  }

  function step(direction: number) {
    setActive((index) => {
      const next = (index + direction + images.length) % images.length;
      return next;
    });
    setScale(1);
    setPan({ x: 0, y: 0 });
    dragRef.current = null;
    setDragging(false);
  }

  function clampPan(x: number, y: number, nextScale: number) {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect || nextScale <= 1) {
      return { x: 0, y: 0 };
    }

    const maxX = (rect.width * (nextScale - 1)) / 2;
    const maxY = (rect.height * (nextScale - 1)) / 2;
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  }

  function setZoom(next: number) {
    const stepped = Math.round(next / SCALE_STEP) * SCALE_STEP;
    const scaleNext = Math.min(MAX_SCALE, Math.max(MIN_SCALE, stepped));
    setScale(scaleNext);
    setPan((currentPan) => clampPan(currentPan.x, currentPan.y, scaleNext));
  }

  function closeLightbox() {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    }
    setExpanded(false);
    setOpen(false);
  }

  function toggleFullScreen() {
    const node = rootRef.current;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    if (expandedRef.current) {
      setExpanded(false);
      return;
    }
    if (!node || typeof node.requestFullscreen !== "function") {
      setExpanded(true);
      return;
    }
    void node.requestFullscreen().catch(() => setExpanded(true));
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (scaleRef.current <= 1 || event.button !== 0) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    setDragging(true);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }
    setPan(clampPan(drag.panX + event.clientX - drag.x, drag.panY + event.clientY - drag.y, scaleRef.current));
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) {
      return;
    }
    dragRef.current = null;
    setDragging(false);
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
        if (document.fullscreenElement) {
          return;
        }
        if (expandedRef.current) {
          setExpanded(false);
          return;
        }
        if (scaleRef.current > 1) {
          setScale(1);
          setPan({ x: 0, y: 0 });
          return;
        }
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

    function onFullscreenChange() {
      setExpanded(document.fullscreenElement === rootRef.current);
    }

    function onWheel(event: WheelEvent) {
      if (Math.abs(event.deltaY) < 1 || !stageRef.current?.contains(event.target as Node)) {
        return;
      }
      event.preventDefault();
      const direction = event.deltaY > 0 ? -1 : 1;
      const stepped = Math.round((scaleRef.current + direction * SCALE_STEP) / SCALE_STEP) * SCALE_STEP;
      const scaleNext = Math.min(MAX_SCALE, Math.max(MIN_SCALE, stepped));
      setScale(scaleNext);
      setPan((currentPan) => {
        const rect = stageRef.current?.getBoundingClientRect();
        if (!rect || scaleNext <= 1) {
          return { x: 0, y: 0 };
        }
        const maxX = (rect.width * (scaleNext - 1)) / 2;
        const maxY = (rect.height * (scaleNext - 1)) / 2;
        return {
          x: Math.min(maxX, Math.max(-maxX, currentPan.x)),
          y: Math.min(maxY, Math.max(-maxY, currentPan.y)),
        };
      });
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", measureHeader);
    return () => {
      if (document.fullscreenElement) {
        void document.exitFullscreen();
      }
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", measureHeader);
      openerRef.current?.focus();
    };
  }, [open, images.length]);

  useEffect(() => {
    if (open) {
      return;
    }
    setScale(1);
    setPan({ x: 0, y: 0 });
    dragRef.current = null;
    setDragging(false);
    setExpanded(false);
  }, [open]);

  if (!current) {
    return null;
  }

  const topOffset = expanded ? 0 : headerOffset;
  const stageWidth = `min(100%, 48rem, calc(100dvh - ${topOffset}px - ${hasMany ? "9rem" : "1.5rem"}))`;
  const lightboxStyle = {
    "--gallery-offset": `${topOffset}px`,
    "--gallery-stage": stageWidth,
  } as CSSProperties;

  const lightbox = open ? (
    <div ref={rootRef} className="fixed inset-0 z-100 h-dvh" style={lightboxStyle} onClick={closeLightbox}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative flex h-full flex-col lg:items-center lg:overflow-hidden lg:px-4 lg:pb-4 lg:pt-(--gallery-offset)">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className="relative flex h-full w-full max-w-5xl flex-col lg:h-auto lg:items-center"
      >
        <h2 id={titleId} className="sr-only">
          {alt}
        </h2>
        <div className="z-10 flex shrink-0 items-center justify-end gap-2 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 lg:fixed lg:inset-e-4 lg:top-4 lg:p-0">
          <button
            type="button"
            onClick={() => setZoom(scale - SCALE_STEP)}
            disabled={scale <= MIN_SCALE}
            aria-label={t("zoomOut")}
            className={viewerButtonClass}
          >
            <LuZoomOut aria-hidden className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(scale + SCALE_STEP)}
            disabled={scale >= MAX_SCALE}
            aria-label={t("zoomIn")}
            className={viewerButtonClass}
          >
            <LuZoomIn aria-hidden className="size-5" />
          </button>
          <button
            type="button"
            onClick={toggleFullScreen}
            aria-pressed={expanded}
            aria-label={expanded ? t("exitFullScreen") : t("fullScreen")}
            className={viewerButtonClass}
          >
            {expanded ? <LuMinimize aria-hidden className="size-5" /> : <LuMaximize aria-hidden className="size-5" />}
          </button>
          <button
            type="button"
            data-gallery-close
            onClick={closeLightbox}
            aria-label={t("close")}
            className={viewerButtonClass}
          >
            <LuX aria-hidden className="size-5" />
          </button>
        </div>

        <div className="relative w-full max-lg:min-h-0 max-lg:flex-1 lg:aspect-square lg:w-(--gallery-stage) lg:max-w-full lg:flex-none">
          <div className="relative size-full overflow-hidden lg:rounded-2xl lg:bg-background lg:shadow-[0_24px_80px_-20px_rgb(0_0_0/0.65)]">
            <div
              ref={stageRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onDoubleClick={() => setZoom(scale > MIN_SCALE ? MIN_SCALE : 2)}
              className={`relative size-full ${scale > MIN_SCALE ? "touch-none" : ""} ${scale > MIN_SCALE ? (dragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"}`}
            >
              <div
                className={`relative size-full ${dragging ? "" : "transition-transform duration-200 ease-out motion-reduce:transition-none"}`}
                style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})` }}
              >
                <ImageComponent
                  src={current}
                  alt={alt}
                  fill
                  draggable={false}
                  objectFit="contain"
                  sizes="100vw"
                  className="pointer-events-none select-none"
                />
              </div>
            </div>
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
          <div className="flex max-w-full shrink-0 flex-col items-center gap-3 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:mt-4 lg:px-0 lg:pb-1">
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
                      onClick={() => showImage(index)}
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
