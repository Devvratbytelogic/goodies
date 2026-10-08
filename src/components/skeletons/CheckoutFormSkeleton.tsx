export default function CheckoutFormSkeleton({ label }: { label: string }) {
  return (
    <section role="status" aria-busy="true" aria-label={label} className="rounded-2xl border border-border bg-background px-5 py-5 sm:px-6 sm:py-6">
      <span className="sr-only">{label}</span>
      <div className="flex items-center justify-between gap-3">
        <div className="h-5 w-36 animate-pulse rounded bg-surface-muted" />
        <div className="h-4 w-28 animate-pulse rounded bg-surface-muted" />
      </div>
      <div className="mt-4 grid gap-3">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="flex items-start gap-3 rounded-xl border border-border p-4">
            <div className="mt-1 size-4 shrink-0 animate-pulse rounded-full bg-surface-muted" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-1/3 animate-pulse rounded bg-surface-muted" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-surface-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-surface-muted" />
              <div className="h-3 w-1/4 animate-pulse rounded bg-surface-muted" />
            </div>
            <div className="size-9 shrink-0 animate-pulse rounded-full bg-surface-muted" />
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-2.5 border-t border-border pt-5">
        <div className="size-4 animate-pulse rounded bg-surface-muted" />
        <div className="h-4 w-48 animate-pulse rounded bg-surface-muted" />
      </div>
      <div className="mt-6 border-t border-border pt-5">
        <div className="h-5 w-36 animate-pulse rounded bg-surface-muted" />
        <div className="mt-4 grid gap-3">
          {Array.from({ length: 2 }, (_, index) => (
            <div key={index} className="flex items-start gap-3 rounded-xl border border-border p-4">
              <div className="mt-1 size-4 shrink-0 animate-pulse rounded-full bg-surface-muted" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-2/5 animate-pulse rounded bg-surface-muted" />
                <div className="h-3 w-3/5 animate-pulse rounded bg-surface-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 h-12 animate-pulse rounded-full bg-surface-muted" />
    </section>
  );
}
