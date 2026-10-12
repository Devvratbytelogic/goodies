"use client";

import { AccountStatValueSkeleton } from "@/components/skeletons/AccountSkeletons";
import { useGetWishlistQuery, useWishlistCount } from "@/store/endpoints/wishlistApi";

export function AccountWishlistCount() {
  const { data, isLoading, isUninitialized } = useGetWishlistQuery();
  const count = useWishlistCount();
  if (!data && (isLoading || isUninitialized)) return <AccountStatValueSkeleton />;
  return count;
}
