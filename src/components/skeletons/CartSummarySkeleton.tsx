type CartSummarySkeletonProps = {
  label: string;
  checkoutHref?: string;
  showItems: boolean;
};

export default function CartSummarySkeleton({ label, checkoutHref, showItems }: CartSummarySkeletonProps) {
  return (
    <aside role="status" aria-busy="true" aria-label={label} className="overflow-hidden rounded-2xl border border-border bg-background lg:sticky lg:top-24">
      <span className="sr-only">{label}</span>
      {showItems ? (
        <div className="border-b border-border">
          <div className="px-5 pt-4">
            <div className="h-5 w-28 animate-pulse rounded bg-surface-muted" />
          </div>
          <ul className="divide-y divide-border px-5">
            {Array.from({ length: 2 }, (_, index) => (
              <li key={index} className="flex items-center gap-3 py-4">
                <div className="size-16 shrink-0 animate-pulse rounded-xl bg-surface-muted" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-surface-muted" />
                  <div className="h-3 w-1/3 animate-pulse rounded bg-surface-muted" />
                </div>
                <div className="h-4 w-14 shrink-0 animate-pulse rounded bg-surface-muted" />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
        <div className="size-11 shrink-0 animate-pulse rounded-2xl bg-surface-muted" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3.5 w-24 animate-pulse rounded bg-surface-muted" />
          <div className="h-3 w-32 animate-pulse rounded bg-surface-muted" />
        </div>
        <div className="size-6 shrink-0 animate-pulse rounded-full bg-surface-muted" />
      </div>
      <div className="p-5">
        <div className="h-5 w-28 animate-pulse rounded bg-surface-muted" />
        <div className="mt-4 space-y-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="h-3.5 w-24 animate-pulse rounded bg-surface-muted" />
            <div className="h-3.5 w-16 animate-pulse rounded bg-surface-muted" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="h-3.5 w-20 animate-pulse rounded bg-surface-muted" />
            <div className="h-3.5 w-14 animate-pulse rounded bg-surface-muted" />
          </div>
          <div className="h-12 animate-pulse rounded-xl bg-surface-muted" />
        </div>
        {checkoutHref ? <div className="mt-4 h-12 animate-pulse rounded-full bg-surface-muted" /> : null}
      </div>
    </aside>
  );
}
