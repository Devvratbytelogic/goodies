import ImageComponent from "@/components/layout/common/ImageComponent";

export default function MainBanner({ banner, bannerMobile }: { banner: string | null; bannerMobile: string | null }) {
  const desktopSrc = banner?.trim() || "/images/image-fallback.svg";
  const mobileSrc = bannerMobile?.trim() || desktopSrc;

  return (
    <section className="w-full">
      <ImageComponent
        src={desktopSrc}
        alt="Goodies banner"
        width={1600}
        height={800}
        sizes="100vw"
        quality={65}
        preload
        fetchPriority="high"
        className="hidden md:block"
      />
      <ImageComponent
        src={mobileSrc}
        alt="Goodies banner"
        width={1600}
        height={900}
        sizes="100vw"
        quality={65}
        preload
        fetchPriority="high"
        className="md:hidden"
      />
    </section>
  );
}
