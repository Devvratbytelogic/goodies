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
import { Link } from "@/i18n/navigation";
import { useAddAddressMutation, useGetAddressesQuery, useUpdateAddressMutation } from "@/store/endpoints/addressApi";
import { AddressEntity } from "@/server/types/address";
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
  "mt-1.5 h-11 w-full rounded-md border border-border font-normal bg-background px-3.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:border-primary";

const labelClassName = "block text-sm font-bold text-heading";

const addLinkClassName =
  "inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

function toAddressPayload(values: CheckoutFormValues, phoneCountryCode: string, isDefault: boolean, postalCode: string) {
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
      {address.email ? <span className="block text-sm text-muted">{address.email}</span> : null}
    </span>
  );
}

export default function CheckoutForm({ shopHref }: { shopHref: string }) {
  const t = useTranslations("CheckoutClassicPage");
  const locale = useLocale();
  const [placed, setPlaced] = useState(false);
  const { data: addresses = [], isLoading: isLoadingAddresses } = useGetAddressesQuery();
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressEntity | null>(null);
  const [addAddress] = useAddAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const { openModal } = useModal();
  // until the user picks one (or the picked one is deleted), use the default address (or the first one)
  const pickedAddressId = addresses.find((address) => address._id === pickedId)?._id;
  const selectedId = pickedAddressId ?? addresses.find((address) => address.is_default)?._id ?? addresses[0]?._id ?? null;
  const [shipToDifferent, setShipToDifferent] = useState(false);
  const [shippingPickedId, setShippingPickedId] = useState<string | null>(null);
  const [addingFor, setAddingFor] = useState<"billing" | "shipping">("billing");
  // shipping is the billing address unless the user ticks "Ship to a different address?" and picks another one
  const shippingId = shipToDifferent
    ? (addresses.find((address) => address._id === shippingPickedId)?._id ?? selectedId)
    : selectedId;
  const [phoneCountryCode, setPhoneCountryCode] = useState("971");
  const [isDefault, setIsDefault] = useState(false);
  const [postalCode, setPostalCode] = useState("");

  const validationSchema = useMemo(() => checkoutValidationSchema((countryCode) => State.getStatesOfCountry(countryCode)), []);

  const formik = useFormik<CheckoutFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (editingAddress) {
          const payload = toAddressPayload(values, phoneCountryCode, isDefault, postalCode);
          await updateAddress({ addressId: editingAddress._id, ...payload }).unwrap();
          setPickedId(editingAddress._id);
        } else {
          const newAddress = await addAddress(toAddressPayload(values, phoneCountryCode, isDefault, postalCode)).unwrap();
          // select the new address in the list it was added from (only if the API returns its _id)
          if (addingFor === "shipping") {
            setShippingPickedId(newAddress?._id ?? null);
          } else {
            setPickedId(newAddress?._id ?? null);
          }
        }
        setFormOpen(false);
      } catch (error) {
        console.error("Error saving address", error);
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

  function fieldError(name: keyof CheckoutFormValues) {
    const error = formik.touched[name] ? formik.errors[name] : undefined;
    return error ? t(error as ValidationMessageKey) : undefined;
  }

  function onCountryChange(option: SelectOption | null) {
    void formik.setFieldValue("country", option?.value ?? "");
    void formik.setFieldValue("state", "");
    void formik.setFieldTouched("state", false, false);
  }

  function openAdd(target: "billing" | "shipping") {
    setAddingFor(target);
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
        country: address.country_code,
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
    const name = `${address.first_name} ${address.last_name}`.trim();
    openModal({
      title: t("deleteTitle"),
      size: "sm",
      content: <DeleteAddressConfirm addressId={address._id} name={name} />,
    });
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

  if (!formOpen) {
    return (
      <section className="rounded-2xl border border-border bg-background px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-bold">{t("billingAddress")}</h2>
          <button type="button" onClick={() => openAdd("billing")} className={addLinkClassName}>
            <LuPlus aria-hidden className="size-4" />
            {t("addNew")}
          </button>
        </div>
        {isLoadingAddresses ? <p className="mt-4 text-sm text-muted">{t("loadingAddresses")}</p> : null}
        {!isLoadingAddresses && addresses.length === 0 ? <p className="mt-4 text-sm text-muted">{t("emptyAddresses")}</p> : null}
        <div className="mt-4 grid gap-3" role="radiogroup" aria-label={t("billingAddress")}>
          {addresses.map((address) => {
            const selected = address._id === selectedId;

            return (
              <div
                key={address._id}
                className={`flex items-start gap-3 rounded-xl border p-4 ${selected ? "border-primary bg-primary-soft" : "border-border"}`}
              >
                <label className="flex min-w-0 flex-1 cursor-pointer gap-3">
                  <input
                    type="radio"
                    name="saved-address"
                    value={address._id}
                    checked={selected}
                    onChange={() => setPickedId(address._id)}
                    className="mt-1 size-4 accent-primary"
                  />
                  <AddressLines address={address} defaultLabel={t("defaultAddress")} />
                </label>
                <div className="-me-1 -mt-1 flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    aria-label={t("editLabel", { name: `${address.first_name} ${address.last_name}` })}
                    onClick={() => openEdit(address)}
                    className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-background hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <LuPencil aria-hidden className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={t("deleteLabel", { name: `${address.first_name} ${address.last_name}` })}
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
        {addresses.length > 0 ? (
          <label className="mt-6 flex cursor-pointer items-center gap-2.5 border-t border-border pt-5 text-sm font-bold text-heading">
            <input
              type="checkbox"
              checked={shipToDifferent}
              onChange={(event) => setShipToDifferent(event.target.checked)}
              className="size-4 accent-primary"
            />
            {t("shipToDifferent")}
          </label>
        ) : null}

        {shipToDifferent && addresses.length > 0 ? (
          <div className="mt-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-bold">{t("shippingAddress")}</h2>
              <button type="button" onClick={() => openAdd("shipping")} className={addLinkClassName}>
                <LuPlus aria-hidden className="size-4" />
                {t("addNew")}
              </button>
            </div>
            <div className="mt-4 grid gap-3" role="radiogroup" aria-label={t("shippingAddress")}>
              {addresses.map((address) => {
                const selected = address._id === shippingId;

                return (
                  <label
                    key={address._id}
                    className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${selected ? "border-primary bg-primary-soft" : "border-border"}`}
                  >
                    <input
                      type="radio"
                      name="shipping-address"
                      value={address._id}
                      checked={selected}
                      onChange={() => setShippingPickedId(address._id)}
                      className="mt-1 size-4 accent-primary"
                    />
                    <AddressLines address={address} defaultLabel={t("defaultAddress")} />
                  </label>
                );
              })}
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setPlaced(true)}
          disabled={!selectedId || !shippingId}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70"
        >
          {t("placeOrder")}
        </button>
      </section>
    );
  }

  return (
    <form noValidate onSubmit={formik.handleSubmit} className="rounded-2xl border border-border bg-background px-5 py-5 sm:px-6 sm:py-6">
      <h2 className="text-base font-bold">{editingAddress ? t("editAddress") : t("addNew")}</h2>
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
        <label className={labelClassName}>
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
        <label className={labelClassName}>
          {t("postalCode")}
          <input
            name="postalCode"
            type="text"
            autoComplete="postal-code"
            maxLength={10}
            value={postalCode}
            onChange={(event) => setPostalCode(event.target.value)}
            className={fieldClassName}
          />
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
          <PhoneField
            value={formik.values.phone}
            invalid={Boolean(fieldError("phone"))}
            describedBy={fieldError("phone") ? "checkout-phone-error" : undefined}
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

      <label className="mt-5 flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-heading">
        <input
          type="checkbox"
          checked={isDefault}
          onChange={(event) => setIsDefault(event.target.checked)}
          className="size-4 accent-primary"
        />
        {t("setDefault")}
      </label>

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70"
      >
        {t("saveAddress")}
      </button>
      <button
        type="button"
        onClick={() => setFormOpen(false)}
        className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border border-border text-sm font-semibold text-heading transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t("cancel")}
      </button>
    </form>
  );
}
