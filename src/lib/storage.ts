import { historyArraySchema } from "./schema";
import type { GenerationResult, GenerationSettings, HistoryEntry } from "./types";

const HISTORY_KEY = "spc.history.v1";
const SETTINGS_KEY = "spc.settings.v1";
const MAX_ENTRIES = 20;

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function generateId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = safeParse<unknown>(window.localStorage.getItem(HISTORY_KEY));
    const validated = historyArraySchema.safeParse(parsed);
    if (validated.success) return validated.data;
    // Corrupted data — clear it so the app recovers gracefully.
    window.localStorage.removeItem(HISTORY_KEY);
    return [];
  } catch {
    return [];
  }
}

function persistHistory(entries: HistoryEntry[]): HistoryEntry[] {
  if (typeof window === "undefined") return entries;
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch {
    /* storage may be full or unavailable — ignore */
  }
  return entries;
}

export function addHistoryEntry(
  input: string,
  settings: GenerationSettings,
  result: GenerationResult,
): HistoryEntry[] {
  const existing = loadHistory();
  const entry: HistoryEntry = {
    id: generateId(),
    createdAt: Date.now(),
    input,
    settings,
    result,
    favorite: false,
  };
  // Keep favorites even beyond the cap, then fill remaining slots with recents.
  const combined = [entry, ...existing];
  const favorites = combined.filter((e) => e.favorite);
  const nonFavorites = combined.filter((e) => !e.favorite);
  const trimmed = [
    ...favorites,
    ...nonFavorites.slice(0, Math.max(MAX_ENTRIES - favorites.length, 0)),
  ];
  return persistHistory(trimmed);
}

export function toggleFavorite(id: string): HistoryEntry[] {
  const entries = loadHistory().map((e) =>
    e.id === id ? { ...e, favorite: !e.favorite } : e,
  );
  return persistHistory(entries);
}

export function deleteHistoryEntry(id: string): HistoryEntry[] {
  return persistHistory(loadHistory().filter((e) => e.id !== id));
}

export function clearHistory(): HistoryEntry[] {
  return persistHistory([]);
}

export function loadSettings(): Partial<GenerationSettings> | null {
  if (typeof window === "undefined") return null;
  try {
    return safeParse<Partial<GenerationSettings>>(window.localStorage.getItem(SETTINGS_KEY));
  } catch {
    return null;
  }
}

export function saveSettings(settings: GenerationSettings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* ignore */
  }
}
