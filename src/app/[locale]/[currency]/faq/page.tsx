import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import FaqList from "@/components/layout/common/FaqList";
import { getFaqList } from "@/server";
import { toCurrency } from "@/utils/currency";
import { getFaqRoutePath, getHomeRoutePath } from "@/utils/routes";
import { pageAlternates } from "@/utils/seo";

export const revalidate = 600;

type FaqPageProps = {
  params: Promise<{ locale: string; currency: string }>;
};

export async function generateMetadata({ params }: FaqPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("FaqPage");
  return {
    title: t("title"),
    description: t("description"),
    alternates: pageAlternates(locale, getFaqRoutePath()),
  };
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { currency } = await params;
  const t = await getTranslations("FaqPage");
  const nav = await getTranslations("Nav");
  const faqs = await getFaqList(toCurrency(currency));
  const items = faqs.flatMap((faq) => {
    const question = faq.question?.trim() || faq.name?.trim() || "";
    if (!question || faq.status === false) return [];
    return [{ _id: faq._id, id: faq.id, question, answer: faq.answer || faq.message, status: faq.status }];
  });
  const jsonLd =
    items.length > 0
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer?.trim() || "" },
          })),
        }).replace(/</g, "\\u003c")
      : "";

  return (
    <div className="container section_y_space">
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} /> : null}
      <Breadcrumbs items={[{ label: nav("home"), href: getHomeRoutePath() }, { label: t("title") }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-heading sm:text-4xl">{t("title")}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{t("description")}</p>
      {items.length === 0 ? (
        <p className="mt-8 text-sm text-muted">{t("empty")}</p>
      ) : (
        <FaqList items={items} className="mt-8" />
      )}
    </div>
  );
}
