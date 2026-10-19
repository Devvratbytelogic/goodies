import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import BlogSearch from "@/components/blog/BlogSearch";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { getBlogCategories, getLatestArticles } from "@/server";
import { getBlogCategoryRoutePath, getBlogRoutePath } from "@/utils/routes";

export default async function BlogSidebar({
  country,
  locale,
  activeSlug,
  searchAction,
  search = "",
  excludeSlug,
}: {
  country: string;
  locale: string;
  activeSlug?: string;
  searchAction: string;
  search?: string;
  excludeSlug?: string;
}) {
  const t = await getTranslations("BlogsPage");
  const categories = ((await getBlogCategories(country)) ?? []).filter((category) => category.slug && category.name);
  const latest = ((await getLatestArticles(country, 6)) ?? []).filter((article) => article.slug && article.title && article.slug !== excludeSlug);

  return (
    <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
      <BlogSearch key={search} action={searchAction} search={search} label={t("search")} placeholder={t("searchPlaceholder")} />

      {categories.length > 0 ? (
        <section className="rounded-2xl border border-border/70 bg-background p-4">
          <h2 className="text-base font-bold text-heading">{t("categories")}</h2>
          <ul className="mt-3 space-y-1">
            {categories.map((category) => {
              const current = category.slug === activeSlug;
              return (
                <li key={category.slug}>
                  <Link
                    href={getBlogCategoryRoutePath(category.slug)}
                    aria-current={current ? "page" : undefined}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${current ? "bg-primary-soft text-primary" : "text-heading hover:bg-surface"}`}
                  >
                    <span aria-hidden className={`size-1.5 shrink-0 rounded-full ${current ? "bg-primary" : "bg-border"}`} />
                    {category.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {latest.length > 0 ? (
        <section className="rounded-2xl border border-border/70 bg-background p-4">
          <h2 className="text-base font-bold text-heading">{t("recent")}</h2>
          <ul className="mt-3 space-y-1">
            {latest.map((article) => {
              const created = article.createdAt ? new Date(article.createdAt) : null;
              const when = created && !Number.isNaN(created.getTime()) ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(created) : "";
              return (
                <li key={article._id}>
                  <Link href={getBlogRoutePath(article.slug)} className="flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-surface">
                      <ImageComponent src={article.image || "/images/image-fallback.svg"} alt="" width={56} height={56} objectFit="cover" sizes="56px" />
                    </span>
                    <span className="min-w-0">
                      <span className="line-clamp-2 text-sm font-semibold leading-snug text-heading">{article.title}</span>
                      {when ? <span className="mt-1 block text-xs text-muted">{when}</span> : null}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </aside>
  );
}
