"use client";

import { useWishlistCount } from "@/store/endpoints/wishlistApi";

export function AccountWishlistCount() {
  return useWishlistCount();
}
