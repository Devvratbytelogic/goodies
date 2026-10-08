// ─── Static Routes ─────────────────────────────────────────────────────────
// Every route path used across the app should be resolved through one of
// these helpers instead of being hardcoded as a string literal, so the URL
// structure can be changed from a single place.

export function getHomeRoutePath(): string {
  return "/";
}

export function getShopRoutePath(): string {
  return "/shop";
}

export function getAboutUsRoutePath(): string {
  return "/about-us";
}

export function getContactUsRoutePath(): string {
  return "/contact-us";
}

export function getCartRoutePath(): string {
  return "/cart";
}

export function getWishlistRoutePath(): string {
  return "/wishlist";
}

export function getAccountRoutePath(): string {
  return "/my-account/";
}

export function getAccountProfileRoutePath(): string {
  return "/my-account/profile/";
}

export function getAccountOrdersRoutePath(): string {
  return "/my-account/orders/";
}

export function getAccountOrderRoutePath(id: string): string {
  return `/my-account/orders/${id}/`;
}

export function getAccountAddressRoutePath(): string {
  return "/my-account/address/";
}

export function getAccountCouponsRoutePath(): string {
  return "/my-account/coupons/";
}

export function getCheckoutClassicRoutePath(): string {
  return "/cart/checkout";
}

export function getTabbyResultRoutePath(): string {
  return "/cart/checkout/tabby";
}

// ─── Dynamic Routes ─────────────────────────────────────────────────────────

export function getProductCategoryRoutePath(category: string): string {
  return `/product-category/${category}`;
}

export function getProductRoutePath(slug: string): string {
  return `/product/${slug}`;
}
