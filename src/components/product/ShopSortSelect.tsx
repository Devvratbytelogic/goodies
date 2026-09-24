type ShopSortOption = {
  value: string;
  label: string;
};

type ShopSortSelectProps = {
  id: string;
  label: string;
  defaultValue: string;
  options: ShopSortOption[];
};

export default function ShopSortSelect({ id, label, defaultValue, options }: ShopSortSelectProps) {
  return (
    <>
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        defaultValue={defaultValue}
        className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}
