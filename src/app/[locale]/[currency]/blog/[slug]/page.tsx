import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BlogCard from "@/components/blog/BlogCard";
import BlogSidebar from "@/components/blog/BlogSidebar";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { getArticle, getArticles, getLatestArticles } from "@/server";
import { defaultCurrency, toCurrency } from "@/utils/currency";
import { markdownToHtml } from "@/utils/markdown";
import { getBlogCategoryRoutePath, getBlogsRoutePath, getHomeRoutePath } from "@/utils/routes";
import { Link } from "@/i18n/navigation";

export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const data = await getArticles(defaultCurrency, 1);
    return (data?.articles ?? []).filter((article) => article.slug).map((article) => ({ slug: article.slug }));
  } catch (error) {
    console.error("generateStaticParams: article list unavailable", error);
    return [];
  }
}

function readSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function metaText(value?: string | null) {
  const text = value?.trim();
  return text || undefined;
}

type BlogPageProps = {
  params: Promise<{ locale: string; currency: string; slug: string }>;
};

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { currency, slug } = await params;
  const article = await getArticle(toCurrency(currency), readSlug(slug));
  const title = metaText(article?.meta_title) ?? article?.title;
  const description = metaText(article?.meta_description) ?? metaText(article?.description);
  const image = metaText(article?.og_image) ?? metaText(article?.image) ?? "";
  const ogTitle = metaText(article?.og_title) ?? title;
  const ogDescription = metaText(article?.og_description) ?? description;

  return {
    title,
    description,
    alternates: article?.canonical_url ? { canonical: article.canonical_url } : undefined,
    openGraph: { title: ogTitle, description: ogDescription, images: image ? [image] : undefined },
    twitter: { card: image ? "summary_large_image" : "summary", title: ogTitle, description: ogDescription, images: image ? [image] : undefined },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale, currency, slug } = await params;
  const country = toCurrency(currency);
  const article = await getArticle(country, readSlug(slug));
  const t = await getTranslations("BlogsPage");
  const nav = await getTranslations("Nav");
  const category = typeof article.category === "object" && article.category?.slug ? article.category : null;
  const created = article.createdAt ? new Date(article.createdAt) : null;
  const when = created && !Number.isNaN(created.getTime()) ? new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(created) : "";
  const image = article.image?.trim() || "";
  const schema = article.schema?.trim();
  const jsonLd = schema && /^[\[{]/.test(schema) ? schema : "";
  const tags = (article.tags ?? []).filter(Boolean);
  const author = article.createdBy?.name?.trim() || "";
  const avatar = article.createdBy?.profile_pic?.trim() || "";
  const initials = author
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const more = ((await getLatestArticles(country, 6)) ?? []).filter((item) => item.slug && item.title && item.slug !== article.slug).slice(0, 3);

  return (
    <div className="container section_y_space">
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} /> : null}
      <Breadcrumbs
        items={[
          { label: nav("home"), href: getHomeRoutePath() },
          { label: t("title"), href: getBlogsRoutePath() },
          ...(category ? [{ label: category.name, href: getBlogCategoryRoutePath(category.slug) }] : []),
          { label: article.title },
        ]}
      />

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article>
          {category ? (
            <Link href={getBlogCategoryRoutePath(category.slug)} className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              {category.name}
            </Link>
          ) : null}
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-heading text-balance sm:text-4xl lg:text-5xl">{article.title}</h1>
          {author || when ? (
            <div className="mt-5 flex items-center gap-3">
              <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-soft text-sm font-bold text-primary">
                {avatar ? <ImageComponent src={avatar} alt="" width={44} height={44} objectFit="cover" sizes="44px" /> : initials}
              </span>
              <span className="min-w-0">
                {author ? <span className="block truncate text-sm font-semibold text-heading">{author}</span> : null}
                {when ? <time dateTime={article.createdAt} className="block text-xs text-muted">{when}</time> : null}
              </span>
            </div>
          ) : null}
          {image ? (
            <div className="relative mt-6 aspect-16/10 overflow-hidden rounded-3xl border border-border/70 bg-surface">
              <ImageComponent src={image} alt={article.title} width={1600} height={1000} objectFit="cover" sizes="(max-width: 1024px) 100vw, 720px" quality={65} preload />
            </div>
          ) : null}
          {article.description?.trim() ? (
            <div className="category-description mt-8" dangerouslySetInnerHTML={{ __html: markdownToHtml(article.description) }} />
          ) : null}
          {tags.length > 0 ? (
            <div className="mt-6">
              <h2 className="text-sm font-bold text-heading">{t("tags")}</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <li key={tag}>
                    <span className="inline-flex rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-heading">{tag}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </article>
        <BlogSidebar country={country} locale={locale} activeSlug={category?.slug} searchAction={getBlogsRoutePath()} excludeSlug={article.slug} />
      </div>

      {more.length > 0 ? (
        <section className="mt-12 border-t border-border pt-10">
          <h2 className="text-2xl font-bold tracking-tight text-heading">{t("more")}</h2>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((item) => (
              <li key={item._id}>
                <BlogCard article={item} locale={locale} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
