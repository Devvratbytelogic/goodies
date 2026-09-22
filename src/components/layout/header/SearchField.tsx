"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { LuSearch } from "react-icons/lu";
import { useRouter } from "@/i18n/navigation";

type SearchFieldProps = {
  /** Moves focus into the input whenever it flips to `true`. */
  focused?: boolean;
  onSubmitted?: () => void;
  className?: string;
};

export function SearchField({
  focused = false,
  onSubmitted,
  className = "",
}: SearchFieldProps) {
  const t = useTranslations("Header");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (focused) {
      inputRef.current?.focus();
    }
  }, [focused]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = query.trim();

    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }

    router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
    onSubmitted?.();
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`group relative flex items-center ${className}`}
    >
      <LuSearch
        aria-hidden
        className="pointer-events-none absolute start-4 size-5 text-accent-deep transition-colors group-focus-within:text-primary"
      />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchSubmit")}
        className="h-11 w-full rounded-full border border-border/70 bg-surface ps-12 pe-4 text-sm text-foreground shadow-xs outline-none transition placeholder:text-muted hover:border-border focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary-soft [&::-webkit-search-cancel-button]:appearance-none"
      />
    </form>
  );
}
