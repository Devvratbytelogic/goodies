"use client";

import { useRef } from "react";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import type { InferType } from "yup";
import { useOpenForgot } from "@/components/auth/Forgot";
import { useOpenResetPassword } from "@/components/auth/ResetPassword";
import { useModal } from "@/components/layout/common/ModalProvider";
import { otpValidationSchema } from "@/validations";

type OtpValues = InferType<typeof otpValidationSchema>;
type ValidationMessageKey = "required" | "invalid";

const codeLength = 6;

const digitClassName =
  "h-12 w-full rounded-xl border border-border bg-surface text-center text-sm font-normal text-foreground outline-none transition-colors focus:border-primary focus:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-primary";

function emailFromData(data: unknown) {
  if (!data || typeof data !== "object" || !("email" in data)) {
    return "";
  }

  return typeof data.email === "string" ? data.email : "";
}

export default function OTPScreen() {
  const t = useTranslations("OTP");
  const { data } = useModal();
  const openForgot = useOpenForgot();
  const openResetPassword = useOpenResetPassword();
  const email = emailFromData(data);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const formik = useFormik<OtpValues>({
    initialValues: { code: "" },
    validationSchema: otpValidationSchema,
    onSubmit: () => {
      openResetPassword(email);
    },
  });

  const digits = Array.from({ length: codeLength }, (_, index) => formik.values.code[index] ?? "");
  const error = formik.touched.code ? formik.errors.code : undefined;

  function updateCode(nextDigits: string[]) {
    void formik.setFieldValue("code", nextDigits.join(""));
  }

  function onDigitChange(index: number, value: string) {
    const cleaned = value.replace(/\D/g, "");

    if (cleaned.length > 1) {
      const nextDigits = Array.from({ length: codeLength }, (_, digitIndex) => cleaned[digitIndex] ?? "");
      updateCode(nextDigits);
      inputs.current[Math.min(cleaned.length, codeLength) - 1]?.focus();
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = cleaned;
    updateCode(nextDigits);

    if (cleaned && index < codeLength - 1) {
      inputs.current[index + 1]?.focus();
    }
  }

  function onKeyDown(index: number, key: string) {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  return (
    <form noValidate onSubmit={formik.handleSubmit} className="grid gap-4">
      <p className="-mt-1 text-sm leading-relaxed text-muted">{t("subtitle", { email })}</p>
      <div>
        <p id="otp-label" className="text-[13px] font-semibold text-heading">
          {t("label")}
        </p>
        <div className="mt-1 grid grid-cols-6 gap-2" role="group" aria-labelledby="otp-label">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(node) => {
                inputs.current[index] = node;
              }}
              value={digit}
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              aria-label={`${t("label")} ${index + 1}`}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "otp-error" : undefined}
              onChange={(event) => onDigitChange(index, event.target.value)}
              onKeyDown={(event) => onKeyDown(index, event.key)}
              onBlur={() => {
                void formik.setFieldTouched("code", true);
              }}
              className={digitClassName}
            />
          ))}
        </div>
        {error ? (
          <p id="otp-error" className="mt-1.5 text-xs font-normal text-primary">
            {t(error as ValidationMessageKey)}
          </p>
        ) : null}
      </div>
      <button
        type="submit"
        className="inline-flex h-10 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t("submit")}
      </button>
      <p className="text-center text-sm">
        <button
          type="button"
          onClick={openForgot}
          className="text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t("changeEmail")}
        </button>
      </p>
    </form>
  );
}

export function useOpenOtp() {
  const { openModal } = useModal();
  const t = useTranslations("OTP");

  return function openOtp(email: string) {
    openModal({
      title: t("title"),
      size: "sm",
      content: <OTPScreen />,
      data: { email },
    });
  };
}
