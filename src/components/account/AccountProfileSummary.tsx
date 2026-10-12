"use client";

import { useTranslations } from "next-intl";
import ImageComponent from "@/components/layout/common/ImageComponent";
import { AccountDefaultAddressSkeleton, AccountGreetingSkeleton, AccountProfileCardSkeleton } from "@/components/skeletons/AccountSkeletons";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { useGetUserProfileQuery } from "@/store/endpoints/userApi";
import { getAccountAddressRoutePath, getAccountProfileRoutePath } from "@/utils/routes";

function useAccountUser() {
  const { token } = useAuth();
  return useGetUserProfileQuery(undefined, { skip: !token });
}

export function AccountGreeting() {
  const t = useTranslations("AccountPage");
  const { data: profile, isLoading, isUninitialized } = useAccountUser();

  if (!profile && (isLoading || isUninitialized)) return <AccountGreetingSkeleton />;

  return <h1 className="text-2xl font-bold tracking-tight text-heading">{t("greeting", { name: profile?.name ?? "" })}</h1>;
}

export function AccountProfileSummary() {
  const t = useTranslations("AccountPage");
  const { data: profile, isLoading, isUninitialized } = useAccountUser();
  const initials = `${profile?.name?.[0] ?? ""}${profile?.last_name?.[0] ?? ""}`;

  if (!profile && (isLoading || isUninitialized)) return <AccountProfileCardSkeleton />;

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
        <ProfileAvatar photo={profile?.profile_pic ?? null} initials={initials} />
        <div className="min-w-0">
          <p className="truncate font-medium text-heading">
            {profile?.name} {profile?.last_name}
          </p>
          <p className="truncate text-sm text-muted">{profile?.email}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-heading" dir="ltr">
        {profile?.phone_number}
      </p>
    </section>
  );
}

export function AccountDefaultAddress() {
  const t = useTranslations("AccountPage");
  const { data: profile, isLoading, isUninitialized } = useAccountUser();
  const address = profile?.address;

  if (!profile && (isLoading || isUninitialized)) return <AccountDefaultAddressSkeleton />;

  return (
    <section className="rounded-2xl border border-border bg-background px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-heading">{t("defaultAddress")}</h2>
        <Link
          href={getAccountAddressRoutePath()}
          className="text-sm font-medium text-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t("viewAll")}
        </Link>
      </div>
      {address ? (
        <>
          <p className="mt-3 text-sm font-medium text-heading">
            {address.first_name} {address.last_name}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {address.street_address}
            <br />
            {address.city}
          </p>
          <p className="mt-1 text-sm text-muted" dir="ltr">
            {address.phone_number ? `${address.phone_number}` : null}
          </p>
          {address.email ? <p className="text-sm text-muted">{address.email}</p> : null}
        </>
      ) : null}
    </section>
  );
}


export function ProfileAvatar({ photo, initials, size = "sm" }: { photo: string | null; initials: string; size?: "sm" | "lg" }) {
  const className = size === "lg" ? "size-24 text-2xl" : "size-11 text-sm";

  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold border border-gray-200 uppercase ${className} ${photo ? "" : "bg-primary text-primary-foreground"}`}
    >
      {photo ? (
        <ImageComponent src={photo} alt="" fill sizes={size === "lg" ? "96px" : "44px"} unoptimized objectFit="cover" className="object-center" />
      ) : (
        initials
      )}
    </span>
  );
}
