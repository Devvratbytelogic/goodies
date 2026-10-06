"use client";

import { useTranslations } from "next-intl";
import { useModal } from "@/components/layout/common/ModalProvider";
import { useDeleteAddressMutation } from "@/store/endpoints/addressApi";

type DeleteAddressConfirmProps = {
  addressId: string;
  name: string;
};

export default function DeleteAddressConfirm({ addressId, name }: DeleteAddressConfirmProps) {
  const t = useTranslations("CheckoutClassicPage");
  const { closeModal } = useModal();
  const [deleteAddress, { isLoading }] = useDeleteAddressMutation();

  const confirmDelete = async () => {
    try {
      await deleteAddress(addressId).unwrap();
      closeModal();
    } catch (error) {
      console.error("Error deleting address", error);
    }
  };

  return (
    <>
      <p className="text-sm text-muted">{t("deleteConfirm", { name })}</p>
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
          onClick={confirmDelete}
          disabled={isLoading}
          className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? t("deleting") : t("confirmDelete")}
        </button>
      </div>
    </>
  );
}
