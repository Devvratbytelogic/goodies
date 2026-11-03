"use client";

import Script from "next/script";
import { useLocale } from "next-intl";
import { useEffect } from "react";

// Public widget key from the live Goodies storefront. It only renders Tamara's promo.
const TAMARA_PUBLIC_KEY = "f26cc29a-ec69-48d8-97e7-ca43e8e9cbe0";

type TamaraWidgetElement = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  amount?: string;
  type?: string;
  "inline-type"?: string;
};

declare global {
  interface Window {
    tamaraWidgetConfig?: {
      lang: string;
      country: string;
      publicKey: string;
    };
    TamaraWidgetV2?: {
      refresh: () => void;
    };
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "tamara-widget": TamaraWidgetElement;
    }
  }
}

type TamaraPromoProps = {
  price: number;
};

export default function TamaraPromo({ price }: TamaraPromoProps) {
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  const amount = price.toFixed(2);

  if (typeof window !== "undefined") {
    window.tamaraWidgetConfig = {
      lang,
      country: "AE",
      publicKey: TAMARA_PUBLIC_KEY,
    };
  }

  useEffect(() => {
    window.tamaraWidgetConfig = {
      lang,
      country: "AE",
      publicKey: TAMARA_PUBLIC_KEY,
    };
    window.TamaraWidgetV2?.refresh();
  }, [lang, amount]);

  return (
    <div className="min-h-12">
      <Script src="https://cdn.tamara.co/widget-v2/tamara-widget.js" strategy="afterInteractive" />
      <tamara-widget type="tamara-summary" inline-type="2" amount={amount} />
    </div>
  );
}
