import { getTranslations } from "next-intl/server";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Link } from "@/i18n/navigation";

function pageHref(path: string, page: number, search?: string) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export default async function BlogPagination({ page, totalPages, path, search }: { page: number; totalPages: number; path: string; search?: string }) {
  if (totalPages <= 1) return null;
  const t = await getTranslations("BlogsPage");

  return (
    <nav aria-label={t("pagination")} className="mt-8 flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={pageHref(path, page - 1, search)} aria-label={t("previous")} className="inline-flex size-10 items-center justify-center rounded-full border border-border text-heading transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          <LuChevronLeft aria-hidden className="size-4 rtl:-scale-x-100" />
        </Link>
      ) : (
        <span aria-hidden className="inline-flex size-10 items-center justify-center rounded-full border border-border text-heading opacity-35">
          <LuChevronLeft className="size-4 rtl:-scale-x-100" />
        </span>
      )}
      <span className="px-2 text-sm font-semibold text-heading">
        {page} / {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={pageHref(path, page + 1, search)} aria-label={t("next")} className="inline-flex size-10 items-center justify-center rounded-full border border-border text-heading transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          <LuChevronRight aria-hidden className="size-4 rtl:-scale-x-100" />
        </Link>
      ) : (
        <span aria-hidden className="inline-flex size-10 items-center justify-center rounded-full border border-border text-heading opacity-35">
          <LuChevronRight className="size-4 rtl:-scale-x-100" />
        </span>
      )}
    </nav>
  );
}
