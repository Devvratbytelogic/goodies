export const currencies = ["AED", "USD", "EUR", "SAR", "QAR", "KWD", "OMR", "BHD"] as const;

export type CurrencyCode = (typeof currencies)[number];

export const defaultCurrency: CurrencyCode = "AED";

export const countryCookie = "country";

export function toCurrency(value: string | undefined | null): CurrencyCode {
  return value && (currencies as readonly string[]).includes(value) ? (value as CurrencyCode) : defaultCurrency;
}
