import { useTranslations } from "next-intl";
import MainBanner from "@/components/page-components/home/MainBanner";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <>
      <MainBanner />
    </>
  );
}
