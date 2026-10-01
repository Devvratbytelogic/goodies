"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { shopSearchPath } from "@/utils/shopSearch";

type ShopSortOption = {
  value: string;
  label: string;
};

type ShopSortSelectProps = {
  id: string;
  label: string;
  value?: string;
  options: ShopSortOption[];
};

const className = "h-10 w-full max-w-full rounded-lg border border-border bg-background px-3 text-sm text-heading outline-none sm:w-56";

export default function ShopSortSelect({ id, label, value, options }: ShopSortSelectProps) {
  const router = useRouter();
  const pathname = usePathname();

  function onChange(next: string) {
    router.push(shopSearchPath(pathname, window.location.search, { sort: next || null }), { scroll: false });
  }

  return (
    <>
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      {value == null ? (
        <select id={id} defaultValue="" className={className}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={className}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </>
  );
}
