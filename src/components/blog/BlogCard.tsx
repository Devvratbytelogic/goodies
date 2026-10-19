import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ImageComponent from "@/components/layout/common/ImageComponent";
import type { Article } from "@/server/types/article";
import { getBlogRoutePath } from "@/utils/routes";

function excerpt(article: Article) {
  const source = article.description || article.meta_description || "";
  return source.replace(/[#>*_`[\]]/g, " ").replace(/\s+/g, " ").trim();
}

export default async function BlogCard({ article, locale }: { article: Article; locale: string }) {
  const t = await getTranslations("BlogsPage");
  const category = typeof article.category === "object" && article.category?.slug ? article.category : null;
  const created = article.createdAt ? new Date(article.createdAt) : null;
  const when = created && !Number.isNaN(created.getTime()) ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(created) : "";
  const summary = excerpt(article);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-background">
      <Link href={getBlogRoutePath(article.slug)} className="flex flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        <div className="relative aspect-16/10 overflow-hidden bg-surface">
          <ImageComponent src={article.image || "/images/image-fallback.svg"} alt={article.title} width={800} height={500} objectFit="cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        </div>
        <div className="flex flex-1 flex-col px-4 py-4">
          {category ? <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">{category.name}</p> : null}
          <h2 className="mt-1 line-clamp-2 text-lg font-bold leading-snug text-heading">{article.title}</h2>
          {summary ? <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{summary}</p> : null}
          <p className="mt-4 text-xs text-muted">{when || t("read")}</p>
        </div>
      </Link>
    </article>
  );
}
