"use client";

import { useMemo, useState } from "react";
import Country from "country-state-city/lib/country";
import State from "country-state-city/lib/state";
import { useFormik } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import Select, { type StylesConfig } from "react-select";
import type { InferType } from "yup";
import PhoneField from "@/components/auth/PhoneField";
import DeleteAddressConfirm from "@/components/checkout/DeleteAddressConfirm";
import { RequiredMark } from "@/components/form/RequiredMark";
import { useModal } from "@/components/layout/common/ModalProvider";
import { useAddAddressMutation, useGetAddressesQuery, useUpdateAddressMutation } from "@/store/endpoints/addressApi";
import type { AddressEntity } from "@/server/types/address";
import { checkoutValidationSchema } from "@/validations";

type SelectOption = { value: string; label: string };
type AddressValues = InferType<ReturnType<typeof checkoutValidationSchema>>;
type ValidationMessageKey = "required" | "emailInvalid" | "phoneInvalid" | "invalidText" | "tooLong";

const initialValues: AddressValues = {
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
  "mt-1.5 h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm font-normal text-foreground outline-none transition-colors focus:border-primary focus:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-primary";

const labelClassName = "block text-[13px] font-semibold text-heading";

function selectStyles(invalid: boolean): StylesConfig<SelectOption, false> {
  return {
    control: (base, state) => ({
      ...base,
      minHeight: 48,
      height: 48,
      marginTop: 6,
      borderRadius: 12,
      borderColor: invalid ? "var(--primary)" : "var(--border)",
      boxShadow: "none",
      outlineOffset: "2px",
      backgroundColor: "var(--surface)",
      fontSize: 14,
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      opacity: state.isDisabled ? 0.7 : 1,
      "&:hover": { borderColor: invalid ? "var(--primary)" : "var(--border)" },
    }),
    valueContainer: (base) => ({ ...base, padding: "0 16px" }),
    input: (base) => ({ ...base, margin: 0, padding: 0, color: "var(--foreground)" }),
    singleValue: (base) => ({ ...base, color: "var(--foreground)" }),
    placeholder: (base) => ({ ...base, color: "var(--muted)" }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: "var(--muted)",
      paddingInlineEnd: 12,
      transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : undefined,
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 12,
      border: "1px solid var(--border)",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      zIndex: 30,
    }),
    option: (base, state) => ({
      ...base,
      fontSize: 14,
      cursor: "pointer",
      backgroundColor: state.isSelected ? "var(--primary)" : state.isFocused ? "var(--primary-soft)" : "transparent",
      color: state.isSelected ? "var(--primary-foreground)" : "var(--foreground)",
    }),
  };
}

function toAddressPayload(values: AddressValues, phoneCountryCode: string, isDefault: boolean, postalCode: string) {
  const country = Country.getCountryByCode(values.country);
  const state = State.getStatesOfCountry(values.country).find((item) => item.isoCode === values.state);

  return {
    first_name: values.firstName,
    last_name: values.lastName,
    email: values.email.trim(),
    phone_number: values.phone.trim(),
    phone_country_code: phoneCountryCode,
    street_address: values.address,
    city: values.city,
    state: state?.name ?? "",
    state_code: values.state ?? "",
    country: country?.name ?? "",
    country_code: values.country,
    postal_code: postalCode.trim(),
    is_default: isDefault,
  };
}

export function AccountAddressCount() {
  const { data } = useGetAddressesQuery();
  return data?.length ?? 0;
}

export function AccountAddresses() {
  const t = useTranslations("AccountPage");
  const checkout = useTranslations("CheckoutClassicPage");
  const locale = useLocale();
  const { data: addresses = [], isLoading, isUninitialized } = useGetAddressesQuery();
  const [addAddress] = useAddAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const { openModal } = useModal();
  const [formOpen, setFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressEntity | null>(null);
  const [phoneCountryCode, setPhoneCountryCode] = useState("971");
  const [isDefault, setIsDefault] = useState(false);
  const [postalCode, setPostalCode] = useState("");

  const validationSchema = useMemo(() => checkoutValidationSchema((countryCode) => State.getStatesOfCountry(countryCode)), []);

  const formik = useFormik<AddressValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const payload = toAddressPayload(values, phoneCountryCode, isDefault, postalCode);
      try {
        if (editingAddress) {
          await updateAddress({ addressId: editingAddress._id, ...payload }).unwrap();
        } else {
          await addAddress(payload).unwrap();
        }
        setFormOpen(false);
      } catch {
        // The request toast already reports the failure.
      }
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

  function fieldError(name: keyof AddressValues) {
    const error = formik.touched[name] ? formik.errors[name] : undefined;
    return error ? checkout(error as ValidationMessageKey) : undefined;
  }

  function openAdd() {
    formik.resetForm({ values: initialValues });
    setPhoneCountryCode("971");
    setIsDefault(addresses.length === 0);
    setPostalCode("");
    setEditingAddress(null);
    setFormOpen(true);
  }

  function openEdit(address: AddressEntity) {
    formik.resetForm({
      values: {
        firstName: address.first_name,
        lastName: address.last_name,
        country: address.country_code || "AE",
        state: State.getStatesOfCountry(address.country_code).find((item) => item.name === address.state)?.isoCode ?? "",
        city: address.city,
        address: address.street_address,
        phone: address.phone_number,
        email: address.email ?? "",
      },
    });
    setIsDefault(address.is_default);
    setPostalCode(address.postal_code ?? "");
    setEditingAddress(address);
    setFormOpen(true);
  }

  function openDelete(address: AddressEntity) {
    openModal({
      title: checkout("deleteTitle"),
      size: "sm",
      content: <DeleteAddressConfirm addressId={address._id} name={`${address.first_name} ${address.last_name}`.trim()} />,
    });
  }

  if (formOpen) {
    return (
      <form noValidate onSubmit={formik.handleSubmit} className="mt-6 rounded-2xl border border-border bg-background px-5 py-5">
        <h2 className="text-lg font-bold text-heading">{editingAddress ? checkout("editAddress") : checkout("addNew")}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className={labelClassName}>
            {checkout("firstName")}
            <RequiredMark />
            <input name="firstName" autoComplete="given-name" value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={Boolean(fieldError("firstName"))} className={fieldClassName} />
            {fieldError("firstName") ? <p className="mt-1.5 text-xs font-normal text-primary">{fieldError("firstName")}</p> : null}
          </label>
          <label className={labelClassName}>
            {checkout("lastName")}
            <RequiredMark />
            <input name="lastName" autoComplete="family-name" value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={Boolean(fieldError("lastName"))} className={fieldClassName} />
            {fieldError("lastName") ? <p className="mt-1.5 text-xs font-normal text-primary">{fieldError("lastName")}</p> : null}
          </label>
          <div>
            <label htmlFor="account-country" className={labelClassName}>
              {checkout("country")}
              <RequiredMark />
            </label>
            <Select<SelectOption, false>
              instanceId="account-country"
              inputId="account-country"
              options={countryOptions}
              value={countryValue}
              onChange={(option) => {
                void formik.setFieldValue("country", option?.value ?? "");
                void formik.setFieldValue("state", "");
              }}
              onBlur={() => void formik.setFieldTouched("country", true)}
              isRtl={locale === "ar"}
              isSearchable
              styles={selectStyles(Boolean(fieldError("country")))}
              noOptionsMessage={() => checkout("noOptions")}
            />
            {fieldError("country") ? <p className="mt-1.5 text-xs font-normal text-primary">{fieldError("country")}</p> : null}
          </div>
          <div>
            <label htmlFor="account-state" className={labelClassName}>
              {checkout("state")}
              {stateOptions.length > 0 ? <RequiredMark /> : null}
            </label>
            <Select<SelectOption, false>
              instanceId="account-state"
              inputId="account-state"
              options={stateOptions}
              value={stateValue}
              onChange={(option) => void formik.setFieldValue("state", option?.value ?? "")}
              onBlur={() => void formik.setFieldTouched("state", true)}
              isDisabled={stateOptions.length === 0}
              isRtl={locale === "ar"}
              isSearchable
              placeholder={checkout("statePlaceholder")}
              styles={selectStyles(Boolean(fieldError("state")))}
              noOptionsMessage={() => checkout("noOptions")}
            />
            {fieldError("state") ? <p className="mt-1.5 text-xs font-normal text-primary">{fieldError("state")}</p> : null}
          </div>
          <label className={labelClassName}>
            {checkout("city")}
            <RequiredMark />
            <input name="city" autoComplete="address-level2" value={formik.values.city} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={Boolean(fieldError("city"))} className={fieldClassName} />
            {fieldError("city") ? <p className="mt-1.5 text-xs font-normal text-primary">{fieldError("city")}</p> : null}
          </label>
          <label className={labelClassName}>
            {checkout("postalCode")}
            <input name="postalCode" autoComplete="postal-code" maxLength={10} value={postalCode} onChange={(event) => setPostalCode(event.target.value)} className={fieldClassName} />
          </label>
          <label className={`${labelClassName} sm:col-span-2`}>
            {checkout("address")}
            <RequiredMark />
            <input name="address" autoComplete="street-address" value={formik.values.address} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={Boolean(fieldError("address"))} className={fieldClassName} />
            {fieldError("address") ? <p className="mt-1.5 text-xs font-normal text-primary">{fieldError("address")}</p> : null}
          </label>
          <label className={`${labelClassName} sm:col-span-2`}>
            {checkout("phone")}
            <RequiredMark />
            <PhoneField
              value={formik.values.phone}
              invalid={Boolean(fieldError("phone"))}
              searchPlaceholder={checkout("searchCountry")}
              onChange={(value, dialCode) => {
                void formik.setFieldValue("phone", value);
                setPhoneCountryCode(dialCode);
              }}
              onBlur={() => void formik.setFieldTouched("phone", true)}
            />
            {fieldError("phone") ? <p className="mt-1.5 text-xs font-normal text-primary">{fieldError("phone")}</p> : null}
          </label>
          <label className={`${labelClassName} sm:col-span-2`}>
            {checkout("email")}
            <RequiredMark />
            <input name="email" type="email" autoComplete="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={Boolean(fieldError("email"))} className={fieldClassName} />
            {fieldError("email") ? <p className="mt-1.5 text-xs font-normal text-primary">{fieldError("email")}</p> : null}
          </label>
        </div>
        <label className="mt-5 flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-heading">
          <input type="checkbox" checked={isDefault} onChange={(event) => setIsDefault(event.target.checked)} className="size-4 accent-primary" />
          {checkout("setDefault")}
        </label>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="submit" disabled={formik.isSubmitting} className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60">
            {checkout("saveAddress")}
          </button>
          <button type="button" onClick={() => setFormOpen(false)} className="inline-flex h-10 items-center justify-center rounded-full border border-border px-6 text-sm font-semibold text-heading transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            {checkout("cancel")}
          </button>
        </div>
      </form>
    );
  }

  return (
    <>
      <div className="mt-6 flex justify-end">
        <button type="button" onClick={openAdd} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          <LuPlus aria-hidden className="size-4" />
          {checkout("addNew")}
        </button>
      </div>
      {isLoading || isUninitialized ? null : addresses.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{checkout("emptyAddresses")}</p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <li key={address._id} className="rounded-2xl border border-border bg-background px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-heading">
                  {address.first_name} {address.last_name}
                </p>
                <div className="flex shrink-0 items-center gap-1">
                  {address.is_default ? (
                    <span className="inline-flex h-7 items-center rounded-full bg-primary-soft px-3 text-xs font-semibold text-primary">{t("defaultAddress")}</span>
                  ) : null}
                  <button type="button" aria-label={checkout("editLabel", { name: `${address.first_name} ${address.last_name}` })} onClick={() => openEdit(address)} className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    <LuPencil aria-hidden className="size-4" />
                  </button>
                  <button type="button" aria-label={checkout("deleteLabel", { name: `${address.first_name} ${address.last_name}` })} onClick={() => openDelete(address)} className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    <LuTrash2 aria-hidden className="size-4" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {address.street_address}
                <br />
                {address.city}
              </p>
              <p className="mt-3 text-sm text-heading" dir="ltr">
                {address.phone_number}
              </p>
              {address.email ? <p className="mt-1 text-sm text-muted">{address.email}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
