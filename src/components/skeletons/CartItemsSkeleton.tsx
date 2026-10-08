export default function CartItemsSkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className="overflow-hidden rounded-2xl border border-border bg-background">
      <span className="sr-only">{label}</span>
      <ul className="divide-y divide-border">
        {Array.from({ length: 2 }, (_, index) => (
          <li key={index} className="flex gap-4 p-4 sm:gap-5 sm:p-5">
            <div className="size-20 shrink-0 animate-pulse rounded-xl bg-surface-muted sm:size-24" />
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="h-4 w-2/3 animate-pulse rounded bg-surface-muted" />
              <div className="mt-2 h-3 w-1/4 animate-pulse rounded bg-surface-muted" />
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="h-9 w-28 animate-pulse rounded-full bg-surface-muted" />
                <div className="h-4 w-16 animate-pulse rounded bg-surface-muted" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
