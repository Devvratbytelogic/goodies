"use client";

import { type FormEvent } from "react";
import { LuSearch } from "react-icons/lu";
import { useRouter } from "@/i18n/navigation";

export default function BlogSearch({ action, search, label, placeholder }: { action: string; search: string; label: string; placeholder: string }) {
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get("search") ?? "").trim();
    const params = new URLSearchParams();
    if (value) params.set("search", value);
    const query = params.toString();
    router.push(query ? `${action}?${query}` : action, { scroll: false });
  }

  return (
    <form onSubmit={onSubmit} role="search" className="group relative">
      <label htmlFor="blog-search" className="sr-only">
        {label}
      </label>
      <input
        id="blog-search"
        type="search"
        name="search"
        defaultValue={search}
        placeholder={placeholder}
        className="h-11 w-full rounded-full border border-border/70 bg-surface ps-4 pe-12 text-sm text-foreground outline-none transition placeholder:text-muted hover:border-border focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary-soft [&::-webkit-search-cancel-button]:appearance-none"
      />
      <button type="submit" aria-label={label} className="absolute inset-e-1 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        <LuSearch aria-hidden className="size-4" />
      </button>
    </form>
  );
}
