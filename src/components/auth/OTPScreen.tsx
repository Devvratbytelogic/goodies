"use client";

import { useRef, useState } from "react";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import type { InferType } from "yup";
import { useAuth } from "@/components/auth/AuthProvider";
import { resendCode, verifyCode, type VerifyType } from "@/server/auth";
import { useOpenForgot } from "@/components/auth/Forgot";
import { RequiredMark } from "@/components/form/RequiredMark";
import { useOpenLogin } from "@/components/auth/Login";
import { useOpenRegister } from "@/components/auth/Register";
import { useOpenResetPassword } from "@/components/auth/ResetPassword";
import { useModal } from "@/components/layout/common/ModalProvider";
import { otpValidationSchema } from "@/validations";

type OtpValues = InferType<typeof otpValidationSchema>;
type ValidationMessageKey = "required" | "invalid";

const codeLength = 6;

const digitClassName =
  "h-12 w-full rounded-xl border border-border bg-surface text-center text-sm font-normal text-foreground outline-none transition-colors focus:border-primary focus:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-primary";

function otpFromData(data: unknown): { email: string; type: VerifyType } {
  const record = data && typeof data === "object" ? data : {};
  const email = "email" in record && typeof record.email === "string" ? record.email : "";
  const rawType = "type" in record ? record.type : "";
  const type: VerifyType = rawType === "login" || rawType === "forgot" ? rawType : "account";
  return { email, type };
}

export default function OTPScreen() {
  const t = useTranslations("OTP");
  const { closeModal, data } = useModal();
  const { startSession } = useAuth();
  const openForgot = useOpenForgot();
  const openRegister = useOpenRegister();
  const openLogin = useOpenLogin();
  const openResetPassword = useOpenResetPassword();
  const { email, type } = otpFromData(data);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [resending, setResending] = useState(false);
  const formik = useFormik<OtpValues>({
    initialValues: { code: "" },
    validationSchema: otpValidationSchema,
    onSubmit: async (values, helpers) => {
      setErrorMessage("");
      setNotice("");

      try {
        const result = await verifyCode(email, values.code, type);
        if (!result.ok) {
          setErrorMessage(result.message || t("failed"));
          return;
        }
        const token = result.data?.token;

        if (type === "forgot") {
          if (!token) throw new Error(t("failed"));
          openResetPassword(email, token);
          return;
        }

        if (token) {
          startSession(token);
          closeModal();
          return;
        }

        openLogin();
      } catch (caught) {
        setErrorMessage(caught instanceof Error && caught.message ? caught.message : t("failed"));
      } finally {
        helpers.setSubmitting(false);
      }
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

  async function onResend() {
    setErrorMessage("");
    setNotice("");
    setResending(true);

    try {
      const result = await resendCode(email);
      if (!result.ok) {
        setErrorMessage(result.message || t("failed"));
        return;
      }
      setNotice(result.message || t("resent"));
    } catch (caught) {
      setErrorMessage(caught instanceof Error && caught.message ? caught.message : t("failed"));
    } finally {
      setResending(false);
    }
  }

  return (
    <form noValidate onSubmit={formik.handleSubmit} className="grid gap-4">
      <p className="-mt-1 text-sm leading-relaxed text-muted">{t("subtitle", { email })}</p>
      <div>
        <p id="otp-label" className="text-[13px] font-semibold text-heading">
          {t("label")}
          <RequiredMark />
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
      {notice ? (
        <p role="status" className="text-sm text-heading">
          {notice}
        </p>
      ) : null}
      {errorMessage ? (
        <p role="alert" className="text-sm text-primary">
          {errorMessage}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="inline-flex h-10 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70"
      >
        {formik.isSubmitting ? t("submitting") : t("submit")}
      </button>
      <p className="text-center text-sm">
        <button
          type="button"
          onClick={onResend}
          disabled={resending}
          className="text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70"
        >
          {resending ? t("resending") : t("resend")}
        </button>
        <span className="px-2 text-muted">·</span>
        <button
          type="button"
          onClick={type === "forgot" ? openForgot : openRegister}
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

  return function openOtp(email: string, type: VerifyType) {
    openModal({
      title: t("title"),
      size: "sm",
      content: <OTPScreen />,
      data: { email, type },
    });
  };
}
