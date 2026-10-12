'use client';
import type { ReactNode } from "react";
import AccountNav from "@/components/account/AccountNav";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AccountShellSkeleton } from "@/components/skeletons/AccountSkeletons";
import { useGetUserProfileQuery } from "@/store/endpoints/userApi";
import { useAuth } from "@/components/auth/AuthProvider";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

export default function MyAccountLayout({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const { data: profile, isLoading, isUninitialized } = useGetUserProfileQuery(undefined, {
    skip: !token,
  });

  const name = `${profile?.name ?? ''} ${profile?.last_name ?? ''}`.trim();
  const photo = profile?.profile_pic ?? '';
  const email = profile?.email ?? '';
  return (
    <RequireAuth fallback={<AccountShellSkeleton />}>
      <div className="container section_y_space">
        <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-8">
          <AccountNav name={name} photo={photo} email={email} pending={!profile && (isLoading || isUninitialized)} />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </RequireAuth>
  );
}
