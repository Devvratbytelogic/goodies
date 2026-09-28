"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FocusEvent } from "react";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { LuCamera, LuEye, LuEyeOff, LuX } from "react-icons/lu";
import type { InferType } from "yup";
import { ProfileAvatar } from "@/components/account/AccountProfileSummary";
import { useAccountProfile } from "@/components/account/AccountProfileProvider";
import { changePasswordValidationSchema, profileValidationSchema } from "@/validations";

type ProfileValues = InferType<typeof profileValidationSchema>;
type PasswordValues = InferType<typeof changePasswordValidationSchema>;
type ProfileMessageKey = "required" | "emailInvalid" | "phoneInvalid" | "invalidText" | "tooLong";
type PasswordMessageKey = "required" | "tooShort" | "lowercase" | "uppercase" | "number" | "special" | "passwordMismatch" | "currentInvalid";

const maxPhotoBytes = 2 * 1024 * 1024;

const fieldClassName =
  "h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm font-normal text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-primary focus:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-primary";

const labelClassName = "block text-[13px] font-semibold text-heading";

export default function ProfileForm() {
  const t = useTranslations("AccountPage");
  const { profile, password, updateProfile, changePassword } = useAccountProfile();
  const fileInput = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState(profile.photo);
  const [photoError, setPhotoError] = useState<string>();
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const profileForm = useFormik<ProfileValues>({
    initialValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone,
    },
    enableReinitialize: true,
    validationSchema: profileValidationSchema,
    onSubmit: (values) => {
      updateProfile({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        photo,
      });
      setProfileSaved(true);
    },
  });

  const passwordForm = useFormik<PasswordValues>({
    initialValues: { currentPassword: "", password: "", confirmPassword: "" },
    validationSchema: changePasswordValidationSchema,
    onSubmit: (values, helpers) => {
      if (values.currentPassword !== password) {
        helpers.setFieldError("currentPassword", "currentInvalid");
        return;
      }

      changePassword(values.password);
      helpers.resetForm();
      setPasswordSaved(true);
    },
  });

  useEffect(() => {
    return () => {
      if (photo && photo.startsWith("blob:") && photo !== profile.photo) {
        URL.revokeObjectURL(photo);
      }
    };
  }, [photo, profile.photo]);

  function profileError(name: keyof ProfileValues) {
    const error = profileForm.touched[name] ? profileForm.errors[name] : undefined;
    return error ? t(error as ProfileMessageKey) : undefined;
  }

  function passwordError(name: keyof PasswordValues) {
    const error = passwordForm.touched[name] ? passwordForm.errors[name] : undefined;
    return error ? t(error as PasswordMessageKey) : undefined;
  }

  function onPhotoChange(file: File | undefined) {
    setProfileSaved(false);

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/") || file.size > maxPhotoBytes) {
      setPhotoError(t("photoTooLarge"));
      return;
    }

    setPhotoError(undefined);
    setPhoto((current) => {
      if (current && current.startsWith("blob:") && current !== profile.photo) {
        URL.revokeObjectURL(current);
      }

      return URL.createObjectURL(file);
    });
  }

  const initials = `${profileForm.values.firstName[0] ?? ""}${profileForm.values.lastName[0] ?? ""}`;

  return (
    <div className="grid gap-6">
      <form noValidate onSubmit={profileForm.handleSubmit} className="rounded-2xl border border-border bg-background px-5 py-5">
        <h2 className="text-lg font-bold text-heading">{t("profile")}</h2>
        <p className="mt-1 text-sm text-muted">{t("profileIntro")}</p>
        <div className="group relative mt-5 size-24">
          <ProfileAvatar photo={photo} initials={initials} size="lg" />
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => {
              onPhotoChange(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <button
            type="button"
            aria-label={t("changePhoto")}
            onClick={() => fileInput.current?.click()}
            className="absolute inset-0 z-10 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span aria-hidden className="absolute inset-0 rounded-full bg-heading/40 opacity-0 transition-opacity group-hover:opacity-100" />
            <span className="absolute -end-1 -bottom-1 flex size-8 items-center justify-center rounded-full border-2 border-background bg-background text-primary shadow-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <LuCamera aria-hidden className="size-4" />
            </span>
          </button>
          {photo ? (
            <button
              type="button"
              aria-label={t("removePhoto")}
              onClick={() => {
                setPhoto(null);
                setPhotoError(undefined);
                setProfileSaved(false);
              }}
              className="absolute -end-1 -top-1 z-20 flex size-7 items-center justify-center rounded-full border-2 border-background bg-background text-heading shadow-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <LuX aria-hidden className="size-3.5" />
            </button>
          ) : null}
        </div>
        {photoError ? <p className="mt-2 text-xs text-primary">{photoError}</p> : null}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className={labelClassName}>
            {t("firstName")}
            <input
              name="firstName"
              autoComplete="given-name"
              value={profileForm.values.firstName}
              onChange={(event) => {
                setProfileSaved(false);
                profileForm.handleChange(event);
              }}
              onBlur={profileForm.handleBlur}
              aria-invalid={Boolean(profileError("firstName"))}
              className={`${fieldClassName} mt-1`}
            />
            {profileError("firstName") ? <p className="mt-1.5 text-xs font-normal text-primary">{profileError("firstName")}</p> : null}
          </label>
          <label className={labelClassName}>
            {t("lastName")}
            <input
              name="lastName"
              autoComplete="family-name"
              value={profileForm.values.lastName}
              onChange={(event) => {
                setProfileSaved(false);
                profileForm.handleChange(event);
              }}
              onBlur={profileForm.handleBlur}
              aria-invalid={Boolean(profileError("lastName"))}
              className={`${fieldClassName} mt-1`}
            />
            {profileError("lastName") ? <p className="mt-1.5 text-xs font-normal text-primary">{profileError("lastName")}</p> : null}
          </label>
          <label className={labelClassName}>
            {t("email")}
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={profile.email}
              readOnly
              aria-readonly="true"
              className={`${fieldClassName} mt-1 cursor-default text-muted`}
            />
          </label>
          <label className={labelClassName}>
            {t("phone")}
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              dir="ltr"
              value={profile.phone}
              readOnly
              aria-readonly="true"
              className={`${fieldClassName} mt-1 cursor-default text-muted`}
            />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("save")}
          </button>
          {profileSaved ? (
            <p role="status" className="text-sm font-medium text-accent-deep">
              {t("profileSaved")}
            </p>
          ) : null}
        </div>
      </form>

      <form noValidate onSubmit={passwordForm.handleSubmit} className="rounded-2xl border border-border bg-background px-5 py-5">
        <h2 className="text-lg font-bold text-heading">{t("changePassword")}</h2>
        <p className="mt-1 text-sm text-muted">{t("samplePassword", { password })}</p>
        <div className="mt-5 grid gap-4">
          <PasswordField
            label={t("currentPassword")}
            name="currentPassword"
            autoComplete="current-password"
            shown={showCurrent}
            onToggle={() => setShowCurrent((current) => !current)}
            showLabel={t("showPassword")}
            hideLabel={t("hidePassword")}
            value={passwordForm.values.currentPassword}
            error={passwordError("currentPassword")}
            onChange={(event) => {
              setPasswordSaved(false);
              passwordForm.handleChange(event);
            }}
            onBlur={passwordForm.handleBlur}
          />
          <PasswordField
            label={t("newPassword")}
            name="password"
            autoComplete="new-password"
            shown={showPassword}
            onToggle={() => setShowPassword((current) => !current)}
            showLabel={t("showPassword")}
            hideLabel={t("hidePassword")}
            value={passwordForm.values.password}
            error={passwordError("password")}
            onChange={(event) => {
              setPasswordSaved(false);
              passwordForm.handleChange(event);
            }}
            onBlur={passwordForm.handleBlur}
          />
          <PasswordField
            label={t("confirmPassword")}
            name="confirmPassword"
            autoComplete="new-password"
            shown={showConfirm}
            onToggle={() => setShowConfirm((current) => !current)}
            showLabel={t("showPassword")}
            hideLabel={t("hidePassword")}
            value={passwordForm.values.confirmPassword}
            error={passwordError("confirmPassword")}
            onChange={(event) => {
              setPasswordSaved(false);
              passwordForm.handleChange(event);
            }}
            onBlur={passwordForm.handleBlur}
          />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("updatePassword")}
          </button>
          {passwordSaved ? (
            <p role="status" className="text-sm font-medium text-accent-deep">
              {t("passwordSaved")}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}

function PasswordField({
  label,
  name,
  autoComplete,
  shown,
  onToggle,
  showLabel,
  hideLabel,
  value,
  error,
  onChange,
  onBlur,
}: {
  label: string;
  name: string;
  autoComplete: string;
  shown: boolean;
  onToggle: () => void;
  showLabel: string;
  hideLabel: string;
  value: string;
  error?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className={labelClassName}>
      {label}
      <span className="relative mt-1 block">
        <input
          name={name}
          type={shown ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          className={`${fieldClassName} pe-12`}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={shown ? hideLabel : showLabel}
          aria-pressed={shown}
          className="absolute inset-e-1.5 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {shown ? <LuEyeOff aria-hidden className="size-4" /> : <LuEye aria-hidden className="size-4" />}
        </button>
      </span>
      {error ? <p className="mt-1.5 text-xs font-normal text-primary">{error}</p> : null}
    </label>
  );
}
