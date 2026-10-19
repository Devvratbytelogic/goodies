import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import BlogCard from "@/components/blog/BlogCard";
import BlogPagination from "@/components/blog/BlogPagination";
import BlogSidebar from "@/components/blog/BlogSidebar";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import { getBlogCategories, getBlogCategory } from "@/server";
import { defaultCurrency, toCurrency } from "@/utils/currency";
import { markdownToHtml } from "@/utils/markdown";
import { getBlogCategoryRoutePath, getBlogsRoutePath, getHomeRoutePath } from "@/utils/routes";

export const revalidate = 600;
export const dynamicParams = true;

function readSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function generateStaticParams() {
  try {
    const categories = (await getBlogCategories(defaultCurrency)) ?? [];
    return categories.filter((category) => category.slug).map((category) => ({ slug: category.slug }));
  } catch (error) {
    console.error("generateStaticParams: blog categories unavailable", error);
    return [];
  }
}

type BlogCategoryPageProps = {
  params: Promise<{ locale: string; currency: string; slug: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
};

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const { currency, slug } = await params;
  const category = await getBlogCategory(toCurrency(currency), readSlug(slug));
  if (!category?.name) return {};
  const title = category.meta_title?.trim() || category.name;
  const description = category.meta_description?.trim() || category.description?.trim() || undefined;
  return { title, description };
}

export default async function BlogCategoryPage({ params, searchParams }: BlogCategoryPageProps) {
  const { locale, currency, slug: rawSlug } = await params;
  const categorySlug = readSlug(rawSlug);
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const search = query.search?.trim() || "";
  const country = toCurrency(currency);
  const category = await getBlogCategory(country, categorySlug, page, search);
  if (!category?.slug || !category.name) notFound();

  const articles = category.blogs ?? [];
  const totalPages = category.totalPages || 1;
  const schema = category.schema?.trim();
  const jsonLd = schema && /^[\[{]/.test(schema) ? schema : "";
  const t = await getTranslations("BlogsPage");
  const nav = await getTranslations("Nav");

  return (
    <div className="container section_y_space">
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} /> : null}
      <Breadcrumbs
        items={[
          { label: nav("home"), href: getHomeRoutePath() },
          { label: t("title"), href: getBlogsRoutePath() },
          { label: category.name },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-heading sm:text-4xl">{category.name}</h1>
      {category.description?.trim() ? (
        <div className="category-description mt-3 max-w-2xl" dangerouslySetInnerHTML={{ __html: markdownToHtml(category.description) }} />
      ) : null}
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          {articles.length === 0 ? (
            <p className="text-sm text-muted">
              {search ? t("noResults", { query: search }) : t("empty")}
              {search ? (
                <>
                  {" "}
                  <Link href={getBlogCategoryRoutePath(category.slug)} className="font-semibold text-primary hover:text-primary-hover">
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
          <BlogPagination page={page} totalPages={totalPages} path={getBlogCategoryRoutePath(category.slug)} search={search} />
        </div>
        <BlogSidebar country={country} locale={locale} activeSlug={category.slug} searchAction={getBlogCategoryRoutePath(category.slug)} search={search} />
      </div>
    </div>
  );
}
