import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("AboutUsPage");
  return { title: t("title") };
}

export default async function AboutUsPage() {
  const t = await getTranslations("AboutUsPage");

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
    </main>
  );
}
