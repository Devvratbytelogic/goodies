import { AnnouncementBar } from "./AnnouncementBar";
import { HeaderBar } from "./HeaderBar";

type HeaderProps = {
  cartCount?: number;
  wishlistCount?: number;
};

export function Header({ cartCount = 0, wishlistCount = 0 }: HeaderProps) {
  return (
    <>
      <AnnouncementBar />
      <HeaderBar cartCount={cartCount} wishlistCount={wishlistCount} />
    </>
  );
}
