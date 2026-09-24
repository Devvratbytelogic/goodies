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

export const contactUsValidationSchema = Yup.object({
  firstName: requiredString("required", 40),
  lastName: requiredString("required", 40),
  phone: phoneString("required", "phoneInvalid"),
  email: emailString("required", "emailInvalid"),
  message: requiredString("required", 500),
});
