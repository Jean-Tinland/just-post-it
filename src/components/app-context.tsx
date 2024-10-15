"use client";

import * as React from "react";
import Loader from "dt-design-system/es/loader";
import { SnackbarProvider } from "dt-design-system/es/snackbar";
import * as Cookies from "@/services/cookies";
import type { Mode } from "@/@types/view-mode";
import styles from "./app-context.module.css";

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
};

const AppContext = React.createContext<AppContextType>({
  user: { token: "" },
  loading: false,
  setLoading: () => {},
  viewMode: "free",
  updateViewMode: () => {},
  currentCategory: null,
  updateCurrentCategory: () => {},
});

export function useAppContext() {
  const context = React.useContext(AppContext);
  if (!context)
    throw new Error(`useSiteContext must be used within a SiteContextProvider`);
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
    <AppContext.Provider
      value={{
        user,
        loading,
        setLoading,
        viewMode,
        updateViewMode,
        currentCategory,
        updateCurrentCategory,
      }}
    >
      <SnackbarProvider>
        {children}
        {loading && <Loader variant="bar" className={styles.loader} />}
      </SnackbarProvider>
    </AppContext.Provider>
  );
}
