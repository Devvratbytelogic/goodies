"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

type ShopPriceFilterProps = {
  title: string;
  minLabel: string;
  maxLabel: string;
  min: number;
  max: number;
};

function parseAmount(value: string) {
  const match = value.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
  if (!match) return null;
  const amount = Number(match[0]);
  return Number.isFinite(amount) ? amount : null;
}

function clamp(value: number, lower: number, upper: number) {
  return Math.min(Math.max(value, lower), upper);
}

export default function ShopPriceFilter({ title, minLabel, maxLabel, min, max }: ShopPriceFilterProps) {
  const t = useTranslations("ProductCard");
  const trackRef = useRef<HTMLDivElement>(null);
  const [low, setLow] = useState(min);
  const [high, setHigh] = useState(max);
  const [lowDraft, setLowDraft] = useState<string | null>(null);
  const [highDraft, setHighDraft] = useState<string | null>(null);
  const [active, setActive] = useState<"low" | "high">("high");
  const span = Math.max(max - min, 1);
  const lowPercent = ((low - min) / span) * 100;
  const highPercent = ((high - min) / span) * 100;

  function format(amount: number) {
    return t("price", {
      amount: amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    });
  }

  function valueFromClientX(clientX: number) {
    const track = trackRef.current;
    if (!track) return min;
    const rect = track.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    return min + Math.round(ratio * (max - min));
  }

  function moveHandle(handle: "low" | "high", clientX: number) {
    const next = valueFromClientX(clientX);
    if (handle === "low") {
      setLowDraft(null);
      setLow(Math.min(next, high));
      return;
    }
    setHighDraft(null);
    setHigh(Math.max(next, low));
  }

  function commitLow(value: string) {
    const next = parseAmount(value);
    if (next != null) setLow(clamp(Math.round(next), min, high));
    setLowDraft(null);
  }

  function commitHigh(value: string) {
    const next = parseAmount(value);
    if (next != null) setHigh(clamp(Math.round(next), low, max));
    setHighDraft(null);
  }

  return (
    <div>
      <h3 className="text-sm font-bold text-heading!">{title}</h3>
      <div dir="ltr" className="relative mt-4 h-4">
        <div className="pointer-events-none absolute inset-x-2 top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary-soft" />
        <div
          className="pointer-events-none absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary"
          style={{
            left: `calc(0.5rem + (100% - 1rem) * ${lowPercent / 100})`,
            width: `calc((100% - 1rem) * ${(highPercent - lowPercent) / 100})`,
          }}
        />
        <div
          ref={trackRef}
          className="absolute inset-x-2 top-0 h-full"
          onPointerDown={(event) => {
            if (event.target !== event.currentTarget) return;
            const next = valueFromClientX(event.clientX);
            const handle = Math.abs(next - low) <= Math.abs(next - high) ? "low" : "high";
            setActive(handle);
            moveHandle(handle, event.clientX);
          }}
        >
        <PriceHandle
          label={minLabel}
          value={low}
          min={min}
          max={high}
          active={active === "low"}
          position={`${lowPercent}%`}
          onFocus={() => setActive("low")}
          onPointerDown={() => setActive("low")}
          onMove={(clientX) => moveHandle("low", clientX)}
          onStep={(delta) => {
            setLowDraft(null);
            setLow(clamp(low + delta, min, high));
          }}
        />
        <PriceHandle
          label={maxLabel}
          value={high}
          min={low}
          max={max}
          active={active === "high"}
          position={`${highPercent}%`}
          onFocus={() => setActive("high")}
          onPointerDown={() => setActive("high")}
          onMove={(clientX) => moveHandle("high", clientX)}
          onStep={(delta) => {
            setHighDraft(null);
            setHigh(clamp(high + delta, low, max));
          }}
        />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          value={lowDraft ?? format(low)}
          aria-label={minLabel}
          inputMode="decimal"
          onChange={(event) => {
            const raw = event.target.value;
            setLowDraft(raw);
            const next = parseAmount(raw);
            if (next == null) return;
            const rounded = Math.round(next);
            if (rounded >= min && rounded <= high) setLow(rounded);
          }}
          onBlur={(event) => commitLow(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
          className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-background px-2 text-center text-sm font-semibold text-price focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />
        <input
          value={highDraft ?? format(high)}
          aria-label={maxLabel}
          inputMode="decimal"
          onChange={(event) => {
            const raw = event.target.value;
            setHighDraft(raw);
            const next = parseAmount(raw);
            if (next == null) return;
            const rounded = Math.round(next);
            if (rounded >= low && rounded <= max) setHigh(rounded);
          }}
          onBlur={(event) => commitHigh(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
          className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-background px-2 text-center text-sm font-semibold text-price focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />
      </div>
    </div>
  );
}

type PriceHandleProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  active: boolean;
  position: string;
  onFocus: () => void;
  onPointerDown: () => void;
  onMove: (clientX: number) => void;
  onStep: (delta: number) => void;
};

function PriceHandle({
  label,
  value,
  min,
  max,
  active,
  position,
  onFocus,
  onPointerDown,
  onMove,
  onStep,
}: PriceHandleProps) {
  return (
    <button
      type="button"
      role="slider"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      onFocus={onFocus}
      onPointerDown={(event) => {
        onPointerDown();
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
        onMove(event.clientX);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowUp") {
          event.preventDefault();
          onStep(event.shiftKey ? 10 : 1);
        }
        if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
          event.preventDefault();
          onStep(event.shiftKey ? -10 : -1);
        }
      }}
      className={`absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer touch-none rounded-full border-2 border-primary bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${active ? "z-20" : "z-10"}`}
      style={{ left: position }}
    />
  );
}
