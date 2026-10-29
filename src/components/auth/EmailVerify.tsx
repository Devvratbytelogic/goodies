"use client";

import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { LuArrowRight, LuLoaderCircle, LuPencil } from "react-icons/lu";
import type { InferType } from "yup";
import { useAuth } from "@/components/auth/AuthProvider";
import { resendCode, sendEmailOtp, verifyCode } from "@/server/auth";
import { getDeviceId } from "@/utils/deviceId";
import { forgotValidationSchema, otpValidationSchema } from "@/validations";

type EmailValues = InferType<typeof forgotValidationSchema>;
type OtpValues = InferType<typeof otpValidationSchema>;
type MessageKey = "required" | "emailInvalid" | "invalid";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const emailInputClass =
  "h-12 w-full rounded-full border border-border bg-background pe-12 ps-4 text-sm outline-none focus:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-primary";

const otpInputClass =
  "h-12 w-full rounded-xl border border-border bg-background text-center text-base font-semibold outline-none focus:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-primary";

export default function EmailVerify({ onVerified }: { onVerified?: () => void }) {
  const t = useTranslations("EmailVerify");
  const { startSession } = useAuth();
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [resending, setResending] = useState(false);

  const emailForm = useFormik<EmailValues>({
    initialValues: { email: "" },
    validationSchema: forgotValidationSchema,
    onSubmit: async (values, helpers) => {
      setError("");
      const nextEmail = values.email.trim();

      try {
        const result = await sendEmailOtp(nextEmail, getDeviceId());
        if (!result.ok) {
          setError(result.message || t("sendFailed"));
          return;
        }
        setEmail(nextEmail);
        void otpForm.resetForm();
        setSecondsLeft(RESEND_SECONDS);
        setStep("otp");
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : t("sendFailed"));
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const otpForm = useFormik<OtpValues>({
    initialValues: { code: "" },
    validationSchema: otpValidationSchema,
    onSubmit: async (values, helpers) => {
      setError("");

      try {
        const result = await verifyCode(email, values.code, "login", getDeviceId());
        if (!result.ok || !result.data?.token) {
          setError(result.message || t("verifyFailed"));
          return;
        }
        startSession(result.data.token);
        onVerified?.();
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : t("verifyFailed"));
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (step !== "otp" || secondsLeft <= 0) return;
    const timer = window.setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearInterval(timer);
  }, [step, secondsLeft]);

  const emailError = emailForm.touched.email ? emailForm.errors.email : undefined;
  const otpError = otpForm.touched.code ? otpForm.errors.code : undefined;
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => otpForm.values.code[i] ?? "");

  function updateCode(nextDigits: string[]) {
    const code = nextDigits.join("");
    void otpForm.setFieldValue("code", code).then(() => {
      if (code.length === OTP_LENGTH) void otpForm.submitForm();
    });
  }

  function onOtpChange(index: number, value: string) {
    const cleaned = value.replace(/\D/g, "");

    if (cleaned.length > 1) {
      const nextDigits = Array.from({ length: OTP_LENGTH }, (_, digitIndex) => cleaned[digitIndex] ?? "");
      updateCode(nextDigits);
      otpRefs.current[Math.min(cleaned.length, OTP_LENGTH) - 1]?.focus();
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = cleaned;
    updateCode(nextDigits);

    if (cleaned && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  }

  async function resend() {
    if (secondsLeft > 0 || resending) return;
    setError("");
    setResending(true);

    try {
      const result = await resendCode(email, getDeviceId());
      if (!result.ok) {
        setError(result.message || t("sendFailed"));
        return;
      }
      void otpForm.resetForm();
      setSecondsLeft(RESEND_SECONDS);
      otpRefs.current[0]?.focus();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t("sendFailed"));
    } finally {
      setResending(false);
    }
  }

  if (step === "email") {
    return (
      <form noValidate onSubmit={emailForm.handleSubmit} className="grid gap-4 text-center">
        <div>
          <h2 className="text-base font-bold text-heading">{t("enterTitle")}</h2>
          <p className="mt-1 text-sm text-muted">{t("enterSubtitle")}</p>
        </div>
        <div className="w-full text-start">
          <div className="relative">
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              value={emailForm.values.email}
              onChange={emailForm.handleChange}
              onBlur={emailForm.handleBlur}
              aria-invalid={Boolean(emailError)}
              disabled={emailForm.isSubmitting}
              className={emailInputClass}
            />
            <button
              type="submit"
              disabled={emailForm.isSubmitting}
              aria-label={emailForm.isSubmitting ? t("sending") : t("continue")}
              className="absolute inset-e-1.5 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-70"
            >
              {emailForm.isSubmitting ? (
                <LuLoaderCircle aria-hidden className="size-4 animate-spin" />
              ) : (
                <LuArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
              )}
            </button>
          </div>
          {emailError ? <p className="mt-1.5 text-xs text-primary">{t(emailError as MessageKey)}</p> : null}
        </div>
        {error ? (
          <p role="alert" className="text-sm text-primary">
            {error}
          </p>
        ) : null}
      </form>
    );
  }

  return (
    <form noValidate onSubmit={otpForm.handleSubmit} className="mt-2 grid justify-items-center gap-5 text-center">
      <div>
        <h2 className="text-sm font-bold text-heading">{t("verifyTitle")}</h2>
        <p className="flex flex-wrap items-center justify-center gap-1.5 text-sm text-heading">
          <span>
            {t("otpSent")} <span className="font-semibold">{email}</span>
          </span>
          <button
            type="button"
            aria-label={t("editEmail")}
            onClick={() => {
              setStep("email");
              void otpForm.resetForm();
              setError("");
              setSecondsLeft(0);
            }}
            className="inline-flex size-7 items-center justify-center rounded-md border border-primary text-primary hover:bg-primary-soft"
          >
            <LuPencil aria-hidden className="size-3.5" />
          </button>
        </p>
      </div>

      <div className="grid w-[70%] grid-cols-6 gap-2" role="group" aria-label={t("otpLabel")}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(node) => {
              otpRefs.current[index] = node;
            }}
            value={digit}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            disabled={otpForm.isSubmitting}
            aria-invalid={Boolean(otpError)}
            aria-label={`${t("otpLabel")} ${index + 1}`}
            onChange={(event) => onOtpChange(index, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Backspace" && !digit && index > 0) otpRefs.current[index - 1]?.focus();
            }}
            className={otpInputClass}
          />
        ))}
      </div>

      {otpError ? <p className="text-xs text-primary">{t(otpError as MessageKey)}</p> : null}
      {error ? (
        <p role="alert" className="text-sm text-primary">
          {error}
        </p>
      ) : null}

      <p className="text-sm font-medium text-primary">
        {secondsLeft > 0 ? (
          t("resendIn", { seconds: secondsLeft })
        ) : (
          <button type="button" onClick={resend} disabled={resending} className="hover:text-primary-hover disabled:opacity-70">
            {resending ? t("resending") : t("resend")}
          </button>
        )}
      </p>

      <label className="flex cursor-not-allowed items-center gap-2 text-xs text-heading">
        <input type="checkbox" checked disabled className="size-3 accent-primary" />
        {t("keepLoggedIn")}
      </label>
    </form>
  );
}
