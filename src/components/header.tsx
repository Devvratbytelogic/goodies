import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";

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
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Goodies
        </Link>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-zinc-950 dark:hover:text-zinc-50"
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
