export function showToast(type: "success" | "error", message: string) {
  if (typeof window === "undefined" || !message) return;

  window.dispatchEvent(new CustomEvent("app-toast", { detail: { type, message } }));
}
