"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { LuSend } from "react-icons/lu";
import { useSubscribeMutation } from "@/store/endpoints/userApi";
import { newsletterValidationSchema } from "@/validations";

type NewsletterMessageKey = "required" | "emailInvalid";

export default function NewsletterForm({ country }: { country: string }) {
  const t = useTranslations("Footer");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [subscribe, { isLoading }] = useSubscribeMutation();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let value = "";
    try {
      ({ email: value } = await newsletterValidationSchema.validate({ email }));
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "";
      if (message === "required" || message === "emailInvalid") setError(t(message as NewsletterMessageKey));
      return;
    }
    setError("");
    try {
      const result = await subscribe({ email: value, country }).unwrap();
      if (result?.success === false) return;
      setEmail("");
    } catch {
      // The API layer already shows the error toast.
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full sm:max-w-md">
      <div className="relative sm:flex sm:gap-2">
        <label htmlFor="footer-newsletter-email" className="sr-only">
          {t("emailPlaceholder")}
        </label>
        <input
          id="footer-newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          placeholder={t("emailPlaceholder")}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "footer-newsletter-error" : undefined}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError("");
          }}
          className="h-12 w-full rounded-full border border-border/70 bg-surface ps-4 pe-14 text-base text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary-soft aria-invalid:border-primary sm:h-11 sm:min-w-0 sm:flex-1 sm:px-4 sm:text-sm"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute inset-e-1.5 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 sm:static sm:h-11 sm:w-auto sm:shrink-0 sm:translate-y-0 sm:px-5"
        >
          <LuSend aria-hidden className="size-4 rtl:-scale-x-100 sm:hidden" />
          <span className="sr-only sm:not-sr-only sm:text-sm sm:font-semibold">
            {isLoading ? t("subscribing") : t("subscribe")}
          </span>
        </button>
      </div>
      {error ? (
        <p id="footer-newsletter-error" className="mt-1.5 px-4 text-xs font-medium text-primary">
          {error}
        </p>
      ) : null}
    </form>
  );
}
