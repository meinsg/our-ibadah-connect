// EU/EEA + UK timezone-based detection. No external API, no IP storage.
// Used purely to decide which consent UX to show — strict opt-in vs simplified.

const EU_EEA_UK_TIMEZONES = new Set<string>([
  // EU 27
  "Europe/Vienna", "Europe/Brussels", "Europe/Sofia", "Europe/Zagreb",
  "Asia/Famagusta", "Asia/Nicosia", "Europe/Prague", "Europe/Copenhagen",
  "Europe/Tallinn", "Europe/Helsinki", "Europe/Paris", "Europe/Berlin",
  "Europe/Busingen", "Europe/Athens", "Europe/Budapest", "Europe/Dublin",
  "Europe/Rome", "Europe/Riga", "Europe/Vilnius", "Europe/Luxembourg",
  "Europe/Malta", "Europe/Amsterdam", "Europe/Warsaw", "Europe/Lisbon",
  "Atlantic/Azores", "Atlantic/Madeira", "Europe/Bucharest", "Europe/Bratislava",
  "Europe/Ljubljana", "Europe/Madrid", "Africa/Ceuta", "Atlantic/Canary",
  "Europe/Stockholm",
  // EEA extras
  "Europe/Oslo", "Atlantic/Reykjavik", "Europe/Vaduz",
  // UK
  "Europe/London", "Europe/Belfast", "Europe/Guernsey", "Europe/Isle_of_Man",
  "Europe/Jersey", "Europe/Gibraltar",
]);

export type Region = "EU" | "NON_EU" | "UNKNOWN";

export function detectRegion(): Region {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return "UNKNOWN";
    if (EU_EEA_UK_TIMEZONES.has(tz)) return "EU";
    // Language hint as soft signal
    const lang = (typeof navigator !== "undefined" ? navigator.language : "") || "";
    if (/-(?:AT|BE|BG|HR|CY|CZ|DK|EE|FI|FR|DE|GR|HU|IE|IT|LV|LT|LU|MT|NL|PL|PT|RO|SK|SI|ES|SE|NO|IS|LI|GB|UK)$/i.test(lang)) {
      return "EU";
    }
    return "NON_EU";
  } catch {
    return "UNKNOWN";
  }
}

export const isStrictConsentRegion = (r: Region) => r === "EU" || r === "UNKNOWN";