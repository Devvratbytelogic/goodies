"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

type CartDrawerContextValue = {
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  checkoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
};

const CartDrawerContext = createContext<CartDrawerContextValue | null>(null);

export function useCartDrawer() {
  const cartDrawer = useContext(CartDrawerContext);

  if (!cartDrawer) {
    throw new Error("useCartDrawer must be used within CartDrawerProvider");
  }

  return cartDrawer;
}

export function CartDrawerProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [renderedPathname, setRenderedPathname] = useState(pathname);

  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname);
    if (open) setOpen(false);
    if (checkoutOpen) setCheckoutOpen(false);
  }

  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);
  const openCheckout = useCallback(() => {
    setOpen(false);
    setCheckoutOpen(true);
  }, []);
  const closeCheckout = useCallback(() => setCheckoutOpen(false), []);
  const value = useMemo(
    () => ({ open, openCart, closeCart, checkoutOpen, openCheckout, closeCheckout }),
    [open, openCart, closeCart, checkoutOpen, openCheckout, closeCheckout],
  );

  return <CartDrawerContext.Provider value={value}>{children}</CartDrawerContext.Provider>;
}
