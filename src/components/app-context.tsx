"use client";

import * as React from "react";
import { SnackbarProvider } from "jt-design-system/es/snackbar";
import * as Cookies from "@/services/cookies";
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
};

const AppContext = React.createContext<AppContextType>({
  user: { token: "" },
  loading: false,
  setLoading: () => {},
  viewMode: "free",
  updateViewMode: () => {},
  currentCategory: null,
  updateCurrentCategory: () => {},
  preferences: {
    spellCheck: "0",
    autoCorrect: "0",
    theme: "auto",
    hideKeyboardShortcuts: "0",
    fontFamily: "ui-monospace, monospace",
  },
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
  preferences: Preferences;
  children: React.ReactNode;
};

export default function AppContextProvider({
  user,
  defaultViewMode,
  defaultCategory,
  preferences,
  children,
}: Props) {
  const [viewMode, setViewMode] = React.useState(defaultViewMode);
  const [currentCategory, setCurrentCategory] = React.useState(defaultCategory);
  const [loading, setLoading] = React.useState(false);

  const updateViewMode = (newMode: Mode) => {
    setViewMode(newMode);
    Cookies.set("viewMode", newMode, 360);
  };

  const updateCurrentCategory = (newCategory: number | null) => {
    setCurrentCategory(newCategory);
    if (newCategory) {
      Cookies.set("currentCategory", newCategory.toString(), 360);
    } else {
      Cookies.remove("currentCategory");
    }
  };

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
      }}
    >
      <SnackbarProvider>
        {children}
        <AppLoader loading={loading} />
      </SnackbarProvider>
    </AppContext>
  );
}
