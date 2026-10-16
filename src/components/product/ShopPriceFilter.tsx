"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { formatAmount } from "@/utils/price";
import { priceParam } from "@/utils/shopQuery";
import { shopSearchPath } from "@/utils/shopSearch";

type ShopPriceFilterProps = {
  title: string;
  minLabel: string;
  maxLabel: string;
  min: number;
  max: number;
  currencySymbol?: string;
};

const gap = 25;

function clamp(value: number, lower: number, upper: number) {
  return Math.min(Math.max(value, lower), upper);
}

function PriceSlider({
  title,
  minLabel,
  maxLabel,
  min,
  max,
  valueMin,
  valueMax,
  currencySymbol,
}: ShopPriceFilterProps & { valueMin?: number; valueMax?: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const trackRef = useRef<HTMLDivElement>(null);
  const startLow = valueMin ?? min;
  const startHigh = valueMax ?? max;
  const [low, setLow] = useState(startLow);
  const [high, setHigh] = useState(startHigh);
  const lowRef = useRef(startLow);
  const highRef = useRef(startHigh);
  const [lowDraft, setLowDraft] = useState<string | null>(null);
  const [highDraft, setHighDraft] = useState<string | null>(null);
  const [active, setActive] = useState<"low" | "high">("high");
  const dragging = useRef(false);
  const commitRef = useRef<() => void>(() => {});
  const span = Math.max(max - min, 1);
  const lowPercent = ((low - min) / span) * 100;
  const highPercent = ((high - min) / span) * 100;
  const lowStop = Math.max(min, high - gap);
  const highStop = Math.min(max, low + gap);

  function valueFromClientX(clientX: number) {
    const track = trackRef.current;
    if (!track) return min;
    const rect = track.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    return min + Math.round(ratio * (max - min));
  }

  function apply(nextLow = lowRef.current, nextHigh = highRef.current) {
    if (nextLow === startLow && nextHigh === startHigh) return;

    const updates =
      nextLow === min && nextHigh === max
        ? { min_price: null, max_price: null }
        : { min_price: String(nextLow), max_price: String(nextHigh) };

    router.push(shopSearchPath(pathname, window.location.search, updates), { scroll: false });
  }

  function finishDrag() {
    if (!dragging.current) return;
    dragging.current = false;
    commitRef.current();
  }

  commitRef.current = () => apply();

  useEffect(() => {
    window.addEventListener("pointerup", finishDrag, true);
    window.addEventListener("pointercancel", finishDrag, true);
    return () => {
      window.removeEventListener("pointerup", finishDrag, true);
      window.removeEventListener("pointercancel", finishDrag, true);
    };
  }, []);

  function grab() {
    dragging.current = true;
  }

  function moveHandle(handle: "low" | "high", clientX: number) {
    const next = valueFromClientX(clientX);
    if (handle === "low") {
      const value = clamp(next, min, Math.max(min, highRef.current - gap));
      lowRef.current = value;
      setLowDraft(null);
      setLow(value);
      return;
    }
    const value = clamp(next, Math.min(max, lowRef.current + gap), max);
    highRef.current = value;
    setHighDraft(null);
    setHigh(value);
  }

  function commitLow(value: string) {
    const next = Number(value);
    const amount = value.trim() !== "" && Number.isFinite(next) ? clamp(Math.round(next), min, Math.max(min, highRef.current - gap)) : lowRef.current;
    lowRef.current = amount;
    setLow(amount);
    setLowDraft(null);
    apply(amount, highRef.current);
  }

  function commitHigh(value: string) {
    const next = Number(value);
    const amount = value.trim() !== "" && Number.isFinite(next) ? clamp(Math.round(next), Math.min(max, lowRef.current + gap), max) : highRef.current;
    highRef.current = amount;
    setHigh(amount);
    setHighDraft(null);
    apply(lowRef.current, amount);
  }

  return (
    <div className="min-w-0">
      <h3 className="text-sm font-bold text-heading!">{title}</h3>
      <div dir="ltr" className="relative mt-4 h-4 w-full max-w-full">
        <div className="pointer-events-none absolute inset-x-2 top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary-soft" />
        <div
          className="pointer-events-none absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary"
          style={{
            left: `calc(0.5rem + (100% - 1rem) * ${lowPercent / 100})`,
            right: `calc(0.5rem + (100% - 1rem) * ${(100 - highPercent) / 100})`,
          }}
        />
        <div
          ref={trackRef}
          className="absolute inset-x-2 top-0 h-full"
          onPointerDown={(event) => {
            if (event.target !== event.currentTarget) return;
            grab();
            event.currentTarget.setPointerCapture(event.pointerId);
            const next = valueFromClientX(event.clientX);
            const handle = Math.abs(next - lowRef.current) <= Math.abs(next - highRef.current) ? "low" : "high";
            setActive(handle);
            moveHandle(handle, event.clientX);
          }}
          onLostPointerCapture={finishDrag}
        >
        <PriceHandle
          label={minLabel}
          value={low}
          min={min}
          max={lowStop}
          active={active === "low"}
          position={`${lowPercent}%`}
          onFocus={() => setActive("low")}
          onPointerDown={() => {
            setActive("low");
            grab();
          }}
          onMove={(clientX) => moveHandle("low", clientX)}
          onCommit={finishDrag}
          onStep={(delta) => {
            const value = clamp(lowRef.current + delta, min, Math.max(min, highRef.current - gap));
            lowRef.current = value;
            setLowDraft(null);
            setLow(value);
            apply(value, highRef.current);
          }}
        />
        <PriceHandle
          label={maxLabel}
          value={high}
          min={highStop}
          max={max}
          active={active === "high"}
          position={`${highPercent}%`}
          onFocus={() => setActive("high")}
          onPointerDown={() => {
            setActive("high");
            grab();
          }}
          onMove={(clientX) => moveHandle("high", clientX)}
          onCommit={finishDrag}
          onStep={(delta) => {
            const value = clamp(highRef.current + delta, Math.min(max, lowRef.current + gap), max);
            highRef.current = value;
            setHighDraft(null);
            setHigh(value);
            apply(lowRef.current, value);
          }}
        />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <PriceAmount
          label={minLabel}
          symbol={currencySymbol}
          value={lowDraft ?? formatAmount(low)}
          onChange={(raw) => setLowDraft(raw)}
          onBlur={commitLow}
        />
        <PriceAmount
          label={maxLabel}
          symbol={currencySymbol}
          value={highDraft ?? formatAmount(high)}
          onChange={(raw) => setHighDraft(raw)}
          onBlur={commitHigh}
        />
      </div>
    </div>
  );
}

function PriceSliderFromUrl(props: ShopPriceFilterProps) {
  const params = useSearchParams();
  const minPrice = priceParam(params.get("min_price"));
  const maxPrice = priceParam(params.get("max_price"));
  const hasPrice = minPrice != null && maxPrice != null;

  return (
    <PriceSlider
      key={hasPrice ? `${minPrice}-${maxPrice}` : "full"}
      {...props}
      valueMin={hasPrice ? minPrice : undefined}
      valueMax={hasPrice ? maxPrice : undefined}
    />
  );
}

export default function ShopPriceFilter(props: ShopPriceFilterProps) {
  return (
    <Suspense fallback={<PriceSlider {...props} />}>
      <PriceSliderFromUrl {...props} />
    </Suspense>
  );
}

function PriceAmount({
  label,
  symbol,
  value,
  onChange,
  onBlur,
}: {
  label: string;
  symbol?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: (value: string) => void;
}) {
  return (
    <div dir="ltr" className="flex h-10 min-w-0 flex-1 items-center gap-1 rounded-lg border border-border bg-background px-2 hover:border-primary focus-within:border-primary">
      {symbol ? (
        <span aria-hidden className="shrink-0 text-sm font-semibold text-price">
          <bdi>{symbol}</bdi>
        </span>
      ) : null}
      <input
        value={value}
        aria-label={label}
        inputMode="decimal"
        dir="ltr"
        onChange={(event) => onChange(event.target.value)}
        onBlur={(event) => onBlur(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
        className="min-w-0 flex-1 bg-transparent text-center text-sm font-semibold text-price outline-none"
      />
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
  onCommit: () => void;
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
  onCommit,
  onStep,
}: PriceHandleProps) {
  return (
    <div
      role="slider"
      tabIndex={0}
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
      onLostPointerCapture={onCommit}
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
