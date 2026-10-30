"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
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
import CheckoutFormSkeleton from "@/components/skeletons/CheckoutFormSkeleton";
import { AddressEntity } from "@/server/types/address";
import type { UserProfile } from "@/server/types/user";
import { useAddAddressMutation, useGetAddressesQuery, useUpdateAddressMutation } from "@/store/endpoints/addressApi";
import { useGetUserProfileQuery } from "@/store/endpoints/userApi";
import { checkoutValidationSchema } from "@/validations";

type AddressValues = InferType<ReturnType<typeof checkoutValidationSchema>>;
type ValidationMessageKey = "required" | "emailInvalid" | "phoneInvalid" | "invalidText" | "tooLong";
type SelectOption = { value: string; label: string };

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
  "mt-1.5 h-11 w-full font-normal! rounded-md border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-primary";

const labelClassName = "block text-sm font-bold text-heading";

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
      outlineOffset: "2px",
      backgroundColor: "var(--background)",
      fontSize: 14,
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      opacity: state.isDisabled ? 0.7 : 1,
      "&:hover": { borderColor: invalid ? "var(--primary)" : "var(--border)" },
    }),
    valueContainer: (base) => ({ ...base, padding: "0 14px" }),
    input: (base) => ({ ...base, margin: 0, padding: 0, color: "var(--foreground)", outline: "none", boxShadow: "none" }),
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
      borderRadius: 6,
      border: "1px solid var(--border)",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      zIndex: 30,
    }),
    menuList: (base) => ({ ...base, padding: 4 }),
    option: (base, state) => ({
      ...base,
      borderRadius: 4,
      fontSize: 14,
      cursor: "pointer",
      backgroundColor: state.isSelected ? "var(--primary)" : state.isFocused ? "var(--primary-soft)" : "transparent",
      color: state.isSelected ? "var(--primary-foreground)" : "var(--foreground)",
    }),
    noOptionsMessage: (base) => ({ ...base, fontSize: 14, color: "var(--muted)" }),
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

function phoneFromProfile(profile: UserProfile | null | undefined) {
  const dial = (profile?.phone_country_code ?? "").replace(/\D/g, "") || "971";
  const number = (profile?.phone_number ?? "").replace(/\D/g, "");
  if (!number) return { phone: "", dial };
  if (number.startsWith(dial)) return { phone: number, dial };
  return { phone: `${dial}${number}`, dial };
}

function valuesFromProfile(profile: UserProfile | null | undefined): AddressValues {
  const { phone } = phoneFromProfile(profile);
  return {
    ...initialValues,
    firstName: profile?.name ?? "",
    lastName: profile?.last_name ?? "",
    email: profile?.email ?? "",
    phone,
    country: profile?.country_code || "AE",
  };
}

function AddressLines({ address, defaultLabel }: { address: AddressEntity; defaultLabel: string }) {
  return (
    <span className="min-w-0">
      <span className="flex flex-wrap items-center gap-2 text-sm font-bold text-heading">
        {address.first_name} {address.last_name}
        {address.is_default ? (
          <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">{defaultLabel}</span>
        ) : null}
      </span>
      <span className="mt-1 block text-sm text-muted">{address.street_address}</span>
      <span className="mt-0.5 block text-sm text-muted">{[address.city, address.state, address.country].filter(Boolean).join(", ")}</span>
      <span className="mt-1 block text-sm text-muted">{address.phone_number}</span>
    </span>
  );
}

export default function CheckoutAddress({ onDone, header }: { onDone?: () => void; header?: ReactNode }) {
  const t = useTranslations("CheckoutAddress");
  const fields = useTranslations("CheckoutClassicPage");
  const locale = useLocale();
  const { openModal } = useModal();
  const { data: addresses = [], isLoading } = useGetAddressesQuery();
  const { data: profile } = useGetUserProfileQuery();
  const [addAddress] = useAddAddressMutation();
  const [updateAddress] = useUpdateAddressMutation({ fixedCacheKey: "selected-address" });
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressEntity | null>(null);
  const [phoneCountryCode, setPhoneCountryCode] = useState("971");
  const [postalCode, setPostalCode] = useState("");
  const [continuing, setContinuing] = useState(false);

  const selectedId = pickedId ?? addresses.find((address) => address.is_selected)?._id ?? addresses.find((address) => address.is_default)?._id ?? null;
  const needsForm = !isLoading && (addresses.length === 0 || showForm);
  const formInitialValues = useMemo(() => valuesFromProfile(profile), [profile]);

  const validationSchema = useMemo(() => checkoutValidationSchema((countryCode) => State.getStatesOfCountry(countryCode)), []);
  const formik = useFormik<AddressValues>({
    initialValues: formInitialValues,
    enableReinitialize: !editingAddress,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        if (editingAddress) {
          await updateAddress({
            addressId: editingAddress._id,
            ...toAddressPayload(values, phoneCountryCode, editingAddress.is_default, postalCode),
          }).unwrap();
          setPickedId(editingAddress._id);
          closeForm();
        } else {
          const created = await addAddress({
            ...toAddressPayload(values, phoneCountryCode, addresses.length === 0, postalCode),
            is_selected: true,
          }).unwrap();
          if (created?._id) setPickedId(created._id);
          if (addresses.length === 0) onDone?.();
          else closeForm();
        }
      } catch (error) {
        console.error("Error saving address", error);
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!editingAddress) setPhoneCountryCode(profile?.phone_country_code ?? "971");
  }, [profile, editingAddress]);

  function openAdd() {
    setEditingAddress(null);
    formik.resetForm({ values: formInitialValues });
    setPhoneCountryCode(phoneFromProfile(profile).dial);
    setPostalCode("");
    setShowForm(true);
  }

  function openEdit(address: AddressEntity) {
    formik.resetForm({
      values: {
        firstName: address.first_name,
        lastName: address.last_name,
        country: address.country_code,
        state: State.getStatesOfCountry(address.country_code).find((item) => item.name === address.state)?.isoCode ?? "",
        city: address.city,
        address: address.street_address,
        phone: address.phone_number,
        email: address.email ?? "",
      },
    });
    setPostalCode(address.postal_code ?? "");
    setEditingAddress(address);
    setShowForm(true);
  }

  function openDelete(address: AddressEntity) {
    const name = `${address.first_name} ${address.last_name}`.trim();
    openModal({
      title: fields("deleteTitle"),
      size: "sm",
      content: <DeleteAddressConfirm addressId={address._id} name={name} />,
    });
  }

  function closeForm() {
    setShowForm(false);
    setEditingAddress(null);
    formik.resetForm({ values: formInitialValues });
    setPhoneCountryCode(phoneFromProfile(profile).dial);
    setPostalCode("");
  }

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
    return error ? fields(error as ValidationMessageKey) : undefined;
  }

  async function continueWithSelected() {
    if (!selectedId || continuing) return;
    setContinuing(true);
    try {
      await updateAddress({ addressId: selectedId, is_selected: true }).unwrap();
      onDone?.();
    } catch (error) {
      console.error("Error selecting address", error);
    } finally {
      setContinuing(false);
    }
  }

  const footerClassName =
    "grid shrink-0 gap-2 border-t border-border bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]";

  if (isLoading && addresses.length === 0) {
    return (
      <div className="checkout-auth-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        <div className="grid gap-3">
          {header}
          <div className="rounded-xl bg-white px-3.5 py-4">
            <CheckoutFormSkeleton label={fields("loadingAddresses")} />
          </div>
        </div>
      </div>
    );
  }

  if (needsForm) {
    return (
      <form noValidate onSubmit={formik.handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="checkout-auth-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-4">
          <div className="grid gap-3 pb-4">
            {header}
            <div className="grid gap-4 rounded-xl bg-white px-3.5 py-4 text-start">
              <div>
                <h2 className="text-sm font-bold text-heading">{editingAddress ? fields("editAddress") : t("title")}</h2>
                {editingAddress ? null : <p className="mt-1 text-xs text-muted">{t("subtitleAdd")}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClassName}>
                  {fields("firstName")}
                  <RequiredMark />
                  <input name="firstName" type="text" autoComplete="given-name" value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={Boolean(fieldError("firstName"))} className={fieldClassName} />
                  {fieldError("firstName") ? <p className="mt-1.5 text-xs text-primary font-normal!">{fieldError("firstName")}</p> : null}
                </label>
                <label className={labelClassName}>
                  {fields("lastName")}
                  <RequiredMark />
                  <input name="lastName" type="text" autoComplete="family-name" value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={Boolean(fieldError("lastName"))} className={fieldClassName} />
                  {fieldError("lastName") ? <p className="mt-1.5 text-xs text-primary font-normal!">{fieldError("lastName")}</p> : null}
                </label>
                <div>
                  <label htmlFor="checkout-auth-country" className={labelClassName}>
                    {fields("country")}
                    <RequiredMark />
                  </label>
                  <Select<SelectOption, false>
                    instanceId="checkout-auth-country"
                    inputId="checkout-auth-country"
                    name="country"
                    options={countryOptions}
                    value={countryValue}
                    onChange={(option) => {
                      void formik.setFieldValue("country", option?.value ?? "");
                      void formik.setFieldValue("state", "");
                      void formik.setFieldTouched("state", false, false);
                    }}
                    onBlur={() => void formik.setFieldTouched("country", true)}
                    isRtl={locale === "ar"}
                    isSearchable
                    styles={selectStyles(Boolean(fieldError("country")))}
                    noOptionsMessage={() => fields("noOptions")}
                  />
                  {fieldError("country") ? <p className="mt-1.5 text-xs text-primary font-normal!">{fieldError("country")}</p> : null}
                </div>
                <div>
                  <label htmlFor="checkout-auth-state" className={labelClassName}>
                    {fields("state")}
                    {stateOptions.length > 0 ? <RequiredMark /> : null}
                  </label>
                  <Select<SelectOption, false>
                    instanceId="checkout-auth-state"
                    inputId="checkout-auth-state"
                    name="state"
                    options={stateOptions}
                    value={stateValue}
                    onChange={(option) => void formik.setFieldValue("state", option?.value ?? "")}
                    onBlur={() => void formik.setFieldTouched("state", true)}
                    isDisabled={stateOptions.length === 0}
                    isRtl={locale === "ar"}
                    isSearchable
                    placeholder={fields("statePlaceholder")}
                    styles={selectStyles(Boolean(fieldError("state")))}
                    noOptionsMessage={() => fields("noOptions")}
                  />
                  {fieldError("state") ? <p className="mt-1.5 text-xs text-primary font-normal!">{fieldError("state")}</p> : null}
                </div>
                <label className={labelClassName}>
                  {fields("city")}
                  <RequiredMark />
                  <input name="city" type="text" autoComplete="address-level2" value={formik.values.city} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={Boolean(fieldError("city"))} className={fieldClassName} />
                  {fieldError("city") ? <p className="mt-1.5 text-xs text-primary font-normal!">{fieldError("city")}</p> : null}
                </label>
                <label className={labelClassName}>
                  {fields("postalCode")}
                  <input name="postalCode" type="text" autoComplete="postal-code" maxLength={10} value={postalCode} onChange={(event) => setPostalCode(event.target.value)} className={fieldClassName} />
                </label>
                <label className={`${labelClassName} sm:col-span-2`}>
                  {fields("address")}
                  <RequiredMark />
                  <input name="address" type="text" autoComplete="street-address" value={formik.values.address} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={Boolean(fieldError("address"))} className={fieldClassName} />
                  {fieldError("address") ? <p className="mt-1.5 text-xs text-primary font-normal!">{fieldError("address")}</p> : null}
                </label>
                <label className={`${labelClassName} sm:col-span-2`}>
                  {fields("phone")}
                  <RequiredMark />
                  <PhoneField
                    value={formik.values.phone}
                    invalid={Boolean(fieldError("phone"))}
                    searchPlaceholder={fields("searchCountry")}
                    onChange={(value, dialCode) => {
                      void formik.setFieldValue("phone", value);
                      setPhoneCountryCode(dialCode);
                    }}
                    onBlur={() => void formik.setFieldTouched("phone", true)}
                  />
                  {fieldError("phone") ? <p className="mt-1.5 text-xs text-primary font-normal!">{fieldError("phone")}</p> : null}
                </label>
                <label className={`${labelClassName} sm:col-span-2`}>
                  {fields("email")}
                  <RequiredMark />
                  <input name="email" type="email" autoComplete="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={Boolean(fieldError("email"))} className={fieldClassName} />
                  {fieldError("email") ? <p className="mt-1.5 text-xs text-primary font-normal!">{fieldError("email")}</p> : null}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className={footerClassName}>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-70"
          >
            {formik.isSubmitting ? t("saving") : fields("saveAddress")}
          </button>
          {addresses.length > 0 ? (
            <button
              type="button"
              onClick={closeForm}
              className="inline-flex h-11 w-full items-center justify-center rounded-full border border-border text-sm font-semibold text-heading hover:border-primary hover:text-primary"
            >
              {fields("cancel")}
            </button>
          ) : null}
        </div>
      </form>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="checkout-auth-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-4">
        <div className="grid gap-3 pb-4">
          {header}
          <div className="grid gap-4 rounded-xl bg-white px-3.5 py-4 text-start">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-heading">{t("title")}</h2>
                <p className="mt-1 text-xs text-muted">{t("subtitleSelect")}</p>
              </div>
              <button
                type="button"
                onClick={openAdd}
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                <LuPlus aria-hidden className="size-4" />
                {fields("addNew")}
              </button>
            </div>

            {!selectedId ? <p className="text-sm font-medium text-primary">{fields("selectAddress")}</p> : null}

            <div className="grid gap-3" role="radiogroup" aria-label={t("title")}>
              {addresses.map((address) => {
                const selected = address._id === selectedId;
                return (
                  <div
                    key={address._id}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 ${selected ? "border-primary bg-primary-soft" : "border-border bg-surface"}`}
                  >
                    <label className="flex min-w-0 flex-1 cursor-pointer gap-3">
                      <input
                        type="radio"
                        name="checkout-auth-address"
                        value={address._id}
                        checked={selected}
                        onChange={() => setPickedId(address._id)}
                        className="mt-1 size-4 accent-primary"
                      />
                      <AddressLines address={address} defaultLabel={fields("defaultAddress")} />
                    </label>
                    <div className="-me-1 -mt-1 flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        aria-label={fields("editLabel", { name: `${address.first_name} ${address.last_name}` })}
                        onClick={() => openEdit(address)}
                        className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-background hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <LuPencil aria-hidden className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={fields("deleteLabel", { name: `${address.first_name} ${address.last_name}` })}
                        onClick={() => openDelete(address)}
                        className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-background hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <LuTrash2 aria-hidden className="size-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className={footerClassName}>
        <button
          type="button"
          disabled={!selectedId || continuing}
          onClick={continueWithSelected}
          className="inline-flex h-11 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-70"
        >
          {continuing ? t("saving") : t("continue")}
        </button>
      </div>
    </div>
  );
}
