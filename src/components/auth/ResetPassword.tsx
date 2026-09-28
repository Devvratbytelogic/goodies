"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { LuEye, LuEyeOff } from "react-icons/lu";
import type { InferType } from "yup";
import { useOpenLogin } from "@/components/auth/Login";
import { useModal } from "@/components/layout/common/ModalProvider";
import { resetPasswordValidationSchema } from "@/validations";

type ResetValues = InferType<typeof resetPasswordValidationSchema>;
type ValidationMessageKey = "required" | "tooShort" | "lowercase" | "uppercase" | "number" | "special" | "passwordMismatch";

const fieldClassName =
  "h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm font-normal text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-primary focus:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-primary";

const labelClassName = "block text-[13px] font-semibold text-heading";

function emailFromData(data: unknown) {
  if (!data || typeof data !== "object" || !("email" in data)) {
    return "";
  }

  return typeof data.email === "string" ? data.email : "";
}

export default function ResetPassword() {
  const t = useTranslations("ResetPassword");
  const { closeModal, data } = useModal();
  const openLogin = useOpenLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const formik = useFormik<ResetValues>({
    initialValues: { password: "", confirmPassword: "" },
    validationSchema: resetPasswordValidationSchema,
    onSubmit: () => {
      closeModal();
    },
  });

  function fieldError(name: keyof ResetValues) {
    const error = formik.touched[name] ? formik.errors[name] : undefined;
    return error ? t(error as ValidationMessageKey) : undefined;
  }

  return (
    <form noValidate onSubmit={formik.handleSubmit} className="grid gap-y-3 gap-4">
      <p className="-mt-1 text-sm leading-relaxed text-muted">{t("subtitle", { email: emailFromData(data) })}</p>
      <label className={labelClassName}>
        {t("password")}
        <span className="relative mt-1 block">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-invalid={Boolean(fieldError("password"))}
            aria-describedby={fieldError("password") ? "reset-password-error" : undefined}
            className={`${fieldClassName} pe-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            aria-pressed={showPassword}
            className="absolute inset-e-1.5 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {showPassword ? <LuEyeOff aria-hidden className="size-4" /> : <LuEye aria-hidden className="size-4" />}
          </button>
        </span>
        {fieldError("password") ? (
          <p id="reset-password-error" className="mt-1.5 text-xs font-normal text-primary">
            {fieldError("password")}
          </p>
        ) : null}
      </label>
      <label className={labelClassName}>
        {t("confirmPassword")}
        <span className="relative mt-1 block">
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-invalid={Boolean(fieldError("confirmPassword"))}
            aria-describedby={fieldError("confirmPassword") ? "reset-confirm-password-error" : undefined}
            className={`${fieldClassName} pe-12`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((current) => !current)}
            aria-label={showConfirmPassword ? t("hidePassword") : t("showPassword")}
            aria-pressed={showConfirmPassword}
            className="absolute inset-e-1.5 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {showConfirmPassword ? <LuEyeOff aria-hidden className="size-4" /> : <LuEye aria-hidden className="size-4" />}
          </button>
        </span>
        {fieldError("confirmPassword") ? (
          <p id="reset-confirm-password-error" className="mt-1.5 text-xs font-normal text-primary">
            {fieldError("confirmPassword")}
          </p>
        ) : null}
      </label>
      <button
        type="submit"
        className="mt-1 inline-flex h-10 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t("submit")}
      </button>
      <p className="text-center text-sm">
        <button
          type="button"
          onClick={openLogin}
          className="text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t("login")}
        </button>
      </p>
    </form>
  );
}

export function useOpenResetPassword() {
  const { openModal } = useModal();
  const t = useTranslations("ResetPassword");

  return function openResetPassword(email: string) {
    openModal({
      title: t("title"),
      size: "sm",
      content: <ResetPassword />,
      data: { email },
    });
  };
}
