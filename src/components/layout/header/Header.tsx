import { getCategories } from "@/server";
import { getProductCategoryRoutePath } from "@/utils/routes";
import type { CurrencyCode } from "@/utils/currency";
import { AnnouncementBar } from "./AnnouncementBar";
import { HeaderBar } from "./HeaderBar";

type HeaderProps = {
  currency: CurrencyCode;
};

export async function Header({ currency }: HeaderProps) {
  const categoryList = (await getCategories(currency)) ?? [];
  const shopCategories = categoryList.map((category) => ({
    href: getProductCategoryRoutePath(category.slug),
    label: category.name,
  }));

  return (
    <>
      <AnnouncementBar />
      <HeaderBar currency={currency} shopCategories={shopCategories} />
    </>
  );
}
