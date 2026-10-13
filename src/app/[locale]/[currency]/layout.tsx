import { notFound } from "next/navigation";
import { BottomNav } from "@/components/layout/footer/BottomNav";
import Footer from "@/components/layout/footer/Footer";
import { WhatsAppFloatingButton } from "@/components/layout/common/WhatsAppFloatingButton";
import { Header } from "@/components/layout/header/Header";
import { getCategories } from "@/server";
import { currencies, toCurrency } from "@/utils/currency";
import { getProductCategoryRoutePath } from "@/utils/routes";

export function generateStaticParams() {
  return currencies.map((currency) => ({ currency }));
}

export default async function CurrencyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ currency: string }>;
}) {
  const { currency } = await params;
  if (!(currencies as readonly string[]).includes(currency)) notFound();
  const country = toCurrency(currency);
  const categories = ((await getCategories(country)) ?? [])
    .map((category) => ({
      href: getProductCategoryRoutePath(category.slug),
      label: category.name,
    }));

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header currency={country} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
      <BottomNav />
      <WhatsAppFloatingButton />
    </div>
  );
}
