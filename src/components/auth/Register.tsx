"use client";

import { useState } from "react";
import Country from "country-state-city/lib/country";
import State from "country-state-city/lib/state";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { LuEye, LuEyeOff } from "react-icons/lu";
import type { InferType } from "yup";
import PhoneField from "@/components/auth/PhoneField";
import RegisterLocation from "@/components/auth/RegisterLocation";
import { useOpenLogin } from "@/components/auth/Login";
import { useOpenOtp } from "@/components/auth/OTPScreen";
import { RequiredMark } from "@/components/form/RequiredMark";
import { useModal } from "@/components/layout/common/ModalProvider";
import { registerAccount } from "@/server/auth";
import { registerValidationSchema } from "@/validations";

type RegisterValues = InferType<typeof registerValidationSchema>;
type ValidationMessageKey =
  | "required"
  | "emailInvalid"
  | "phoneInvalid"
  | "invalidText"
  | "tooLong"
  | "tooShort"
  | "lowercase"
  | "uppercase"
  | "number"
  | "special"
  | "passwordMismatch";

const fieldClassName =
  "h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm font-normal text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-primary focus:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-primary";

const labelClassName = "block text-[13px] font-semibold text-heading";

const initialValues: RegisterValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "AE",
  state: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const t = useTranslations("Register");
  const openLogin = useOpenLogin();
  const openOtp = useOpenOtp();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("971");
  const formik = useFormik<RegisterValues>({
    initialValues,
    validationSchema: registerValidationSchema,
    onSubmit: async (values, helpers) => {
      setError("");

      try {
        const countryCode = values.country ?? "";
        const stateCode = values.state ?? "";
        const result = await registerAccount({
          name: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          phoneCountryCode,
          password: values.password,
          country: Country.getCountryByCode(countryCode)?.name ?? "",
          countryCode,
          state: State.getStatesOfCountry(countryCode).find((item) => item.isoCode === stateCode)?.name ?? "",
          stateCode,
        });
        if (!result.ok) {
          setError(result.message || t("failed"));
          return;
        }
        openOtp(values.email.trim(), "account");
      } catch (caught) {
        setError(caught instanceof Error && caught.message ? caught.message : t("failed"));
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  function fieldError(name: keyof RegisterValues) {
    const error = formik.touched[name] ? formik.errors[name] : undefined;
    return error ? t(error as ValidationMessageKey) : undefined;
  }

  return (
    <form noValidate onSubmit={formik.handleSubmit} className="grid gap-3">
      <p className="-mt-1 text-sm leading-relaxed text-muted">{t("subtitle")}</p>
      <div className="grid grid-cols-2 gap-3">
        <label className={labelClassName}>
          {t("firstName")}
          <RequiredMark />
          <input
            name="firstName"
            type="text"
            autoComplete="given-name"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-invalid={Boolean(fieldError("firstName"))}
            aria-describedby={fieldError("firstName") ? "register-first-name-error" : undefined}
            className={`${fieldClassName} mt-1`}
          />
          {fieldError("firstName") ? (
            <p id="register-first-name-error" className="mt-1.5 text-xs font-normal text-primary">
              {fieldError("firstName")}
            </p>
          ) : null}
        </label>
        <label className={labelClassName}>
          {t("lastName")}
          <RequiredMark />
          <input
            name="lastName"
            type="text"
            autoComplete="family-name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-invalid={Boolean(fieldError("lastName"))}
            aria-describedby={fieldError("lastName") ? "register-last-name-error" : undefined}
            className={`${fieldClassName} mt-1`}
          />
          {fieldError("lastName") ? (
            <p id="register-last-name-error" className="mt-1.5 text-xs font-normal text-primary">
              {fieldError("lastName")}
            </p>
          ) : null}
        </label>
      </div>
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
          aria-describedby={fieldError("email") ? "register-email-error" : undefined}
          className={`${fieldClassName} mt-1`}
        />
        {fieldError("email") ? (
          <p id="register-email-error" className="mt-1.5 text-xs font-normal text-primary">
            {fieldError("email")}
          </p>
        ) : null}
      </label>
      <label className={labelClassName}>
        {t("phone")}
        <RequiredMark />
        <PhoneField
          value={formik.values.phone}
          invalid={Boolean(fieldError("phone"))}
          describedBy={fieldError("phone") ? "register-phone-error" : undefined}
          searchPlaceholder={t("searchCountry")}
          onChange={(value, dialCode) => {
            void formik.setFieldValue("phone", value);
            setPhoneCountryCode(dialCode);
          }}
          onBlur={() => {
            void formik.setFieldTouched("phone", true);
          }}
        />
        {fieldError("phone") ? (
          <p id="register-phone-error" className="mt-1.5 text-xs font-normal text-primary">
            {fieldError("phone")}
          </p>
        ) : null}
      </label>
      <RegisterLocation
        country={formik.values.country ?? ""}
        state={formik.values.state ?? ""}
        countryLabel={t("country")}
        stateLabel={t("state")}
        countryError={fieldError("country")}
        stateError={fieldError("state")}
        labelClassName={labelClassName}
        onCountryChange={(country) => {
          void formik.setFieldValue("country", country);
          void formik.setFieldValue("state", "");
        }}
        onStateChange={(state) => {
          void formik.setFieldValue("state", state);
        }}
        onCountryBlur={() => {
          void formik.setFieldTouched("country", true);
        }}
        onStateBlur={() => {
          void formik.setFieldTouched("state", true);
        }}
      />
      <div className="grid grid-cols-2 gap-3">
        <label className={labelClassName}>
          {t("password")}
          <RequiredMark />
          <span className="relative mt-1 block">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(fieldError("password"))}
              aria-describedby={fieldError("password") ? "register-password-error" : undefined}
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
            <p id="register-password-error" className="mt-1.5 text-xs font-normal text-primary">
              {fieldError("password")}
            </p>
          ) : null}
        </label>
        <label className={labelClassName}>
          {t("confirmPassword")}
          <RequiredMark />
          <span className="relative mt-1 block">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(fieldError("confirmPassword"))}
              aria-describedby={fieldError("confirmPassword") ? "register-confirm-password-error" : undefined}
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
            <p id="register-confirm-password-error" className="mt-1.5 text-xs font-normal text-primary">
              {fieldError("confirmPassword")}
            </p>
          ) : null}
        </label>
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
        {t("haveAccount")}{" "}
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

export function useOpenRegister() {
  const { openModal } = useModal();
  const t = useTranslations("Register");

  return function openRegister() {
    openModal({
      title: t("title"),
      size: "md",
      content: <Register />,
    });
  };
}
