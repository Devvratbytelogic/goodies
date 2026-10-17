"use client";

import { useEffect, useId, useRef, useState, type FocusEvent, type FormEvent, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { LuSearch } from "react-icons/lu";
import { useRouter } from "@/i18n/navigation";
import { useGetProductSearchQuery } from "@/store/endpoints/productsApi";
import { SearchSuggestions } from "./SearchSuggestions";

type SearchFieldProps = {
  /** Moves focus into the input whenever it flips to `true`. */
  focused?: boolean;
  onSubmitted?: () => void;
  className?: string;
};

function useDebounced(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}

export function SearchField({
  focused = false,
  onSubmitted,
  className = "",
}: SearchFieldProps) {
  const t = useTranslations("Header");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLFormElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const term = query.trim();
  const debounced = useDebounced(term, 300);
  const { currentData, isFetching, isError } = useGetProductSearchQuery(debounced, {
    skip: debounced.length < 2,
  });
  const products = currentData?.products ?? [];
  const categories = currentData?.categories ?? [];
  const showSuggestions = open && term.length >= 2;
  const optionCount = categories.length + products.length;

  useEffect(() => {
    if (focused) {
      inputRef.current?.focus();
    }
  }, [focused]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debounced]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function goToShop(value: string) {
    router.push(`/shop?search=${encodeURIComponent(value)}`);
    setOpen(false);
    onSubmitted?.();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!term) {
      inputRef.current?.focus();
      return;
    }

    goToShop(term);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    if (!showSuggestions || optionCount === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % optionCount);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? optionCount - 1 : index - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      document.getElementById(`${listId}-option-${activeIndex}`)?.click();
    }
  }

  function handleBlur(event: FocusEvent<HTMLFormElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpen(false);
    }
  }

  return (
    <form
      ref={rootRef}
      role="search"
      onSubmit={handleSubmit}
      onBlur={handleBlur}
      className={`group relative flex items-center ${className}`}
    >
      <LuSearch
        aria-hidden
        className="pointer-events-none absolute inset-s-4 size-5 text-accent-deep transition-colors group-focus-within:text-primary"
      />
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchSubmit")}
        aria-expanded={showSuggestions}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined}
        className="h-11 w-full rounded-full border border-border/70 bg-surface ps-12 pe-4 text-sm text-foreground shadow-xs outline-none transition placeholder:text-muted hover:border-border focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary-soft [&::-webkit-search-cancel-button]:appearance-none"
      />
      {showSuggestions ? (
        <SearchSuggestions
          listId={listId}
          activeIndex={activeIndex}
          query={debounced || term}
          products={debounced === term ? products : []}
          categories={debounced === term ? categories : []}
          isFetching={isFetching || debounced !== term}
          isError={isError && debounced === term}
          onPick={() => {
            setOpen(false);
            onSubmitted?.();
          }}
        />
      ) : null}
    </form>
  );
}
