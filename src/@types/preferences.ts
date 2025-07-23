import type { Theme } from "@/@types/theme";

export type Preferences = {
  spellCheck: "0" | "1";
  autoCorrect: "0" | "1";
  theme: Theme;
  hideKeyboardShortcuts: "0" | "1";
  fontFamily: string;
};
