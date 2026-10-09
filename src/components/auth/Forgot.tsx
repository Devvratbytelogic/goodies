"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import type { InferType } from "yup";
import { useOpenLogin } from "@/components/auth/Login";
import { RequiredMark } from "@/components/form/RequiredMark";
import { useOpenOtp } from "@/components/auth/OTPScreen";
import { useModal } from "@/components/layout/common/ModalProvider";
import { forgotPassword } from "@/server/auth";
import { getDeviceId } from "@/utils/deviceId";
import { forgotValidationSchema } from "@/validations";

type ForgotValues = InferType<typeof forgotValidationSchema>;
type ValidationMessageKey = "required" | "emailInvalid";

const fieldClassName =
  "h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm font-normal text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-primary focus:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-primary";

const labelClassName = "block text-[13px] font-semibold text-heading";


export default function Forgot() {
  const t = useTranslations("Forgot");
  const openLogin = useOpenLogin();
  const openOtp = useOpenOtp();
  const [error, setError] = useState("");
  const formik = useFormik<ForgotValues>({
    initialValues: { email: "" },
    validationSchema: forgotValidationSchema,
    onSubmit: async (values, helpers) => {
      setError("");

      try {
        const result = await forgotPassword(values.email.trim(), getDeviceId());
        if (!result.ok) {
          setError(result.message || t("failed"));
          return;
        }
        openOtp(values.email.trim(), "forgot");
      } catch (caught) {
        setError(caught instanceof Error && caught.message ? caught.message : t("failed"));
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  function fieldError(name: keyof ForgotValues) {
    const error = formik.touched[name] ? formik.errors[name] : undefined;
    return error ? t(error as ValidationMessageKey) : undefined;
  }

  return (
    <form noValidate onSubmit={formik.handleSubmit} className="grid gap-y-3 gap-4">
      <p className="-mt-1 text-sm leading-relaxed text-muted">{t("subtitle")}</p>
      <label className={labelClassName}>
        {t("email")}
        <RequiredMark />
        <input
          name="email"
          type="email"
          autoComplete="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          aria-invalid={Boolean(fieldError("email"))}
          aria-describedby={fieldError("email") ? "forgot-email-error" : undefined}
          className={`${fieldClassName} mt-1`}
        />
        {fieldError("email") ? (
          <p id="forgot-email-error" className="mt-1.5 text-xs font-normal text-primary">
            {fieldError("email")}
          </p>
        ) : null}
      </label>
      {error ? (
        <p role="alert" className="text-sm text-primary">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="mt-1 inline-flex h-10 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70"
      >
        {formik.isSubmitting ? t("submitting") : t("submit")}
      </button>
      <p className="text-center text-sm text-muted">
        {t("remember")}{" "}
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

export function useOpenForgot() {
  const { openModal } = useModal();
  const t = useTranslations("Forgot");

  return function openForgot() {
    openModal({
      title: t("title"),
      size: "sm",
      content: <Forgot />,
    });
  };
}
