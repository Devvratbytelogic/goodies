import { getCheckoutClassicRoutePath } from "@/utils/routes";

const returnKey = "checkout-return";
const reopenKey = "checkout-reopen";
const resumeKey = "checkout-resume";

function storage() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function safePath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\") || path.includes("://")) return "";
  if (path.length > 500) return "";
  return path;
}

export function isClassicCheckoutPath(path: string) {
  const base = path.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
  return base === getCheckoutClassicRoutePath();
}

export function rememberCheckoutReturn(path: string) {
  const safe = safePath(path);
  const store = storage();
  if (!store || !safe) return;
  store.setItem(returnKey, safe);
}

export function readCheckoutReturn() {
  const store = storage();
  if (!store) return "";
  return safePath(store.getItem(returnKey) ?? "");
}

export function armCheckoutReopen() {
  const store = storage();
  if (!store) return;
  store.setItem(reopenKey, "1");
  store.setItem(resumeKey, "payment");
}

export function consumeCheckoutReopen() {
  const store = storage();
  if (!store || store.getItem(reopenKey) !== "1") return false;
  window.setTimeout(() => store.removeItem(reopenKey), 0);
  return true;
}

export function peekCheckoutResume() {
  const store = storage();
  return store?.getItem(resumeKey) === "payment";
}

export function consumeCheckoutResume() {
  const store = storage();
  if (!store || store.getItem(resumeKey) !== "payment") return false;
  window.setTimeout(() => store.removeItem(resumeKey), 0);
  return true;
}
