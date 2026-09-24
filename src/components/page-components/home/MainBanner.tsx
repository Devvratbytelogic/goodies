import ImageComponent from "@/components/layout/common/ImageComponent";

export default function MainBanner() {
  return (
    <section className="w-full">
      <ImageComponent
        src="/images/home/main-banner1.webp"
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
