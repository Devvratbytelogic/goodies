import * as Yup from "yup";

const SAFE_TEXT = /^[\p{L}\p{M}\p{N}\s.,?'’\-:،؟]+$/u;
const SCRIPT_PATTERN = /<|>|javascript:|onerror\s*=|onload\s*=/i;

const requiredString = (required: string, max: number) =>
  Yup.string()
    .trim()
    .required(required)
    .max(max, "tooLong")
    .matches(SAFE_TEXT, "invalidText")
    .test("no-script", "invalidText", (value) => !value || !SCRIPT_PATTERN.test(value));
const phoneString = (required: string, phoneInvalid: string) => Yup.string().trim().required(required).matches(/^[+]?[\d\s()-]{7,20}$/, phoneInvalid);
const emailString = (required: string, emailInvalid: string) => Yup.string().trim().required(required).email(emailInvalid);
const passwordString = () =>
  Yup.string()
    .required("required")
    .min(8, "tooShort")
    .matches(/[a-z]/, "lowercase")
    .matches(/[A-Z]/, "uppercase")
    .matches(/[0-9]/, "number")
    .matches(/[^A-Za-z0-9]/, "special");

export const loginValidationSchema = Yup.object({
  email: emailString("required", "emailInvalid"),
  password: passwordString(),
});

export const forgotValidationSchema = Yup.object({
  email: emailString("required", "emailInvalid"),
});

export const otpValidationSchema = Yup.object({
  code: Yup.string().required("required").matches(/^\d{6}$/, "invalid"),
});

export const resetPasswordValidationSchema = Yup.object({
  password: passwordString(),
  confirmPassword: Yup.string().required("required").oneOf([Yup.ref("password")], "passwordMismatch"),
});

export const registerValidationSchema = Yup.object({
  firstName: requiredString("required", 40),
  lastName: requiredString("required", 40),
  email: emailString("required", "emailInvalid"),
  phone: Yup.string().required("required").matches(/^\d{8,15}$/, "phoneInvalid"),
  password: passwordString(),
  confirmPassword: Yup.string().required("required").oneOf([Yup.ref("password")], "passwordMismatch"),
});

export const contactUsValidationSchema = Yup.object({
  firstName: requiredString("required", 40),
  lastName: requiredString("required", 40),
  phone: phoneString("required", "phoneInvalid"),
  email: emailString("required", "emailInvalid"),
  message: requiredString("required", 500),
});

export const checkoutValidationSchema = (getStatesOfCountry: (countryCode: string) => readonly { isoCode: string }[]) =>
  Yup.object({
    firstName: requiredString("required", 40),
    lastName: requiredString("required", 40),
    country: Yup.string().trim().required("required"),
    state: Yup.string()
      .trim()
      .test("state", "required", function validateState(value) {
        const states = getStatesOfCountry(this.parent.country ?? "");
        if (states.length === 0) {
          return true;
        }

        return Boolean(value && states.some((state) => state.isoCode === value));
      }),
    city: requiredString("required", 80),
    address: requiredString("required", 120),
    phone: phoneString("required", "phoneInvalid"),
    email: emailString("required", "emailInvalid"),
  });
