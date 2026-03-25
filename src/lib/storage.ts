// ============================================================
// localStorage utility for revela history
// ============================================================

export interface HistoryEntry {
  id: string;
  date: string;
  mbti?: string;
  trueSelfMbti?: string;
  loveType?: string;
  zodiac?: string;
  tarot?: string;
  isReversed?: boolean;
  description?: string;
}

const HISTORY_KEY = "revela_history";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function saveHistoryEntry(entry: Omit<HistoryEntry, "id">): HistoryEntry {
  const newEntry: HistoryEntry = { id: generateId(), ...entry };
  const existing = getHistory();
  const updated = [newEntry, ...existing].slice(0, 50); // Keep last 50
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
  return newEntry;
}

export function deleteHistoryEntry(id: string): void {
  const existing = getHistory();
  const updated = existing.filter((e) => e.id !== id);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Ignore storage errors
  }
}

// Zodiac sign localStorage
const ZODIAC_KEY = "revela_zodiac";

export function getSavedZodiac(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ZODIAC_KEY);
  } catch {
    return null;
  }
}

export function saveZodiac(zodiac: string): void {
  try {
    localStorage.setItem(ZODIAC_KEY, zodiac);
  } catch {
    // Ignore storage errors
  }
}

// Color diagnosis localStorage
const COLOR_KEY = "revela_color";

export function getSavedColor(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(COLOR_KEY);
  } catch {
    return null;
  }
}

export function saveColor(colorId: string): void {
  try {
    localStorage.setItem(COLOR_KEY, colorId);
  } catch {
    // Ignore storage errors
  }
}

// MBTI localStorage
const MBTI_KEY = "revela_mbti";

export function getSavedMBTI(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(MBTI_KEY);
  } catch {
    return null;
  }
}

export function saveMBTI(mbtiType: string): void {
  try {
    localStorage.setItem(MBTI_KEY, mbtiType);
  } catch {
    // Ignore storage errors
  }
}
