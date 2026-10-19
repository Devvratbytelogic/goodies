import Cookies from "js-cookie";

const cookieName = "origin";
const sessionMinutes = 30;
const searchEngines = ["google", "bing", "yahoo", "duckduckgo", "baidu", "yandex", "ecosia"];

const cookieOptions = {
  expires: 180,
  path: "/",
  sameSite: "Lax" as const,
  secure: typeof window !== "undefined" && window.location.protocol === "https:",
};

type SourceType = "utm" | "organic" | "referral" | "typein";

type Attribution = {
  type: SourceType;
  source: string;
  at: number;
};

function hostName(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function searchEngine(host: string) {
  return searchEngines.find((name) => host === name || host.startsWith(`${name}.`) || host.includes(`.${name}.`));
}

function isHost(host: string, name: string) {
  return host === name || host.endsWith(`.${name}`);
}

// Ads still append a click id and open inside the app when the ad URL has no utm_source.
function adSource(params: URLSearchParams, referrer: string) {
  const browser = navigator.userAgent.toLowerCase();
  if (isHost(referrer, "instagram.com") || browser.includes("instagram")) return "ig";
  if (isHost(referrer, "tiktok.com") || browser.includes("tiktok") || browser.includes("bytedance") || params.has("ttclid")) return "tiktok";
  if (isHost(referrer, "facebook.com") || isHost(referrer, "fb.com") || isHost(referrer, "fb.me") || browser.includes("fban") || browser.includes("fb_iab") || params.has("fbclid")) return "fb";
  return "";
}

function currentVisit(): Attribution | undefined {
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id"];
  if (utmKeys.some((key) => params.get(key))) {
    return { type: "utm", source: params.get("utm_source") || "(none)", at: Date.now() };
  }

  const referrer = hostName(document.referrer);
  const ad = adSource(params, referrer);
  if (ad) return { type: "utm", source: ad, at: Date.now() };

  const here = hostName(window.location.href);
  if (!referrer || referrer === here) return undefined;

  const engine = searchEngine(referrer);
  if (engine) return { type: "organic", source: engine, at: Date.now() };
  return { type: "referral", source: referrer, at: Date.now() };
}

function readAttribution(): Attribution | undefined {
  const raw = Cookies.get(cookieName);
  if (!raw) return undefined;
  try {
    const saved = JSON.parse(raw) as Attribution;
    if (saved?.type && saved.source) return saved;
  } catch {
    return undefined;
  }
  return undefined;
}

function saveAttribution(visit: Attribution) {
  Cookies.set(cookieName, JSON.stringify(visit), cookieOptions);
}

// WooCommerce rules: an ad or a search always replaces the saved source.
// Direct never replaces it. Another website replaces it only after 30 idle minutes.
export function rememberOrigin() {
  const saved = readAttribution();
  const visit = currentVisit();
  const now = Date.now();
  const sessionIsOpen = !!saved && now - saved.at < sessionMinutes * 60 * 1000;

  if (!visit) {
    if (!saved) saveAttribution({ type: "typein", source: "(direct)", at: now });
    else saveAttribution({ ...saved, at: now });
    return;
  }

  if (visit.type === "referral" && sessionIsOpen) return;
  saveAttribution({ ...visit, at: now });
}

function sourceName(source: string) {
  const value = source.replace(/^[()]+|[()]+$/g, "");
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function readOrigin() {
  const saved = readAttribution();
  if (!saved || saved.type === "typein") return "Direct";
  if (saved.type === "organic") return `Organic: ${sourceName(saved.source)}`;
  if (saved.type === "referral") return `Referral: ${sourceName(saved.source)}`;
  return `Source: ${sourceName(saved.source)}`;
}
