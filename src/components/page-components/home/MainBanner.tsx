import ImageComponent from "@/components/layout/common/ImageComponent";

export default function MainBanner({ banner }: { banner: string | null }) {
  return (
    <section className="w-full">
      <ImageComponent
        src={banner ?? "/images/image-fallback.svg"}
        alt="Goodies banner"
        width={1600}
        height={900}
        preload
        // quality={65}
        sizes="100vw"
      />
    </section>
  );
}
