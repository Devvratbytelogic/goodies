import ImageComponent from "@/components/layout/common/ImageComponent";

export default function MainBanner() {
  return (
    <section className="w-full">
      <ImageComponent
        src="/images/home/main-banner1.webp"
        alt="Goodies banner"
        width={1920}
        height={1080}
        preload
        sizes="100vw"
        className="h-auto w-full"
      />
    </section>
  );
}
