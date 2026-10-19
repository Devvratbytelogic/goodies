import { getCategories } from "@/server";
import { getProductCategoryRoutePath } from "@/utils/routes";
import type { CurrencyCode } from "@/utils/currency";
import { AnnouncementBar } from "./AnnouncementBar";
import { HeaderBar } from "./HeaderBar";

type HeaderProps = {
  logo: string;
  currency: CurrencyCode;
  headerTextFirst: string;
  headerTextSecond: string;
};

export async function Header({ logo, currency, headerTextFirst, headerTextSecond }: HeaderProps) {
  const categoryList = (await getCategories(currency)) ?? [];
  const shopCategories = categoryList.map((category) => ({
    href: getProductCategoryRoutePath(category.slug),
    label: category.name,
  }));

  return (
    <>
      <AnnouncementBar headerTextFirst={headerTextFirst} headerTextSecond={headerTextSecond} />
      <HeaderBar logo={logo} currency={currency} shopCategories={shopCategories} />
    </>
  );
}
