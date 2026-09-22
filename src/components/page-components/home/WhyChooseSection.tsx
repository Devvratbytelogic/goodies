import { useTranslations } from "next-intl";
import type { IconType } from "react-icons";
import { LuGift, LuHeart, LuStar, LuTruck } from "react-icons/lu";

type Reason = {
  titleKey: "deliveryTitle" | "qualityTitle" | "giftingTitle" | "familiesTitle";
  descriptionKey:
    | "deliveryDescription"
    | "qualityDescription"
    | "giftingDescription"
    | "familiesDescription";
  icon: IconType;
  cardClass: string;
  glowClass: string;
};

const reasons: Reason[] = [
  {
    titleKey: "deliveryTitle",
    descriptionKey: "deliveryDescription",
    icon: LuTruck,
    cardClass: "bg-[#e8f7f4]",
    glowClass: "bg-accent/25",
  },
  {
    titleKey: "qualityTitle",
    descriptionKey: "qualityDescription",
    icon: LuStar,
    cardClass: "bg-[#f8eef3]",
    glowClass: "bg-primary/15",
  },
  {
    titleKey: "giftingTitle",
    descriptionKey: "giftingDescription",
    icon: LuGift,
    cardClass: "bg-[#f7f1e6]",
    glowClass: "bg-[#e8d4b0]/60",
  },
  {
    titleKey: "familiesTitle",
    descriptionKey: "familiesDescription",
    icon: LuHeart,
    cardClass: "bg-[#eeedf8]",
    glowClass: "bg-[#b8b4e0]/40",
  },
];

export default function WhyChooseSection() {
  const t = useTranslations("WhyChooseSection");

  return (
    <section className="container section_y_space">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-b from-primary-soft/45 via-background to-surface px-3.5 py-8 sm:rounded-4xl sm:px-8 sm:py-12 lg:px-10 lg:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-s-1/2 -top-16 size-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent sm:text-xs">
            <span aria-hidden className="hidden h-px w-6 bg-accent/45 sm:block" />
            {t("eyebrow")}
            <span aria-hidden className="hidden h-px w-6 bg-accent/45 sm:block" />
          </p>
          <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-heading text-balance sm:text-3xl lg:text-4xl">
            {t("title")}
          </h2>
        </div>

        <ul className="relative mt-7 grid grid-cols-2 gap-2.5 sm:mt-9 sm:gap-4 lg:grid-cols-4">
          {reasons.map(({ titleKey, descriptionKey, icon: Icon, cardClass, glowClass }) => (
            <li
              key={titleKey}
              className={`relative flex min-h-44 flex-col items-center justify-center overflow-hidden rounded-2xl px-3 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] ring-1 ring-black/4 sm:min-h-52 sm:rounded-3xl sm:px-5 sm:py-8 ${cardClass}`}
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-s-1/2 -top-10 size-28 -translate-x-1/2 rounded-full blur-2xl ${glowClass}`}
              />
              <span className="relative flex size-11 items-center justify-center rounded-full bg-background shadow-[0_8px_20px_rgba(15,23,42,0.08)] ring-1 ring-black/5 sm:size-12">
                <Icon aria-hidden className="size-4 text-primary sm:size-5" />
              </span>
              <h3 className="relative mt-3.5 text-[13px] font-bold leading-snug text-heading sm:mt-5 sm:text-base">
                {t(titleKey)}
              </h3>
              <p className="relative mt-1.5 max-w-48 text-[11px] leading-relaxed text-muted sm:mt-2 sm:max-w-none sm:text-sm sm:leading-6">
                {t(descriptionKey)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
