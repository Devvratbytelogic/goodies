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
  return "/account";
}

export function getCheckoutClassicRoutePath(): string {
  return "/checkout-classic";
}

// ─── Dynamic Routes ─────────────────────────────────────────────────────────

export function getProductCategoryRoutePath(category: string): string {
  return `/product-category/${category}`;
}

export function getProductRoutePath(slug: string): string {
  return `/product/${slug}`;
}
