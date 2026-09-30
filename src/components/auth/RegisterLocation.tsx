"use client";

import { useMemo } from "react";
import Country from "country-state-city/lib/country";
import State from "country-state-city/lib/state";
import { useLocale, useTranslations } from "next-intl";
import Select, { type StylesConfig } from "react-select";
import { RequiredMark } from "@/components/form/RequiredMark";

type SelectOption = { value: string; label: string };

type RegisterLocationProps = {
  country: string;
  state: string;
  countryLabel: string;
  stateLabel: string;
  countryError?: string;
  stateError?: string;
  labelClassName: string;
  onCountryChange: (country: string) => void;
  onStateChange: (state: string) => void;
  onCountryBlur: () => void;
  onStateBlur: () => void;
};

function selectStyles(invalid: boolean): StylesConfig<SelectOption, false> {
  return {
    control: (base, state) => ({
      ...base,
      minHeight: 48,
      height: 48,
      marginTop: 4,
      borderRadius: 12,
      borderColor: invalid ? "var(--primary)" : state.isFocused ? "var(--primary)" : "var(--border)",
      boxShadow: "none",
      backgroundColor: state.isFocused ? "var(--background)" : "var(--surface)",
      fontSize: 14,
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      opacity: state.isDisabled ? 0.6 : 1,
      "&:hover": {
        borderColor: invalid || state.isFocused ? "var(--primary)" : "var(--border)",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 16px",
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      color: "var(--foreground)",
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
      borderRadius: 12,
      border: "1px solid var(--border)",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      zIndex: 40,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 100,
    }),
    menuList: (base) => ({
      ...base,
      padding: 4,
    }),
    option: (base, state) => ({
      ...base,
      borderRadius: 8,
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

export default function RegisterLocation({
  country,
  state,
  countryLabel,
  stateLabel,
  countryError,
  stateError,
  labelClassName,
  onCountryChange,
  onStateChange,
  onCountryBlur,
  onStateBlur,
}: RegisterLocationProps) {
  const t = useTranslations("Register");
  const locale = useLocale();
  const countries = useMemo(
    () =>
      Country.getAllCountries()
        .slice()
        .sort((left, right) => left.name.localeCompare(right.name))
        .map((item) => ({ value: item.isoCode, label: item.name })),
    [],
  );
  const states = useMemo(
    () => State.getStatesOfCountry(country).map((item) => ({ value: item.isoCode, label: item.name })),
    [country],
  );
  const countryValue = countries.find((option) => option.value === country) ?? null;
  const stateValue = states.find((option) => option.value === state) ?? null;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label htmlFor="register-country" className={labelClassName}>
          {countryLabel}
          <RequiredMark />
        </label>
        <Select<SelectOption, false>
          instanceId="register-country"
          inputId="register-country"
          name="country"
          options={countries}
          value={countryValue}
          onChange={(option) => onCountryChange(option?.value ?? "")}
          onBlur={onCountryBlur}
          isRtl={locale === "ar"}
          isSearchable
          styles={selectStyles(Boolean(countryError))}
          menuPortalTarget={document.body}
          menuPosition="fixed"
          aria-invalid={Boolean(countryError)}
          aria-errormessage={countryError ? "register-country-error" : undefined}
          noOptionsMessage={() => t("noOptions")}
        />
        {countryError ? (
          <p id="register-country-error" className="mt-1.5 text-xs font-normal text-primary">
            {countryError}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="register-state" className={labelClassName}>
          {stateLabel}
          {states.length > 0 ? <RequiredMark /> : null}
        </label>
        <Select<SelectOption, false>
          instanceId="register-state"
          inputId="register-state"
          name="state"
          options={states}
          value={stateValue}
          placeholder={stateLabel}
          onChange={(option) => onStateChange(option?.value ?? "")}
          onBlur={onStateBlur}
          isDisabled={states.length === 0}
          isRtl={locale === "ar"}
          isSearchable
          styles={selectStyles(Boolean(stateError))}
          menuPortalTarget={document.body}
          menuPosition="fixed"
          aria-invalid={Boolean(stateError)}
          aria-errormessage={stateError ? "register-state-error" : undefined}
          noOptionsMessage={() => t("noOptions")}
        />
        {stateError ? (
          <p id="register-state-error" className="mt-1.5 text-xs font-normal text-primary">
            {stateError}
          </p>
        ) : null}
      </div>
    </div>
  );
}
