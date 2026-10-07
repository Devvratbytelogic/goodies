import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import TabbyResult from "@/components/checkout/TabbyResult";
import { getCheckoutClassicRoutePath, getShopRoutePath } from "@/utils/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CheckoutClassicPage");
  return {
    title: t("tabbyResultTitle"),
    robots: { index: false, follow: false },
  };
}

export default function TabbyResultPage() {
  return (
    <div className="container section_y_space">
      <Suspense>
        <TabbyResult shopHref={getShopRoutePath()} checkoutHref={getCheckoutClassicRoutePath()} />
      </Suspense>
    </div>
  );
}
