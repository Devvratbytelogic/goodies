import { BottomNav } from "@/components/layout/footer/BottomNav";
import Footer from "@/components/layout/footer/Footer";
import { Header } from "@/components/layout/header/Header";
import { WhatsAppFloatingButton } from "@/components/layout/common/WhatsAppFloatingButton";
import { currencies, toCurrency } from "@/utils/currency";

export function generateStaticParams() {
  return currencies.map((currency) => ({ currency }));
}

export const dynamicParams = false;

export default async function CurrencyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ currency: string }>;
}) {
  const { currency } = await params;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header currency={toCurrency(currency)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <BottomNav />
      <WhatsAppFloatingButton />
    </div>
  );
}
