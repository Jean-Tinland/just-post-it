import type { Theme } from "@/@types/theme";

export type Preferences = {
  spellCheck: boolean;
  autoCorrect: boolean;
  theme: Theme;
  hideKeyboardShortcuts: boolean;
  fontFamily: string;
};
