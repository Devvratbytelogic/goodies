import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl space-y-6 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-heading sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-lg leading-8 text-muted-foreground">
          {t("description")}
        </p>
        <p className="text-lg leading-8 text-muted-foreground">
          {t.rich("edit", {
            file: (chunks) => (
              <code className="rounded-md bg-primary-soft px-1.5 py-0.5 font-mono text-sm text-primary">
                {chunks}
              </code>
            ),
          })}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            {t("badgeNext")}
          </span>
          <span className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
            {t("badgeTailwind")}
          </span>
          <span className="rounded-full border border-border px-4 py-2 text-sm font-medium text-secondary-heading">
            {t("badgeTypeScript")}
          </span>
          <span className="rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary">
            {t("badgeI18n")}
          </span>
        </div>
      </div>
    </main>
  );
}
