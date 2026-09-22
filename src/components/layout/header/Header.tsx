import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "../../locale-switcher";

const links = [
  { href: "/", key: "home" },
  { href: "/shop", key: "shop" },
  { href: "/about-us", key: "aboutUs" },
  { href: "/contact-us", key: "contactUs" },
  { href: "/cart", key: "cart" },
  { href: "/wishlist", key: "wishlist" },
] as const;

export function Header() {
  const t = useTranslations("Nav");

  return (
    <header className="border-b border-border bg-background">
      <div className="container flex flex-wrap items-center justify-between gap-4 py-4">
        <Link
          href="/"
          aria-label="Goodies"
          className="inline-flex shrink-0 items-center"
        >
          <Image
            src="/logo/logo.webp"
            alt="Goodies"
            width={300}
            height={300}
            priority
            className="h-14 w-14"
          />
        </Link>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-primary"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>
        <LocaleSwitcher />
      </div>
    </header>
  );
}
