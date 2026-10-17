"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";

function Bone({ className }: { className: string }) {
  return <div aria-hidden className={`animate-pulse rounded bg-surface-muted ${className}`} />;
}

function Status({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

function useLoadingLabel() {
  return useTranslations("AccountPage")("loading");
}

function PageHeading({ lines = 2 }: { lines?: 1 | 2 }) {
  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <Bone className="h-3 w-12" />
        <Bone className="size-3 rounded-full" />
        <Bone className="h-3 w-16" />
      </div>
      <Bone className="h-8 w-44" />
      {lines === 2 ? <Bone className="mt-2 h-4 w-72 max-w-full" /> : null}
    </>
  );
}

export function AccountStatValueSkeleton() {
  return <span aria-hidden className="mt-1 block h-8 w-8 animate-pulse rounded bg-surface-muted" />;
}

export function AccountGreetingSkeleton() {
  const label = useLoadingLabel();

  return (
    <h1 className="text-2xl font-bold tracking-tight text-heading">
      <span className="sr-only">{label}</span>
      <span aria-hidden className="inline-block h-8 w-56 max-w-full animate-pulse rounded-lg bg-surface-muted" />
    </h1>
  );
}

export function AccountNavIdentitySkeleton() {
  const label = useLoadingLabel();

  return (
    <Status label={label} className="flex items-center gap-3 px-2 py-2">
      <Bone className="size-11 rounded-full" />
      <div className="min-w-0 flex-1">
        <Bone className="h-3.5 w-24" />
        <Bone className="mt-2 h-3 w-32" />
      </div>
    </Status>
  );
}

function NavSkeleton() {
  const label = useLoadingLabel();

  return (
    <div className="mb-6 lg:sticky lg:top-24 lg:mb-0">
      <Status label={label} className="rounded-2xl border border-border bg-background p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <Bone className="size-11 rounded-full" />
          <div className="min-w-0 flex-1">
            <Bone className="h-3.5 w-24" />
            <Bone className="mt-2 h-3 w-32" />
          </div>
          <Bone className="ms-auto size-8 shrink-0 rounded-full lg:hidden" />
        </div>
        <ul className="mt-2 hidden gap-1 border-t border-border pt-2 lg:grid">
          {Array.from({ length: 5 }, (_, index) => (
            <li key={index} className="flex h-11 items-center gap-3 px-2.5">
              <Bone className="size-8 rounded-lg" />
              <Bone className="h-3.5 w-20" />
            </li>
          ))}
        </ul>
        <div className="mt-2 hidden border-t border-border pt-2 lg:block">
          <div className="flex h-11 items-center gap-3 px-2.5">
            <Bone className="size-8 rounded-lg" />
            <Bone className="h-3.5 w-16" />
          </div>
        </div>
      </Status>
    </div>
  );
}

export function AccountRecentOrdersSkeleton({ count = 2, quiet = false }: { count?: number; quiet?: boolean }) {
  const label = useLoadingLabel();
  const cards = (
    <ul className="grid gap-4">
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="overflow-hidden rounded-2xl border border-border bg-background">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
            <div>
              <Bone className="h-4 w-32" />
              <Bone className="mt-2 h-3 w-24" />
            </div>
            <Bone className="h-7 w-20 rounded-full" />
          </div>
          <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
            <Bone className="size-14 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <Bone className="h-4 w-4/5" />
              <Bone className="mt-2 h-3 w-16" />
            </div>
            <Bone className="h-4 w-14" />
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-border bg-surface/60 px-4 py-3.5 sm:px-5">
            <div>
              <Bone className="h-3 w-16" />
              <Bone className="mt-2 h-5 w-20" />
            </div>
            <Bone className="h-10 w-28 rounded-full" />
          </div>
        </li>
      ))}
    </ul>
  );

  if (quiet) return cards;
  return <Status label={label}>{cards}</Status>;
}

export function AccountProfileCardSkeleton({ quiet = false }: { quiet?: boolean }) {
  const label = useLoadingLabel();
  const className = "rounded-2xl border border-border bg-background px-5 py-4";

  if (quiet) {
    return (
      <div className={className}>
        <ProfileCardBones />
      </div>
    );
  }

  return (
    <Status label={label} className={className}>
      <ProfileCardBones />
    </Status>
  );
}

function ProfileCardBones() {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <Bone className="h-5 w-20" />
        <Bone className="h-4 w-10" />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Bone className="size-11 rounded-full" />
        <div className="min-w-0 flex-1">
          <Bone className="h-4 w-32" />
          <Bone className="mt-2 h-3 w-40" />
        </div>
      </div>
      <Bone className="mt-3 h-4 w-28" />
    </>
  );
}

export function AccountDefaultAddressSkeleton({ quiet = false }: { quiet?: boolean }) {
  const label = useLoadingLabel();
  const className = "rounded-2xl border border-border bg-background px-5 py-4";
  const bones = (
    <>
      <div className="flex items-center justify-between gap-3">
        <Bone className="h-5 w-32" />
        <Bone className="h-4 w-14" />
      </div>
      <Bone className="mt-4 h-4 w-28" />
      <Bone className="mt-2 h-3 w-40" />
      <Bone className="mt-2 h-3 w-24" />
      <Bone className="mt-3 h-4 w-32" />
    </>
  );

  if (quiet) return <div className={className}>{bones}</div>;
  return (
    <Status label={label} className={className}>
      {bones}
    </Status>
  );
}

function StatGrid() {
  return (
    <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <li key={index} className="rounded-2xl border border-border bg-background px-4 py-3">
          <Bone className="h-8 w-10" />
          <Bone className="mt-2 h-3.5 w-16" />
        </li>
      ))}
    </ul>
  );
}

export function AccountDashboardSkeleton() {
  const label = useLoadingLabel();

  return (
    <Status label={label}>
      <PageHeading />
      <StatGrid />
      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)]">
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <Bone className="h-5 w-32" />
            <Bone className="h-4 w-14" />
          </div>
          <AccountRecentOrdersSkeleton quiet />
        </div>
        <div className="grid gap-4">
          <AccountProfileCardSkeleton quiet />
          <AccountDefaultAddressSkeleton quiet />
        </div>
      </div>
    </Status>
  );
}

function AddressCards({ count = 2 }: { count?: number }) {
  return (
    <ul className="mt-4 grid gap-4 sm:grid-cols-2">
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="rounded-2xl border border-border bg-background px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <Bone className="h-4 w-32" />
            <div className="flex gap-1">
              <Bone className="size-9 rounded-full" />
              <Bone className="size-9 rounded-full" />
            </div>
          </div>
          <Bone className="mt-3 h-3 w-40" />
          <Bone className="mt-2 h-3 w-24" />
          <Bone className="mt-4 h-4 w-32" />
        </li>
      ))}
    </ul>
  );
}

export function AccountAddressCardsSkeleton() {
  const label = useLoadingLabel();

  return (
    <Status label={label}>
      <AddressCards />
    </Status>
  );
}

export function AccountAddressListSkeleton({ quiet = false }: { quiet?: boolean }) {
  const label = useLoadingLabel();
  const cards = (
    <>
      <div className="mt-6 flex justify-end">
        <Bone className="h-10 w-36 rounded-full" />
      </div>
      <AddressCards />
    </>
  );

  if (quiet) return <div>{cards}</div>;
  return <Status label={label}>{cards}</Status>;
}

export function AccountAddressesSkeleton() {
  const label = useLoadingLabel();

  return (
    <Status label={label}>
      <PageHeading />
      <AccountAddressListSkeleton quiet />
    </Status>
  );
}

function OrderListCards({ count }: { count: number }) {
  return (
    <ul className="grid gap-4">
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="overflow-hidden rounded-2xl border border-border bg-background">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
            <div>
              <Bone className="h-4 w-28" />
              <Bone className="mt-2 h-3 w-24" />
            </div>
            <Bone className="h-7 w-20 rounded-full" />
          </div>
          {Array.from({ length: 2 }, (_, line) => (
            <div key={line} className="flex items-center gap-3 border-t border-border px-4 py-3 sm:px-5">
              <Bone className="size-14 rounded-xl" />
              <div className="min-w-0 flex-1">
                <Bone className="h-4 w-2/3" />
                <Bone className="mt-2 h-3 w-16" />
              </div>
              <Bone className="h-4 w-14" />
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 border-t border-border bg-surface/60 px-4 py-3.5 sm:px-5">
            <div>
              <Bone className="h-3 w-16" />
              <Bone className="mt-2 h-5 w-20" />
            </div>
            <Bone className="h-10 w-28 rounded-full" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function AccountOrdersSkeleton() {
  const label = useLoadingLabel();

  return (
    <Status label={label}>
      <PageHeading />
      <div className="mt-6">
        <OrderListCards count={3} />
      </div>
    </Status>
  );
}

export function AccountOrderDetailSkeleton({ embedded = false }: { embedded?: boolean }) {
  const label = useLoadingLabel();

  return (
    <Status label={label}>
      {embedded ? <Bone className="h-8 w-44" /> : <PageHeading lines={1} />}
      <Bone className="mt-2 h-4 w-40" />
      <div className="mt-4 rounded-2xl border border-border bg-background px-5 py-4">
        <Bone className="h-5 w-28" />
        <Bone className="mt-2 h-3 w-56" />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="overflow-hidden rounded-2xl border border-border bg-background">
            <div className="border-b border-border px-4 py-3 sm:px-5">
              <Bone className="h-4 w-24" />
            </div>
            {Array.from({ length: 2 }, (_, index) => (
              <div key={index} className="flex items-center gap-3 border-t border-border px-4 py-3 sm:px-5">
                <Bone className="size-14 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <Bone className="h-4 w-2/3" />
                  <Bone className="mt-2 h-3 w-16" />
                </div>
                <Bone className="h-4 w-14" />
              </div>
            ))}
          </div>
          <div className="grid content-start gap-4">
            <div className="rounded-2xl border border-border bg-background px-5 py-4">
              <Bone className="h-4 w-20" />
              <Bone className="mt-3 h-4 w-28" />
              <Bone className="mt-2 h-3 w-36" />
              <Bone className="mt-2 h-3 w-20" />
            </div>
            <div className="rounded-2xl border border-border bg-background px-5 py-4">
              <Bone className="h-4 w-24" />
              <Bone className="mt-4 h-3 w-full" />
              <Bone className="mt-3 h-3 w-full" />
              <Bone className="mt-3 h-10 w-full rounded-xl" />
            </div>
          </div>
      </div>
    </Status>
  );
}

function Field() {
  return (
    <div>
      <Bone className="h-3.5 w-20" />
      <Bone className="mt-1.5 h-12 w-full rounded-xl" />
    </div>
  );
}

export function AccountProfileFormSkeleton({ quiet = false }: { quiet?: boolean }) {
  const label = useLoadingLabel();
  const className = "rounded-2xl border border-border bg-background px-5 py-5";
  const bones = (
    <>
      <Bone className="h-5 w-20" />
      <Bone className="mt-2 h-4 w-48" />
      <Bone className="mt-5 size-24 rounded-full" />
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field />
        <Field />
        <Field />
        <Field />
      </div>
      <Bone className="mt-5 h-10 w-32 rounded-full" />
    </>
  );

  if (quiet) return <div className={className}>{bones}</div>;
  return (
    <Status label={label} className={className}>
      {bones}
    </Status>
  );
}

export function AccountProfileSkeleton() {
  const label = useLoadingLabel();

  return (
    <Status label={label}>
      <PageHeading lines={1} />
      <div className="mt-6 grid gap-6">
        <AccountProfileFormSkeleton quiet />
        <div className="rounded-2xl border border-border bg-background px-5 py-5">
          <Bone className="h-5 w-40" />
          <div className="mt-5 grid gap-4">
            <Field />
            <Field />
            <Field />
          </div>
          <Bone className="mt-5 h-10 w-40 rounded-full" />
        </div>
        <div className="rounded-2xl border border-border bg-background px-5 py-5">
          <Bone className="h-5 w-36" />
          <Bone className="mt-2 h-4 w-64 max-w-full" />
          <Bone className="mt-5 h-10 w-36 rounded-full" />
        </div>
      </div>
    </Status>
  );
}

export function AccountCouponsSkeleton() {
  const label = useLoadingLabel();

  return (
    <Status label={label}>
      <PageHeading />
      <div className="mt-6">
        <Bone className="h-4 w-28" />
        <ul className="mt-3 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }, (_, index) => (
            <li key={index} className="rounded-2xl border border-dashed border-border bg-background px-5 py-4">
              <Bone className="h-4 w-24" />
              <Bone className="mt-3 h-4 w-40" />
            </li>
          ))}
        </ul>
      </div>
    </Status>
  );
}

export function AccountReviewsSkeleton() {
  const label = useLoadingLabel();

  return (
    <Status label={label}>
      <PageHeading />
      <ul className="mt-6 grid gap-3">
        {Array.from({ length: 2 }, (_, index) => (
          <li key={index} className="rounded-2xl border border-border bg-background px-5 py-4">
            <Bone className="h-4 w-40" />
            <Bone className="mt-3 h-4 w-24" />
            <Bone className="mt-3 h-4 w-full" />
          </li>
        ))}
      </ul>
    </Status>
  );
}

export function AccountRouteSkeleton() {
  const pathname = usePathname();

  if (pathname.includes("/profile")) return <AccountProfileSkeleton />;
  if (/\/orders\/[^/]+/.test(pathname)) return <AccountOrderDetailSkeleton />;
  if (pathname.includes("/orders")) return <AccountOrdersSkeleton />;
  if (pathname.includes("/address")) return <AccountAddressesSkeleton />;
  if (pathname.includes("/coupons")) return <AccountCouponsSkeleton />;
  if (pathname.includes("/reviews")) return <AccountReviewsSkeleton />;
  return <AccountDashboardSkeleton />;
}

export function AccountShellSkeleton() {
  return (
    <div className="container section_y_space">
      <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-8">
        <NavSkeleton />
        <div className="min-w-0">
          <AccountRouteSkeleton />
        </div>
      </div>
    </div>
  );
}
