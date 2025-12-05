import type { Preferences } from "@/@types/preferences";

const DEFAULT_PREFERENCES: Preferences = {
  spellCheck: false,
  autoCorrect: false,
  theme: "auto",
  hideKeyboardShortcuts: false,
  fontFamily: "ui-monospace, monospace",
};

const STORAGE_KEY = "preferences";

export function getPreferences(): Preferences {
  if (typeof window === "undefined") {
    return DEFAULT_PREFERENCES;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return DEFAULT_PREFERENCES;
    }

    const parsed = JSON.parse(stored);
    return { ...DEFAULT_PREFERENCES, ...parsed };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function updatePreference(
  key: keyof Preferences,
  value: string | boolean
): void {
  const current = getPreferences();
  const updated = { ...current, [key]: value };

  // Store in localStorage
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  // Update document attributes for immediate effect
  if (typeof document !== "undefined") {
    if (key === "theme") {
      document.documentElement.setAttribute("data-theme", value as string);
    }
    if (key === "hideKeyboardShortcuts") {
      document.documentElement.setAttribute(
        "data-hide-keyboard-shortcuts",
        value ? "1" : "0"
      );
    }
  }
}

export { DEFAULT_PREFERENCES };
