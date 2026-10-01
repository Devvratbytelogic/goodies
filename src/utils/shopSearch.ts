export function shopSearchPath(pathname: string, current: string, updates: Record<string, string | null>) {
  const params = new URLSearchParams(current);
  params.delete("page");

  for (const [key, value] of Object.entries(updates)) {
    if (value == null) params.delete(key);
    else params.set(key, value);
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
