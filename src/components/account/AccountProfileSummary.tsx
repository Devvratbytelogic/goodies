"use client";

import { useTranslations } from "next-intl";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { Link } from "@/i18n/navigation";
import { useAccountProfile } from "@/components/account/AccountProfileProvider";
import { getAccountProfileRoutePath } from "@/utils/routes";

export function AccountGreeting() {
  const t = useTranslations("AccountPage");
  const { profile } = useAccountProfile();

  return <h1 className="text-2xl font-bold tracking-tight text-heading">{t("greeting", { name: profile.firstName })}</h1>;
}

export function AccountProfileSummary() {
  const t = useTranslations("AccountPage");
  const { profile } = useAccountProfile();
  const initials = `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`;

  return (
    <section className="rounded-2xl border border-border bg-background px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-heading">{t("profile")}</h2>
        <Link
          href={getAccountProfileRoutePath()}
          className="text-sm font-medium text-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t("edit")}
        </Link>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <ProfileAvatar photo={profile.photo} initials={initials} />
        <div className="min-w-0">
          <p className="truncate font-medium text-heading">
            {profile.firstName} {profile.lastName}
          </p>
          <p className="truncate text-sm text-muted">{profile.email}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-heading" dir="ltr">
        {profile.phone}
      </p>
    </section>
  );
}

export function ProfileAvatar({ photo, initials, size = "sm" }: { photo: string | null; initials: string; size?: "sm" | "lg" }) {
  const className = size === "lg" ? "size-24 text-2xl" : "size-11 text-sm";

  return (
    <span className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary font-semibold text-primary-foreground ${className}`}>
      {photo ? (
        <ImageComponent src={photo} alt="" width={size === "lg" ? 96 : 44} height={size === "lg" ? 96 : 44} sizes={size === "lg" ? "96px" : "44px"} unoptimized objectFit="cover" />
      ) : (
        initials
      )}
    </span>
  );
}
