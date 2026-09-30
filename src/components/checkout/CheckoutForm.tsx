"use client";

import { useMemo, useState } from "react";
import Country from "country-state-city/lib/country";
import State from "country-state-city/lib/state";
import { useFormik } from "formik";
import { useLocale, useTranslations } from "next-intl";
import Select, { type StylesConfig } from "react-select";
import type { InferType } from "yup";
import { RequiredMark } from "@/components/form/RequiredMark";
import { sampleAddresses } from "@/data/sampleAddresses";
import { Link } from "@/i18n/navigation";
import { checkoutValidationSchema } from "@/validations";

type SelectOption = { value: string; label: string };

function selectStyles(invalid: boolean): StylesConfig<SelectOption, false> {
  return {
    control: (base, state) => ({
      ...base,
      minHeight: 44,
      height: 44,
      marginTop: 6,
      borderRadius: 6,
      borderColor: invalid ? "var(--primary)" : "var(--border)",
      boxShadow: "none",
      // outline: state.isFocused || state.menuIsOpen ? "2px solid var(--primary)" : "none",
      outlineOffset: "2px",
      backgroundColor: "var(--background)",
      fontSize: 14,
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      opacity: state.isDisabled ? 0.7 : 1,
      "&:hover": {
        borderColor: invalid ? "var(--primary)" : "var(--border)",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 14px",
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      color: "var(--foreground)",
      outline: "none",
      boxShadow: "none",
    }),
    singleValue: (base) => ({
      ...base,
      color: "var(--foreground)",
    }),
    placeholder: (base) => ({
      ...base,
      color: "var(--muted)",
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: "var(--muted)",
      paddingInlineEnd: 12,
      transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : undefined,
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 6,
      border: "1px solid var(--border)",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      zIndex: 30,
    }),
    menuList: (base) => ({
      ...base,
      padding: 4,
    }),
    option: (base, state) => ({
      ...base,
      borderRadius: 4,
      fontSize: 14,
      cursor: "pointer",
      backgroundColor: state.isSelected ? "var(--primary)" : state.isFocused ? "var(--primary-soft)" : "transparent",
      color: state.isSelected ? "var(--primary-foreground)" : "var(--foreground)",
    }),
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: 14,
      color: "var(--muted)",
    }),
  };
}

type CheckoutFormValues = InferType<ReturnType<typeof checkoutValidationSchema>>;
type ValidationMessageKey = "required" | "emailInvalid" | "phoneInvalid" | "invalidText" | "tooLong";
type SavedAddress = CheckoutFormValues & { id: string };
type AddressEditor = { mode: "add" } | { mode: "edit"; id: string };

const sampleOrderNumber = "GD-1042";

const initialValues: CheckoutFormValues = {
  firstName: "",
  lastName: "",
  country: "AE",
  state: "",
  city: "",
  address: "",
  phone: "",
  email: "",
};

const fieldClassName =
  "mt-1.5 h-11 w-full rounded-md border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-primary";

const labelClassName = "block text-sm font-bold text-heading";

function addressLocation(address: SavedAddress) {
  const countryName = Country.getCountryByCode(address.country)?.name;
  const stateName = State.getStatesOfCountry(address.country).find((state) => state.isoCode === address.state)?.name;
  return [address.city, stateName, countryName].filter(Boolean).join(", ");
}

function toFormValues(address: SavedAddress): CheckoutFormValues {
  return {
    firstName: address.firstName,
    lastName: address.lastName,
    country: address.country,
    state: address.state ?? "",
    city: address.city,
    address: address.address,
    phone: address.phone,
    email: address.email,
  };
}

export default function CheckoutForm({ shopHref }: { shopHref: string }) {
  const t = useTranslations("CheckoutClassicPage");
  const locale = useLocale();
  const [placed, setPlaced] = useState(false);
  const [addresses, setAddresses] = useState<SavedAddress[]>(() => sampleAddresses.map((address) => ({ ...address })));
  const [selectedId, setSelectedId] = useState<string>(sampleAddresses[0].id);
  const [editor, setEditor] = useState<AddressEditor | null>(null);

  const validationSchema = useMemo(() => checkoutValidationSchema((countryCode) => State.getStatesOfCountry(countryCode)), []);

  const formik = useFormik<CheckoutFormValues>({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (!editor) {
        return;
      }

      const next = { ...values, state: values.state ?? "" };

      if (editor.mode === "add") {
        const id = crypto.randomUUID();
        setAddresses((current) => [...current, { id, ...next }]);
        setSelectedId(id);
      } else {
        setAddresses((current) => current.map((item) => (item.id === editor.id ? { ...item, ...next } : item)));
        setSelectedId(editor.id);
      }

      setEditor(null);
    },
  });

  const countryOptions = useMemo<SelectOption[]>(
    () =>
      Country.getAllCountries()
        .slice()
        .sort((left, right) => left.name.localeCompare(right.name))
        .map((country) => ({ value: country.isoCode, label: country.name })),
    [],
  );
  const stateOptions = useMemo<SelectOption[]>(
    () => State.getStatesOfCountry(formik.values.country).map((state) => ({ value: state.isoCode, label: state.name })),
    [formik.values.country],
  );
  const countryValue = countryOptions.find((option) => option.value === formik.values.country) ?? null;
  const stateValue = stateOptions.find((option) => option.value === formik.values.state) ?? null;

  function fieldError(name: keyof CheckoutFormValues) {
    const error = formik.touched[name] ? formik.errors[name] : undefined;
    return error ? t(error as ValidationMessageKey) : undefined;
  }

  function onCountryChange(option: SelectOption | null) {
    void formik.setFieldValue("country", option?.value ?? "");
    void formik.setFieldValue("state", "");
    void formik.setFieldTouched("state", false, false);
  }

  function openAdd() {
    formik.resetForm({ values: initialValues });
    setEditor({ mode: "add" });
  }

  function openEdit(address: SavedAddress) {
    formik.resetForm({ values: toFormValues(address) });
    setSelectedId(address.id);
    setEditor({ mode: "edit", id: address.id });
  }

  if (placed) {
    return (
      <section className="rounded-2xl border border-border bg-background px-5 py-8 sm:px-8">
        <h2 className="text-2xl font-bold">{t("received")}</h2>
        <p className="mt-2 max-w-md text-sm text-muted">{t("receivedNote")}</p>
        <p className="mt-5 text-sm">
          <span className="text-muted">{t("orderNumber")}</span>{" "}
          <span className="font-bold text-primary">{sampleOrderNumber}</span>
        </p>
        <Link
          href={shopHref}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t("shop")}
        </Link>
      </section>
    );
  }

  if (!editor) {
    return (
      <section className="rounded-2xl border border-border bg-background px-5 py-5 sm:px-6 sm:py-6">
        <h2 className="text-base font-bold">{t("savedAddresses")}</h2>
        {addresses.length === 0 ? <p className="mt-4 text-sm text-muted">{t("emptyAddresses")}</p> : null}
        <div className="mt-4 grid gap-3" role="radiogroup" aria-label={t("savedAddresses")}>
          {addresses.map((address) => {
            const selected = address.id === selectedId;

            return (
              <div key={address.id} className={`rounded-xl border p-4 ${selected ? "border-primary bg-primary-soft" : "border-border"}`}>
                <div className="flex items-start gap-3">
                  <label className="flex min-w-0 flex-1 cursor-pointer gap-3">
                    <input
                      type="radio"
                      name="saved-address"
                      value={address.id}
                      checked={selected}
                      onChange={() => setSelectedId(address.id)}
                      className="mt-1 size-4 accent-primary"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-heading">
                        {address.firstName} {address.lastName}
                      </span>
                      <span className="mt-1 block text-sm text-muted">{address.address}</span>
                      <span className="mt-0.5 block text-sm text-muted">{addressLocation(address)}</span>
                      <span className="mt-1 block text-sm text-muted">{address.phone}</span>
                      <span className="block text-sm text-muted">{address.email}</span>
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => openEdit(address)}
                    className="shrink-0 text-sm font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {t("edit")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="mt-4 inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-semibold text-heading transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t("addNew")}
        </button>
        <button
          type="button"
          onClick={() => setPlaced(true)}
          disabled={!selectedId}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70"
        >
          {t("placeOrder")}
        </button>
      </section>
    );
  }

  return (
    <form noValidate onSubmit={formik.handleSubmit} className="rounded-2xl border border-border bg-background px-5 py-5 sm:px-6 sm:py-6">
      <h2 className="text-base font-bold">{editor.mode === "edit" ? t("editAddress") : t("addNew")}</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
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
            aria-describedby={fieldError("firstName") ? "checkout-firstName-error" : undefined}
            className={fieldClassName}
          />
          {fieldError("firstName") ? (
            <p id="checkout-firstName-error" className="mt-1.5 text-xs font-medium text-primary">
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
            aria-describedby={fieldError("lastName") ? "checkout-lastName-error" : undefined}
            className={fieldClassName}
          />
          {fieldError("lastName") ? (
            <p id="checkout-lastName-error" className="mt-1.5 text-xs font-medium text-primary">
              {fieldError("lastName")}
            </p>
          ) : null}
        </label>
        <div>
          <label htmlFor="checkout-country" className={labelClassName}>
            {t("country")}
            <RequiredMark />
          </label>
          <Select<SelectOption, false>
            instanceId="checkout-country"
            inputId="checkout-country"
            name="country"
            options={countryOptions}
            value={countryValue}
            onChange={onCountryChange}
            onBlur={() => void formik.setFieldTouched("country", true)}
            isRtl={locale === "ar"}
            isSearchable
            styles={selectStyles(Boolean(fieldError("country")))}
            aria-invalid={Boolean(fieldError("country"))}
            aria-errormessage={fieldError("country") ? "checkout-country-error" : undefined}
            noOptionsMessage={() => t("noOptions")}
          />
          {fieldError("country") ? (
            <p id="checkout-country-error" className="mt-1.5 text-xs font-medium text-primary">
              {fieldError("country")}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="checkout-state" className={labelClassName}>
            {t("state")}
            {stateOptions.length > 0 ? <RequiredMark /> : null}
          </label>
          <Select<SelectOption, false>
            instanceId="checkout-state"
            inputId="checkout-state"
            name="state"
            options={stateOptions}
            value={stateValue}
            onChange={(option) => void formik.setFieldValue("state", option?.value ?? "")}
            onBlur={() => void formik.setFieldTouched("state", true)}
            isDisabled={stateOptions.length === 0}
            isRtl={locale === "ar"}
            isSearchable
            placeholder={t("statePlaceholder")}
            styles={selectStyles(Boolean(fieldError("state")))}
            aria-invalid={Boolean(fieldError("state"))}
            aria-errormessage={fieldError("state") ? "checkout-state-error" : undefined}
            noOptionsMessage={() => t("noOptions")}
          />
          {fieldError("state") ? (
            <p id="checkout-state-error" className="mt-1.5 text-xs font-medium text-primary">
              {fieldError("state")}
            </p>
          ) : null}
        </div>
        <label className={`${labelClassName} sm:col-span-2`}>
          {t("city")}
          <RequiredMark />
          <input
            name="city"
            type="text"
            autoComplete="address-level2"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-invalid={Boolean(fieldError("city"))}
            aria-describedby={fieldError("city") ? "checkout-city-error" : undefined}
            className={fieldClassName}
          />
          {fieldError("city") ? (
            <p id="checkout-city-error" className="mt-1.5 text-xs font-medium text-primary">
              {fieldError("city")}
            </p>
          ) : null}
        </label>
        <label className={`${labelClassName} sm:col-span-2`}>
          {t("address")}
          <RequiredMark />
          <input
            name="address"
            type="text"
            autoComplete="street-address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-invalid={Boolean(fieldError("address"))}
            aria-describedby={fieldError("address") ? "checkout-address-error" : undefined}
            className={fieldClassName}
          />
          {fieldError("address") ? (
            <p id="checkout-address-error" className="mt-1.5 text-xs font-medium text-primary">
              {fieldError("address")}
            </p>
          ) : null}
        </label>
        <label className={`${labelClassName} sm:col-span-2`}>
          {t("phone")}
          <RequiredMark />
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-invalid={Boolean(fieldError("phone"))}
            aria-describedby={fieldError("phone") ? "checkout-phone-error" : undefined}
            className={fieldClassName}
          />
          {fieldError("phone") ? (
            <p id="checkout-phone-error" className="mt-1.5 text-xs font-medium text-primary">
              {fieldError("phone")}
            </p>
          ) : null}
        </label>
        <label className={`${labelClassName} sm:col-span-2`}>
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
            aria-describedby={fieldError("email") ? "checkout-email-error" : undefined}
            className={fieldClassName}
          />
          {fieldError("email") ? (
            <p id="checkout-email-error" className="mt-1.5 text-xs font-medium text-primary">
              {fieldError("email")}
            </p>
          ) : null}
        </label>
      </div>

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70"
      >
        {t("saveAddress")}
      </button>
      <button
        type="button"
        onClick={() => setEditor(null)}
        className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border border-border text-sm font-semibold text-heading transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t("cancel")}
      </button>
    </form>
  );
}
