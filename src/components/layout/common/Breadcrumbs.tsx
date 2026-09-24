import { Fragment } from "react";
import { getTranslations } from "next-intl/server";
import { LuChevronRight } from "react-icons/lu";
import { Link } from "@/i18n/navigation";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  variant?: "default" | "hero";
  className?: string;
};

export default async function Breadcrumbs({ items, variant = "default", className = "" }: BreadcrumbsProps) {
  const t = await getTranslations("Breadcrumb");
  const onHero = variant === "hero";
  const listClass = onHero
    ? "flex flex-wrap items-center gap-1.5 text-sm text-white/80"
    : "flex flex-wrap items-center gap-1.5 text-sm text-muted";
  const linkClass = onHero
    ? "transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    : "transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
  const separatorClass = onHero ? "flex items-center text-white/60" : "flex items-center text-border";
  const currentClass = onHero ? "font-medium text-white" : "font-medium text-heading";

  return (
    <nav aria-label={t("label")} className={className}>
      <ol className={listClass}>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <Fragment key={`${item.href ?? "current"}-${index}`}>
              {index > 0 ? (
                <li aria-hidden className={separatorClass}>
                  <LuChevronRight className="size-3.5 rtl:-scale-x-100" />
                </li>
              ) : null}
              <li className={isCurrent ? currentClass : undefined} aria-current={isCurrent ? "page" : undefined}>
                {item.href && !isCurrent ? (
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                ) : (
                  item.label
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
