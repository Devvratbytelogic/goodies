"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { LuX } from "react-icons/lu";

export type ModalSize = "sm" | "md" | "lg";

const modalWidth: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

const motionMs = 200;

type ModalOptions = {
  title: string;
  content: ReactNode;
  size?: ModalSize;
  data?: unknown;
};

type ModalState = ModalOptions & {
  size: ModalSize;
  phase: "enter" | "open" | "leave";
};

type ModalContextValue = {
  openModal: (options: ModalOptions) => void;
  closeModal: () => void;
  data?: unknown;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal() {
  const modal = useContext(ModalContext);

  if (!modal) {
    throw new Error("useModal must be used within ModalProvider");
  }

  return modal;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("Modal");
  const [modal, setModal] = useState<ModalState | null>(null);
  const isOpen = modal !== null;

  function openModal(options: ModalOptions) {
    const alreadyOpen = modal !== null && modal.phase !== "leave";
    const next: ModalState = {
      title: options.title,
      content: options.content,
      size: options.size ?? "md",
      data: options.data,
      phase: alreadyOpen || prefersReducedMotion() ? "open" : "enter",
    };

    setModal(next);

    if (next.phase === "open") {
      return;
    }

    // Paint the hidden state first, then animate to open.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setModal((current) => (current?.phase === "enter" ? { ...current, phase: "open" } : current));
      });
    });
  }

  function closeModal() {
    setModal((current) => {
      if (!current || current.phase === "leave") {
        return current;
      }

      if (prefersReducedMotion()) {
        return null;
      }

      return { ...current, phase: "leave" };
    });
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (modal?.phase !== "leave") {
      return;
    }

    const timeout = window.setTimeout(() => setModal(null), motionMs);
    return () => window.clearTimeout(timeout);
  }, [modal?.phase]);

  const shown = modal?.phase === "open";

  return (
    <ModalContext.Provider value={{ openModal, closeModal, data: modal?.data }}>
      {children}
      {modal ? (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-4">
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ease-out motion-reduce:transition-none ${shown ? "opacity-100" : "opacity-0"}`}
            onClick={closeModal}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className={`relative z-90 max-h-[calc(100dvh-2rem)] w-full ${modalWidth[modal.size]} overflow-y-auto rounded-2xl bg-background p-5 shadow-lg transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none ${shown ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="modal-title" className="text-lg font-bold tracking-tight">
                {modal.title}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                aria-label={t("close")}
                className="-me-4 -mt-4 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <LuX aria-hidden className="size-4" />
              </button>
            </div>
            <div className="mt-4">{modal.content}</div>
          </div>
        </div>
      ) : null}
    </ModalContext.Provider>
  );
}
