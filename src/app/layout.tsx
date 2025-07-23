import type { Metadata } from "next";
import { cookies } from "next/headers";
import Favicons from "@/components/favicons";
import AppContextProvider from "@/components/app-context";
import FontFamily from "@/components/font-family";
import * as API from "@/services/api";
import type { Mode } from "@/@types/view-mode";
import type { Preferences } from "@/@types/preferences";
import "./globals.css";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Just Post-It",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value as string;
  const viewMode = (cookieStore.get("viewMode")?.value || "free") as Mode;
  const currentCategory = cookieStore.get("currentCategory")?.value as string;

  const preferences: Preferences = await API.getPreferences(token);

  return (
    <html
      lang="en"
      data-theme={preferences.theme || "auto"}
      data-hide-keyboard-shortcuts={preferences.hideKeyboardShortcuts ?? "0"}
    >
      <head>
        <Favicons />
        <FontFamily fontFamily={preferences.fontFamily} />
      </head>
      <body>
        <AppContextProvider
          user={{ token }}
          defaultViewMode={viewMode}
          defaultCategory={currentCategory ? Number(currentCategory) : null}
          preferences={preferences}
        >
          {children}
        </AppContextProvider>
      </body>
    </html>
  );
}
