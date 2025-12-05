"use client";

import * as React from "react";
import { SnackbarProvider } from "jt-design-system/es/snackbar";
import * as Cookies from "@/services/cookies";
import * as PreferencesService from "@/services/preferences";
import type { Mode } from "@/@types/view-mode";
import type { Preferences } from "@/@types/preferences";
import AppLoader from "./app-loader";

type ContextUser = {
  token: string;
};

type AppContextType = {
  user: ContextUser;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  viewMode: "free" | "grid";
  updateViewMode: (newMode: Mode) => void;
  currentCategory: number | null;
  updateCurrentCategory: (newCategory: number | null) => void;
  preferences: Preferences;
  updatePreferences: (prefs: Preferences) => void;
};

const AppContext = React.createContext<AppContextType>({
  user: { token: "" },
  loading: false,
  setLoading: () => {},
  viewMode: "free",
  updateViewMode: () => {},
  currentCategory: null,
  updateCurrentCategory: () => {},
  preferences: PreferencesService.DEFAULT_PREFERENCES,
  updatePreferences: () => {},
});

export function useAppContext() {
  const context = React.use(AppContext);
  if (!context)
    throw new Error(`useAppContext must be used within a AppContextProvider`);
  return context;
}

type Props = {
  user: ContextUser;
  defaultViewMode: "free" | "grid";
  defaultCategory: number | null;
  children: React.ReactNode;
};

export default function AppContextProvider({
  user,
  defaultViewMode,
  defaultCategory,
  children,
}: Props) {
  const [viewMode, setViewMode] = React.useState(defaultViewMode);
  const [currentCategory, setCurrentCategory] = React.useState(defaultCategory);
  const [loading, setLoading] = React.useState(false);
  const [preferences, setPreferences] = React.useState<Preferences>(
    PreferencesService.DEFAULT_PREFERENCES
  );

  const updateViewMode = React.useCallback((newMode: Mode) => {
    setViewMode(newMode);
    Cookies.set("viewMode", newMode, 360);
  }, []);

  const updateCurrentCategory = React.useCallback(
    (newCategory: number | null) => {
      setCurrentCategory(newCategory);
      if (newCategory) {
        Cookies.set("currentCategory", newCategory.toString(), 360);
      } else {
        Cookies.remove("currentCategory");
      }
    },
    []
  );

  const updatePreferences = React.useCallback((prefs: Preferences) => {
    setPreferences(prefs);
  }, []);

  return (
    <AppContext
      value={{
        user,
        loading,
        setLoading,
        viewMode,
        updateViewMode,
        currentCategory,
        updateCurrentCategory,
        preferences,
        updatePreferences,
      }}
    >
      <SnackbarProvider>
        {children}
        <AppLoader loading={loading} />
      </SnackbarProvider>
    </AppContext>
  );
}
