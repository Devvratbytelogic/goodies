import BestSellerSection from "@/components/page-components/home/BestSellerSection";
import CategorySection from "@/components/page-components/home/CategorySection";
import MainBanner from "@/components/page-components/home/MainBanner";
import NewArrivalsSection from "@/components/page-components/home/NewArrivalsSection";
import TastyChoicesSection from "@/components/page-components/home/TastyChoicesSection";

export default function Home() {

  return (
    <>
      <div className="">
        <MainBanner />
        <CategorySection />
        <BestSellerSection />
        <TastyChoicesSection />
        <NewArrivalsSection />
      </div>
    </>
  );
}
