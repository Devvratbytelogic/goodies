"use client";

import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import type { InferType } from "yup";
import { contactUsValidationSchema } from "@/validations";

type ContactFormValues = InferType<typeof contactUsValidationSchema>;
type ValidationMessageKey = "required" | "emailInvalid" | "phoneInvalid" | "invalidText" | "tooLong";

const initialValues: ContactFormValues = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  message: "",
};

const fieldClassName =
  "mt-2 h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition-colors focus:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-primary";

const labelClassName = "block text-[13px] font-semibold text-heading";

function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-primary">
      {" *"}
    </span>
  );
}

export default function ContactForm() {
  const t = useTranslations("ContactUsPage");

  const formik = useFormik<ContactFormValues>({
    initialValues,
    validationSchema: contactUsValidationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  function fieldError(name: keyof ContactFormValues) {
    const error = formik.touched[name] ? formik.errors[name] : undefined;
    return error ? t(error as ValidationMessageKey) : undefined;
  }

  return (
    <form
      noValidate
      onSubmit={formik.handleSubmit}
      className="relative overflow-hidden rounded-3xl bg-linear-to-b from-primary-soft/55 via-background to-surface px-4 py-5 ring-1 ring-black/5 sm:rounded-4xl sm:px-6 sm:py-7"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 inset-e-0 size-40 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative grid gap-4 sm:grid-cols-2 sm:gap-5">
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
            aria-describedby={fieldError("firstName") ? "firstName-error" : undefined}
            className={fieldClassName}
          />
          {fieldError("firstName") ? (
            <p id="firstName-error" className="mt-1.5 text-xs font-medium text-primary">
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
            aria-describedby={fieldError("lastName") ? "lastName-error" : undefined}
            className={fieldClassName}
          />
          {fieldError("lastName") ? (
            <p id="lastName-error" className="mt-1.5 text-xs font-medium text-primary">
              {fieldError("lastName")}
            </p>
          ) : null}
        </label>
        <label className={`${labelClassName} sm:col-span-2`}>
          {t("phoneNumber")}
          <RequiredMark />
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-invalid={Boolean(fieldError("phone"))}
            aria-describedby={fieldError("phone") ? "phone-error" : undefined}
            className={fieldClassName}
          />
          {fieldError("phone") ? (
            <p id="phone-error" className="mt-1.5 text-xs font-medium text-primary">
              {fieldError("phone")}
            </p>
          ) : null}
        </label>
        <label className={`${labelClassName} sm:col-span-2`}>
          {t("emailAddress")}
          <RequiredMark />
          <input
            name="email"
            type="email"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-invalid={Boolean(fieldError("email"))}
            aria-describedby={fieldError("email") ? "email-error" : undefined}
            className={fieldClassName}
          />
          {fieldError("email") ? (
            <p id="email-error" className="mt-1.5 text-xs font-medium text-primary">
              {fieldError("email")}
            </p>
          ) : null}
        </label>
        <label className={`${labelClassName} sm:col-span-2`}>
          {t("message")}
          <RequiredMark />
          <textarea
            name="message"
            rows={5}
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-invalid={Boolean(fieldError("message"))}
            aria-describedby={fieldError("message") ? "message-error" : undefined}
            className={`${fieldClassName} h-auto min-h-32 resize-y py-3`}
          />
          {fieldError("message") ? (
            <p id="message-error" className="mt-1.5 text-xs font-medium text-primary">
              {fieldError("message")}
            </p>
          ) : null}
        </label>
        <div className="sm:col-span-2 sm:pt-1">
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70"
            disabled={formik.isSubmitting}
          >
            {t("title")}
          </button>
        </div>
      </div>
    </form>
  );
}
