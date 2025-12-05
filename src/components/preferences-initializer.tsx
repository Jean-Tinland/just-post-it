"use client";

import { useEffect } from "react";
import { useAppContext } from "@/components/app-context";
import * as PreferencesService from "@/services/preferences";

export default function PreferencesInitializer() {
  const { updatePreferences } = useAppContext();

  useEffect(() => {
    const preferences = PreferencesService.getPreferences();
    updatePreferences(preferences);

    document.documentElement.setAttribute(
      "data-theme",
      preferences.theme || "auto"
    );
    document.documentElement.setAttribute(
      "data-hide-keyboard-shortcuts",
      preferences.hideKeyboardShortcuts ? "1" : "0"
    );

    // Dynamically inject font family style
    const existingStyle = document.getElementById("dynamic-font-family");
    if (existingStyle) {
      existingStyle.remove();
    }

    let value = "var(--default-font)";

    if (preferences.fontFamily?.trim().length > 0) {
      value = `${preferences.fontFamily}, var(--default-font)`;
    }

    const style = Object.assign(document.createElement("style"), {
      id: "dynamic-font-family",
      textContent: `
      :root {
        --content-font: ${value}; 
      }
    `,
    });
    document.head.appendChild(style);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
