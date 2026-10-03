import { LuChevronDown } from "react-icons/lu";
import { markdownToHtml } from "@/utils/markdown";

export type FaqItem = {
  _id?: string;
  id?: string;
  question: string;
  answer?: string | null;
  status?: boolean;
};

type FaqListProps = {
  title?: string;
  items?: FaqItem[] | null;
};

export default function FaqList({ title, items }: FaqListProps) {
  const faqs = (items ?? []).filter((faq) => faq.question?.trim() && faq.status !== false);

  if (faqs.length === 0) return null;

  return (
    <section className="container mb-10">
      {title ? <h2 className="text-xl font-bold tracking-tight text-heading">{title}</h2> : null}
      <div className={`overflow-hidden rounded-2xl border border-border ${title ? "mt-4" : ""}`}>
        {faqs.map((faq, index) => (
          <details key={faq._id ?? faq.id ?? `${faq.question}-${index}`} className="group border-b border-border last:border-b-0">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 font-semibold text-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
              {faq.question}
              <LuChevronDown aria-hidden className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180" />
            </summary>
            {faq.answer?.trim() ? (
              <div
                className="category-description border-t border-border/70 px-4 py-3"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(faq.answer) }}
              />
            ) : null}
          </details>
        ))}
      </div>
    </section>
  );
}
