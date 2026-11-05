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
// Require a real domain ending (example.com). Yup's email() accepts "name@gmail".
const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
const emailString = (required: string, emailInvalid: string) => Yup.string().trim().required(required).matches(EMAIL_PATTERN, emailInvalid);
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

export const newsletterValidationSchema = Yup.object({
  email: emailString("required", "emailInvalid"),
});

export const otpValidationSchema = Yup.object({
  code: Yup.string().required("required").matches(/^\d{6}$/, "invalid"),
});

export const resetPasswordValidationSchema = Yup.object({
  password: passwordString(),
  confirmPassword: Yup.string().required("required").oneOf([Yup.ref("password")], "passwordMismatch"),
});

const locationFields = {
  country: Yup.string().trim().required("required"),
  state: Yup.string()
    .trim()
    .test("state", "required", async function validateState(value) {
      const country = this.parent.country ?? "";
      if (!country) return true;

      const { default: State } = await import("country-state-city/lib/state");
      const states = State.getStatesOfCountry(country);
      if (states.length === 0) return true;

      return Boolean(value && states.some((state) => state.isoCode === value));
    }),
};

export const profileValidationSchema = Yup.object({
  firstName: requiredString("required", 40),
  lastName: requiredString("required", 40),
  email: emailString("required", "emailInvalid"),
  phone: phoneString("required", "phoneInvalid"),
  ...locationFields,
});

export const changePasswordValidationSchema = Yup.object({
  currentPassword: Yup.string().required("required"),
  password: passwordString().notOneOf([Yup.ref("currentPassword")], "passwordSame"),
  confirmPassword: Yup.string().required("required").oneOf([Yup.ref("password")], "passwordMismatch"),
});

export const registerValidationSchema = Yup.object({
  firstName: requiredString("required", 40),
  lastName: requiredString("required", 40),
  email: emailString("required", "emailInvalid"),
  phone: Yup.string().required("required").matches(/^\d{8,15}$/, "phoneInvalid"),
  ...locationFields,
  password: passwordString(),
  confirmPassword: Yup.string().required("required").oneOf([Yup.ref("password")], "passwordMismatch"),
});

export const productReviewValidationSchema = Yup.object({
  rating: Yup.number().min(1, "required").max(5).required("required"),
  text: Yup.string()
    .trim()
    .required("required")
    .max(1000, "tooLong")
    .test("no-script", "invalidText", (value) => !value || !SCRIPT_PATTERN.test(value)),
  name: requiredString("required", 80),
  email: emailString("required", "emailInvalid"),
});

export const contactMessageMin = 10;
export const contactMessageMax = 500;

const personName = () =>
  Yup.string()
    .trim()
    .required("required")
    .max(40, "tooLong")
    .test("name", "nameInvalid", (value) => {
      if (!value) return false;
      const letters = value.match(/\p{L}/gu) ?? [];
      if (letters.length < 2) return false;
      return /^[\p{L}\p{M}\p{N}\s.'’-]+$/u.test(value);
    });

export const contactUsValidationSchema = Yup.object({
  firstName: personName(),
  lastName: personName(),
  phone: phoneString("required", "phoneInvalid"),
  email: emailString("required", "emailInvalid"),
  message: Yup.string()
    .trim()
    .required("required")
    .min(contactMessageMin, "messageTooShort")
    .max(contactMessageMax, "tooLong")
    .matches(SAFE_TEXT, "invalidText")
    .test("no-script", "invalidText", (value) => !value || !SCRIPT_PATTERN.test(value)),
});

export const cancelOrderValidationSchema = Yup.object({
  order_item_ids: Yup.array().of(Yup.string().required()).min(1, "required"),
  reason: Yup.string().required("required"),
  description: Yup.string().when("reason", {
    is: "other",
    then: (schema) => schema.trim().required("required").max(500, "tooLong"),
    otherwise: (schema) => schema.trim().max(500, "tooLong"),
  }),
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
