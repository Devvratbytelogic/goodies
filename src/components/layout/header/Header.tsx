import { getCategories } from "@/server";
import { getProductCategoryRoutePath } from "@/utils/routes";
import { AnnouncementBar } from "./AnnouncementBar";
import { HeaderBar } from "./HeaderBar";

type HeaderProps = {
  cartCount?: number;
  wishlistCount?: number;
};

export async function Header({ cartCount = 0, wishlistCount = 0 }: HeaderProps) {
  const categories = (await getCategories()) ?? [];
  const shopCategories = categories
    .map((category) => ({
      href: getProductCategoryRoutePath(category.slug),
      label: category.name,
    }));

  return (
    <>
      <AnnouncementBar />
      <HeaderBar cartCount={cartCount} wishlistCount={wishlistCount} shopCategories={shopCategories} />
    </>
  );
}
