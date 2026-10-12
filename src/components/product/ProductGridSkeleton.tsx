export default function ProductGridSkeleton({ label }: { label: string }) {
  return (
    <ul
      className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3"
      aria-busy="true"
      aria-label={label}
    >
      {Array.from({ length: 6 }, (_, index) => (
        <li key={index}>
          <div className="overflow-hidden rounded-xl border border-border/50 sm:rounded-2xl">
            <div className="aspect-square animate-pulse bg-surface" />
            <div className="space-y-2 px-3 pt-2.5 sm:px-4 sm:pt-3">
              <div className="h-3 w-1/3 animate-pulse rounded bg-surface" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-surface" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-surface" />
            </div>
            <div className="px-3 pt-3 pb-3 sm:px-4 sm:pb-4">
              <div className="h-11 animate-pulse rounded-full bg-surface" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
