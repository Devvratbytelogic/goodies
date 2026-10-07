import { cookies } from "next/headers";
import { countryCookie, defaultCurrency, isCurrencyCode, type CurrencyCode } from "@/utils/currency";

export async function getRequestCurrency(): Promise<CurrencyCode> {
  const jar = await cookies();
  const value = jar.get(countryCookie)?.value;
  return isCurrencyCode(value) ? value : defaultCurrency;
}
