import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProfileForm from "@/components/account/ProfileForm";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import { getAccountRoutePath, getHomeRoutePath } from "@/utils/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AccountPage");
  return {
    title: t("profile"),
    description: t("profileIntro"),
  };
}

export default async function AccountProfilePage() {
  const t = await getTranslations("AccountPage");
  const nav = await getTranslations("Nav");

  return (
    <>
      <Breadcrumbs
        className="mb-4"
        items={[
          { label: nav("home"), href: getHomeRoutePath() },
          { label: t("title"), href: getAccountRoutePath() },
          { label: t("profile") },
        ]}
      />
      <h1 className="text-2xl font-bold tracking-tight text-heading">{t("profile")}</h1>
      <div className="mt-6">
        <ProfileForm />
      </div>
    </>
  );
}
