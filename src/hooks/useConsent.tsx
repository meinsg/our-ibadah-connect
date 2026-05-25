import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  CONSENT_TEXT,
  CONSENT_VERSION,
  ConsentCategory,
  ConsentState,
  DEFAULT_CONSENT,
  readStoredConsent,
  writeStoredConsent,
} from "@/lib/consent";
import { detectRegion, isStrictConsentRegion, Region } from "@/lib/region";

const GA_MEASUREMENT_ID = "G-W31TL68SRR";

interface ConsentContextValue {
  state: ConsentState;
  hasDecided: boolean;
  loading: boolean;
  region: Region;
  strictMode: boolean;
  save: (
    next: ConsentState,
    source?: "signup" | "banner" | "settings"
  ) => Promise<void>;
  withdrawAll: () => Promise<void>;
  openManager: () => void;
  managerOpen: boolean;
  closeManager: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

let gaInjected = false;

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

function getGtag(): (...args: unknown[]) => void {
  if (typeof window === "undefined") return () => {};
  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer || [];
  if (!w.gtag) {
    w.gtag = (...args: unknown[]) => { (w.dataLayer as unknown[]).push(args); };
  }
  return w.gtag;
}

/**
 * Push a Google Consent Mode v2 update reflecting the user's choices.
 * Called on every consent save (and on bootstrap if a stored decision exists).
 */
function updateGoogleConsentMode(s: ConsentState) {
  const gtag = getGtag();
  gtag("consent", "update", {
    analytics_storage: s.analytics && s.cookies ? "granted" : "denied",
    ad_storage: s.ad_storage ? "granted" : "denied",
    ad_user_data: s.ad_user_data ? "granted" : "denied",
    ad_personalization: s.ad_personalization ? "granted" : "denied",
  });
}

function loadGoogleAnalytics() {
  if (typeof document === "undefined") return;
  const gtag = getGtag();
  // Ensure a previous withdrawal does not keep GA muted after re-grant.
  if (typeof window !== "undefined") {
    (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
  }
  if (gaInjected) {
    // Script already on the page — just re-issue config so subsequent events fire.
    gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
    return;
  }
  gaInjected = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
}

function disableGoogleAnalytics() {
  if (typeof window === "undefined") return;
  (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
}

export const ConsentProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<ConsentState>(DEFAULT_CONSENT);
  const [hasDecided, setHasDecided] = useState(false);
  const [loading, setLoading] = useState(true);
  const [managerOpen, setManagerOpen] = useState(false);
  const syncedForUserRef = useRef<string | null>(null);
  const [region, setRegion] = useState<Region>("UNKNOWN");

  useEffect(() => {
    setRegion(detectRegion());
  }, []);

  // Bootstrap from localStorage
  useEffect(() => {
    const stored = readStoredConsent();
    if (stored) {
      setState(stored.state);
      setHasDecided(true);
      applySideEffects(stored.state);
    }
    setLoading(false);
  }, []);

  // Sync with DB whenever auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const userId = session?.user?.id ?? null;
        if (!userId) return;
        if (syncedForUserRef.current === userId) return;
        syncedForUserRef.current = userId;

        // Load latest consents from DB and merge — DB wins if newer
        const { data } = await supabase.rpc("get_current_consents", {
          _user_id: userId,
        });
        const local = readStoredConsent();
        if (data && data.length > 0) {
          const next: ConsentState = { ...DEFAULT_CONSENT };
          data.forEach((row: any) => {
            next[row.category as ConsentCategory] = row.status === "granted";
          });
          next.account_service = true;
          setState(next);
          setHasDecided(true);
          writeStoredConsent(next);
          applySideEffects(next);
        } else if (local) {
          // Push local consents to DB for this user
          await persistConsents(userId, local.state, "signup");
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const applySideEffects = (s: ConsentState) => {
    // Always push a Consent Mode v2 update so Google tags see the latest choices.
    updateGoogleConsentMode(s);
    if (s.analytics && s.cookies) {
      loadGoogleAnalytics();
    } else {
      disableGoogleAnalytics();
    }
  };

  const persistConsents = async (
    userId: string,
    next: ConsentState,
    source: "signup" | "banner" | "settings"
  ) => {
    const rows = (Object.keys(next) as ConsentCategory[]).map((cat) => ({
      user_id: userId,
      category: cat,
      status: (next[cat] ? "granted" : "denied") as "granted" | "denied",
      consent_version: CONSENT_VERSION,
      consent_text: CONSENT_TEXT,
      source,
      region,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    }));
    await supabase.from("consent_records").insert(rows);
  };

  const save = useCallback(
    async (next: ConsentState, source: "signup" | "banner" | "settings" = "settings") => {
      const normalized = { ...next, account_service: true };
      setState(normalized);
      setHasDecided(true);
      writeStoredConsent(normalized);
      applySideEffects(normalized);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await persistConsents(user.id, normalized, source);
      }
    },
    []
  );

  const withdrawAll = useCallback(async () => {
    const next: ConsentState = { ...DEFAULT_CONSENT, account_service: true };
    await save(next, "settings");
  }, [save]);

  const value = useMemo<ConsentContextValue>(
    () => ({
      state,
      hasDecided,
      loading,
      region,
      strictMode: isStrictConsentRegion(region),
      save,
      withdrawAll,
      openManager: () => setManagerOpen(true),
      closeManager: () => setManagerOpen(false),
      managerOpen,
    }),
    [state, hasDecided, loading, save, withdrawAll, managerOpen, region]
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
};

export const useConsent = () => {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within ConsentProvider");
  return ctx;
};

export const hasConsent = (state: ConsentState, category: ConsentCategory) =>
  !!state[category];