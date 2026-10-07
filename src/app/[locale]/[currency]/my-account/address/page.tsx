import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumbs from "@/components/layout/common/Breadcrumbs";
import { sampleAddresses } from "@/data/sampleAddresses";
import { getAccountRoutePath, getHomeRoutePath } from "@/utils/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AccountPage");
  return {
    title: t("addresses"),
    description: t("addressesIntro"),
  };
}

export default async function AccountAddressPage() {
  const t = await getTranslations("AccountPage");
  const nav = await getTranslations("Nav");

  return (
    <>
      <Breadcrumbs
        className="mb-4"
        items={[
          { label: nav("home"), href: getHomeRoutePath() },
          { label: t("title"), href: getAccountRoutePath() },
          { label: t("addresses") },
        ]}
      />
      <h1 className="text-2xl font-bold tracking-tight text-heading">{t("addresses")}</h1>
      <p className="mt-1 text-sm text-muted">{t("addressesIntro")}</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {sampleAddresses.map((address, index) => (
          <li key={address.id} className="rounded-2xl border border-border bg-background px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold text-heading">
                {address.firstName} {address.lastName}
              </p>
              {index === 0 ? (
                <span className="inline-flex h-7 items-center rounded-full bg-primary-soft px-3 text-xs font-semibold text-primary">{t("defaultAddress")}</span>
              ) : null}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {address.address}
              <br />
              {address.city}
            </p>
            <p className="mt-3 text-sm text-heading" dir="ltr">
              {address.phone}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
