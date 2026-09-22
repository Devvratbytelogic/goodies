import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("ShopPage");
  return { title: t("title") };
}

export default async function ShopPage() {
  const t = await getTranslations("ShopPage");

  return (
    <main className="container flex-1 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
    </main>
  );
}
