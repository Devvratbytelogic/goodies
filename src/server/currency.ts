import { cookies } from "next/headers";
import { toCurrency } from "@/utils/currency";

export async function getRequestCurrency() {
  const jar = await cookies();
  return toCurrency(jar.get("country")?.value);
}
