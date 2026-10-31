"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LuArrowUp } from "react-icons/lu";

export function ScrollToTopButton() {
  const t = useTranslations("Footer");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function scrollUp() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollUp}
      inert={!visible}
      aria-label={t("scrollToTop")}
      className={`fixed right-4 z-40 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(214,7,81,0.35)] transition-[transform,opacity,bottom] duration-300 hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px)+1rem+var(--purchase-bar-offset,0px))] lg:bottom-[calc(1.5rem+var(--purchase-bar-offset,0px))] ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <LuArrowUp aria-hidden className="size-5" />
    </button>
  );
}
