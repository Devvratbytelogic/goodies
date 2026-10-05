"use client";

import { useTranslations } from "next-intl";
import { useModal } from "@/components/layout/common/ModalProvider";
import { useRemoveFromCartMutation } from "@/store/endpoints/cartApi";

type RemoveCartItemConfirmProps = {
  itemId: string;
  name: string;
};

export default function RemoveCartItemConfirm({ itemId, name }: RemoveCartItemConfirmProps) {
  const t = useTranslations("CartPage");
  const { closeModal } = useModal();
  const [removeFromCart, { isLoading }] = useRemoveFromCartMutation();

  const confirmRemove = async () => {
    try {
      await removeFromCart(itemId).unwrap();
      closeModal();
    } catch {}
  };

  return (
    <>
      <p className="text-sm text-muted">{t("removeConfirm", { name })}</p>
      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={closeModal}
          disabled={isLoading}
          className="inline-flex h-10 items-center justify-center rounded-full border border-border px-5 text-sm font-semibold text-heading transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {t("cancel")}
        </button>
        <button
          type="button"
          onClick={confirmRemove}
          disabled={isLoading}
          className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? t("removing") : t("confirmRemove")}
        </button>
      </div>
    </>
  );
}
