const sorts = ["newest", "low_to_high", "high_to_low"] as const;

export type ShopSort = (typeof sorts)[number];

export function priceParam(value?: string | null) {
  if (!value) return undefined;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : undefined;
}

export function sortParam(value?: string | null) {
  return sorts.includes(value as ShopSort) ? (value as ShopSort) : undefined;
}

export function shopPageParam(value?: string | null) {
  return Math.max(1, Number(value) || 1);
}

export function shopResultWindow(page: number, limit: number, count: number, total: number) {
  const size = limit > 0 ? limit : count;
  const from = count === 0 ? 0 : (page - 1) * size + 1;
  const to = count === 0 ? 0 : from + count - 1;
  const totalPages = Math.max(1, size > 0 ? Math.ceil(total / size) : 1);
  return { from, to, totalPages };
}

export function shopPageHref(path: string, number: number, minPrice?: number, maxPrice?: number, sort?: string, search?: string) {
  const params = new URLSearchParams();
  if (number > 1) params.set("page", String(number));
  if (minPrice != null && maxPrice != null) {
    params.set("min_price", String(minPrice));
    params.set("max_price", String(maxPrice));
  }
  if (sort) params.set("sort", sort);
  if (search) params.set("search", search);
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}
