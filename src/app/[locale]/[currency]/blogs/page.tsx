import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import BlogCard from "@/components/blog/BlogCard";
import BlogPagination from "@/components/blog/BlogPagination";
import BlogSidebar from "@/components/blog/BlogSidebar";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import { getArticles } from "@/server";
import { toCurrency } from "@/utils/currency";
import { getBlogsRoutePath, getHomeRoutePath } from "@/utils/routes";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("BlogsPage");
  return { title: t("title"), description: t("description") };
}

export default async function BlogsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; currency: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { locale, currency } = await params;
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const search = query.search?.trim() || "";
  const t = await getTranslations("BlogsPage");
  const nav = await getTranslations("Nav");
  const country = toCurrency(currency);
  const data = await getArticles(country, page, search);
  const articles = data?.articles ?? [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="container section_y_space">
      <Breadcrumbs items={[{ label: nav("home"), href: getHomeRoutePath() }, { label: t("title") }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-heading sm:text-4xl">{t("title")}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{t("description")}</p>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          {articles.length === 0 ? (
            <p className="text-sm text-muted">
              {search ? t("noResults", { query: search }) : t("empty")}
              {search ? (
                <>
                  {" "}
                  <Link href={getBlogsRoutePath()} className="font-semibold text-primary hover:text-primary-hover">
                    {t("clearSearch")}
                  </Link>
                </>
              ) : null}
            </p>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2">
              {articles.map((article) => (
                <li key={article._id}>
                  <BlogCard article={article} locale={locale} />
                </li>
              ))}
            </ul>
          )}
          <BlogPagination page={page} totalPages={totalPages} path={getBlogsRoutePath()} search={search} />
        </div>
        <BlogSidebar country={country} locale={locale} searchAction={getBlogsRoutePath()} search={search} />
      </div>
    </div>
  );
}
