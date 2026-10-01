"use client";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./phone-input.css";

type PhoneFieldProps = {
  value: string;
  invalid: boolean;
  describedBy?: string;
  searchPlaceholder: string;
  onChange: (value: string, dialCode: string) => void;
  onBlur: () => void;
};

export default function PhoneField({ value, invalid, describedBy, searchPlaceholder, onChange, onBlur }: PhoneFieldProps) {
  return (
    <div className={`register-phone mt-1 ${invalid ? "register-phone-invalid" : ""}`}>
      <PhoneInput
        country="ae"
        preferredCountries={["ae", "sa", "om", "qa", "kw", "bh"]}
        value={value}
        onChange={(phone, country) => onChange(phone, "dialCode" in country ? country.dialCode : "")}
        onBlur={onBlur}
        countryCodeEditable={false}
        enableSearch
        disableSearchIcon
        specialLabel=""
        searchPlaceholder={searchPlaceholder}
        inputProps={{
          name: "phone",
          autoComplete: "tel",
          "aria-invalid": invalid,
          "aria-describedby": describedBy,
        }}
      />
    </div>
  );
}
