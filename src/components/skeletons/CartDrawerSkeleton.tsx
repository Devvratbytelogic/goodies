export default function CartDrawerSkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className="flex min-h-0 flex-1 flex-col">
      <span className="sr-only">{label}</span>
      <ul className="min-h-0 flex-1 divide-y divide-border px-5">
        {Array.from({ length: 2 }, (_, index) => (
          <li key={index} className="flex gap-3 py-4">
            <div className="size-20 shrink-0 animate-pulse rounded-xl bg-surface-muted" />
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-surface-muted" />
                  <div className="h-3.5 w-16 animate-pulse rounded bg-surface-muted" />
                </div>
                <div className="h-4 w-14 shrink-0 animate-pulse rounded bg-surface-muted" />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-9 w-28 animate-pulse rounded-full bg-surface-muted" />
                <div className="size-9 animate-pulse rounded-full bg-surface-muted" />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="border-t border-border px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-3">
          <div className="h-5 w-32 animate-pulse rounded bg-surface-muted" />
          <div className="h-5 w-16 animate-pulse rounded bg-surface-muted" />
        </div>
        <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-surface-muted" />
        <div className="mt-4 h-12 animate-pulse rounded-full bg-surface-muted" />
      </div>
    </div>
  );
}
