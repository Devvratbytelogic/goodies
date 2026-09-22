import { useTranslations } from "next-intl";
import { LuHeart, LuTruck } from "react-icons/lu";

export function AnnouncementBar() {
  const t = useTranslations("Header");

  return (
    <div className="bg-accent-deep text-accent-foreground">
      <div className="container flex h-9 items-center justify-center gap-4 text-[11px] font-medium tracking-wide sm:h-10 sm:gap-6 sm:text-xs">
        <p className="flex items-center gap-2">
          <LuTruck aria-hidden className="size-4 shrink-0" />
          <span>{t("announcementDelivery")}</span>
        </p>
        <span
          aria-hidden
          className="hidden h-3.5 w-px bg-accent-foreground/40 sm:block"
        />
        <p className="hidden items-center gap-2 sm:flex">
          <LuHeart aria-hidden className="size-4 shrink-0 fill-current" />
          <span>{t("announcementMadeWithLove")}</span>
        </p>
      </div>
    </div>
  );
}
