import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { BottomNav } from "@/components/layout/footer/BottomNav";
import Footer from "@/components/layout/footer/Footer";
import { WhatsAppFloatingButton } from "@/components/layout/common/WhatsAppFloatingButton";
import { Header } from "@/components/layout/header/Header";
import { getCategories, getGlobalSettings } from "@/server";
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
  const [categories, settings] = await Promise.all([
    getCategories(country),
    getGlobalSettings(country),
  ]);
  const shopCategories = (categories ?? []).map((category) => ({
    href: getProductCategoryRoutePath(category.slug),
    label: category.name,
  }));
  const contact = {
    email: settings?.email?.trim() || '',
    phone: settings?.phone?.trim() || '',
    address: settings?.address?.trim() || '',
    instagram: settings?.instagram_link?.trim() || "https://www.instagram.com/qarqusha.goodies",
    whatsapp: `https://wa.me/${(settings?.phone?.trim() || '')}`,
  };

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header currency={country} headerTextFirst={settings?.header_text_first?.trim() || ''} headerTextSecond={settings?.header_text_second?.trim() || ''} />
      <main className="flex-1">{children}</main>
      <Footer categories={shopCategories} contact={contact} />
      <BottomNav />
      <WhatsAppFloatingButton href={contact.whatsapp} />
    </div>
  );
}
