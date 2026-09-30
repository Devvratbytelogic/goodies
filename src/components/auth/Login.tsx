"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { LuEye, LuEyeOff } from "react-icons/lu";
import type { InferType } from "yup";
import { useAuth } from "@/components/auth/AuthProvider";
import { RequiredMark } from "@/components/form/RequiredMark";
import { useOpenForgot } from "@/components/auth/Forgot";
import { useOpenRegister } from "@/components/auth/Register";
import { useModal } from "@/components/layout/common/ModalProvider";
import { useRouter } from "@/i18n/navigation";
import { getAccountRoutePath } from "@/utils/routes";
import { loginValidationSchema } from "@/validations";

type LoginValues = InferType<typeof loginValidationSchema>;
type ValidationMessageKey = "required" | "emailInvalid" | "tooShort" | "lowercase" | "uppercase" | "number" | "special";

const initialValues: LoginValues = {
  email: "",
  password: "",
};

const fieldClassName =
  "h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm font-normal text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-primary focus:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-primary";

const labelClassName = "block text-[13px] font-semibold text-heading";

export default function Login() {
  const t = useTranslations("Login");
  const { closeModal } = useModal();
  const { login } = useAuth();
  const router = useRouter();
  const openRegister = useOpenRegister();
  const openForgot = useOpenForgot();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const formik = useFormik<LoginValues>({
    initialValues,
    validationSchema: loginValidationSchema,
    onSubmit: async (values, helpers) => {
      setError("");

      try {
        await login(values.email.trim(), values.password);
        closeModal();
        router.push(getAccountRoutePath());
      } catch (caught) {
        setError(caught instanceof Error && caught.message ? caught.message : t("failed"));
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  function fieldError(name: keyof LoginValues) {
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
          aria-describedby={fieldError("email") ? "login-email-error" : undefined}
          className={`${fieldClassName} mt-1`}
        />
        {fieldError("email") ? (
          <p id="login-email-error" className="mt-1.5 text-xs font-normal text-primary">
            {fieldError("email")}
          </p>
        ) : null}
      </label>
      <label className={labelClassName}>
        {t("password")}
        <RequiredMark />
        <span className="relative mt-1 block">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-invalid={Boolean(fieldError("password"))}
            aria-describedby={fieldError("password") ? "login-password-error" : undefined}
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
          <p id="login-password-error" className="mt-1.5 text-xs font-normal text-primary">
            {fieldError("password")}
          </p>
        ) : null}
      </label>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openForgot}
          className="text-sm text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t("forgot")}
        </button>
      </div>
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
        {t("newHere")}{" "}
        <button
          type="button"
          onClick={openRegister}
          className="text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t("signup")}
        </button>
      </p>
    </form>
  );
}

export function useOpenLogin() {
  const { openModal } = useModal();
  const t = useTranslations("Login");

  return function openLogin() {
    openModal({
      title: t("title"),
      size: "sm",
      content: <Login />,
    });
  };
}
