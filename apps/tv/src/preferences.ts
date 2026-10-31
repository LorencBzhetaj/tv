import type { Locale } from './locales';
export type ViewMode = 'full' | 'standard';
export interface Preferences { locale: Locale; viewMode: ViewMode }
export interface PreferenceStorage { getItem(key: string): string | null; setItem(key: string, value: string): void }
const key = 'lori-tv.preferences.v1';
export function readPreferences(storage?: PreferenceStorage): Preferences {
  try {
    const value: unknown = JSON.parse(storage?.getItem(key) ?? 'null');
    if (value && typeof value === 'object') {
      const p = value as Record<string, unknown>;
      return { locale: p.locale === 'sq' ? 'sq' : 'en', viewMode: p.viewMode === 'standard' ? 'standard' : 'full' };
    }
  } catch { /* Corrupt/unavailable storage must not prevent local boot. */ }
  return { locale: 'en', viewMode: 'full' };
}
export function savePreferences(storage: PreferenceStorage | undefined, value: Preferences): boolean {
  try { if (!storage) return false; storage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}
export function viewportMetrics(width: number, height: number): { scale: number; safe: number } {
  const ratio = Math.min(Math.max(1, width) / 1600, Math.max(1, height) / 900);
  return { scale: Math.max(0.65, Math.min(ratio, 2.4)), safe: Math.max(16, Math.ceil(48 * ratio)) };
}
