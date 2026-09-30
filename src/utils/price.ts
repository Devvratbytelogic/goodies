export function formatAmount(value: number, currencySymbol = "") {
  return currencySymbol ? `${currencySymbol} ${value}` : String(value);
}
