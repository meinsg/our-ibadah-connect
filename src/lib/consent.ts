export const CONSENT_VERSION = "1.0.0";
export const CONSENT_STORAGE_KEY = "ouribadah.consent.v1";

export type ConsentCategory =
  | "account_service"
  | "analytics"
  | "marketing"
  | "personalization"
  | "cookies"
  | "ad_storage"
  | "ad_user_data"
  | "ad_personalization";

export type ConsentStatus = "granted" | "denied" | "withdrawn";

export type ConsentState = Record<ConsentCategory, boolean>;

export interface StoredConsent {
  version: string;
  decidedAt: string;
  state: ConsentState;
}

export const CONSENT_TEXT =
  "We use your data to provide and secure your ourIbadah account. You can choose whether to allow optional analytics, updates, and personalization. You may change or withdraw your choices anytime in Settings.";

export const CONSENT_CATEGORIES: {
  key: ConsentCategory;
  title: string;
  description: string;
  required?: boolean;
}[] = [
  {
    key: "account_service",
    title: "Account & service processing",
    description:
      "Required to create your account, sign you in, and deliver core features like prayer times, Qibla, and the ibadah tracker.",
    required: true,
  },
  {
    key: "analytics",
    title: "Analytics",
    description:
      "Anonymous usage statistics that help us understand which features are useful and improve the app. No personal profiling.",
  },
  {
    key: "marketing",
    title: "Updates & news",
    description:
      "Occasional emails about new features, Islamic resources, and community announcements. You can unsubscribe anytime.",
  },
  {
    key: "personalization",
    title: "Personalized recommendations",
    description:
      "Suggest nearby mosques, halal places, and content tailored to your location and habits.",
  },
  {
    key: "cookies",
    title: "Non-essential cookies & trackers",
    description:
      "Allows analytics scripts (like Google Analytics) to load. Essential cookies for sign-in always remain.",
  },
  {
    key: "ad_storage",
    title: "Advertising cookies",
    description:
      "Allows advertising and remarketing cookies (e.g. Google Ads) so we can measure ad performance.",
  },
  {
    key: "ad_user_data",
    title: "Send advertising data to Google",
    description:
      "Allows sharing advertising-related data with Google for measurement and conversion attribution.",
  },
  {
    key: "ad_personalization",
    title: "Personalized ads",
    description:
      "Allows Google to use your data to show ads tailored to your interests.",
  },
];

export const DEFAULT_CONSENT: ConsentState = {
  account_service: true, // required for the service to work
  analytics: false,
  marketing: false,
  personalization: false,
  cookies: false,
  ad_storage: false,
  ad_user_data: false,
  ad_personalization: false,
};

export function readStoredConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeStoredConsent(state: ConsentState) {
  const payload: StoredConsent = {
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
    state,
  };
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

export function clearStoredConsent() {
  localStorage.removeItem(CONSENT_STORAGE_KEY);
}