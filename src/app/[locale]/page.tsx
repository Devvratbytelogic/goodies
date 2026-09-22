import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl space-y-6 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {t("description")}
        </p>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {t.rich("edit", {
            file: (chunks) => (
              <code className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
                {chunks}
              </code>
            ),
          })}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
            {t("badgeNext")}
          </span>
          <span className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
            {t("badgeTailwind")}
          </span>
          <span className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
            {t("badgeTypeScript")}
          </span>
          <span className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
            {t("badgeI18n")}
          </span>
        </div>
      </div>
    </main>
  );
}
