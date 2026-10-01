import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Link } from "@/i18n/navigation";

type PaginationProps = {
  page: number;
  totalPages: number;
  label: string;
  previousLabel: string;
  nextLabel: string;
  href: (page: number) => string;
};

function pageItems(current: number, total: number) {
  const items: Array<number | "..."> = [];

  for (let number = 1; number <= total; number += 1) {
    const isEdge = number === 1 || number === total;
    const isNear = Math.abs(number - current) <= 1;

    if (isEdge || isNear) items.push(number);
    else if (items[items.length - 1] !== "...") items.push("...");
  }

  return items;
}

const arrowClass =
  "inline-flex size-10 items-center justify-center rounded-full border border-border text-heading transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function Pagination({ page, totalPages, label, previousLabel, nextLabel, href }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="container mb-10 flex items-center justify-center gap-1.5" aria-label={label}>
      <Link
        href={href(page - 1)}
        aria-disabled={page <= 1}
        tabIndex={page <= 1 ? -1 : undefined}
        aria-label={previousLabel}
        className={`${arrowClass} ${page <= 1 ? "pointer-events-none opacity-35" : ""}`}
      >
        <LuChevronLeft aria-hidden className="size-4 rtl:-scale-x-100" />
      </Link>
      {pageItems(page, totalPages).map((item, index) =>
        item === "..." ? (
          <span key={`gap-${index}`} className="px-1 text-sm text-muted">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={href(item)}
            aria-current={item === page ? "page" : undefined}
            className={`inline-flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${item === page ? "bg-primary text-primary-foreground" : "text-heading hover:bg-primary-soft hover:text-primary"}`}
          >
            {item}
          </Link>
        ),
      )}
      <Link
        href={href(page + 1)}
        aria-disabled={page >= totalPages}
        tabIndex={page >= totalPages ? -1 : undefined}
        aria-label={nextLabel}
        className={`${arrowClass} ${page >= totalPages ? "pointer-events-none opacity-35" : ""}`}
      >
        <LuChevronRight aria-hidden className="size-4 rtl:-scale-x-100" />
      </Link>
    </nav>
  );
}
