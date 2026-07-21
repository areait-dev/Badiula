export type ConsentStatus = 'accepted' | 'rejected';

interface ConsentRecord {
  status: ConsentStatus;
  ts: number;
}

const STORAGE_KEY = 'badiula_cookie_consent';
const REPROMPT_AFTER_MS = 1000 * 60 * 60 * 24 * 182; // ~6 mesi
export const CONSENT_CHANGE_EVENT = 'badiula:cookie-consent-change';
export const OPEN_PREFERENCES_EVENT = 'badiula:open-cookie-preferences';

export function getConsent(): ConsentRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const record: ConsentRecord = JSON.parse(raw);
    if (Date.now() - record.ts > REPROMPT_AFTER_MS) return null;
    return record;
  } catch {
    return null;
  }
}

export function setConsent(status: ConsentStatus) {
  if (typeof window === 'undefined') return;
  const record: ConsentRecord = { status, ts: Date.now() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: record }));
}

export function openCookiePreferences() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}
