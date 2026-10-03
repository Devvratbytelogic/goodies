const storageKey = "goodies-device-id";

export function getDeviceId() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const existing = window.localStorage.getItem(storageKey);
    if (existing) {
      return existing;
    }

    const id = crypto.randomUUID();
    window.localStorage.setItem(storageKey, id);
    return id;
  } catch {
    return null;
  }
}
