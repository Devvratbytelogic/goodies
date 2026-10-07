import { getCategories } from "@/server";
import { getProductCategoryRoutePath } from "@/utils/routes";
import type { CurrencyCode } from "@/utils/currency";
import { AnnouncementBar } from "./AnnouncementBar";
import { HeaderBar } from "./HeaderBar";

type HeaderProps = {
  currency: CurrencyCode;
  cartCount?: number;
  wishlistCount?: number;
};

export async function Header({ currency, cartCount = 0, wishlistCount = 0 }: HeaderProps) {
  const categoryList = (await getCategories(currency)) ?? [];
  const shopCategories = categoryList.map((category) => ({
    href: getProductCategoryRoutePath(category.slug),
    label: category.name,
  }));

  return (
    <>
      <AnnouncementBar />
      <HeaderBar cartCount={cartCount} wishlistCount={wishlistCount} shopCategories={shopCategories} currency={currency} />
    </>
  );
}
