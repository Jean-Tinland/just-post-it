import type { Metadata } from "next";
import { cookies } from "next/headers";
import AppContextProvider from "@/components/app-context";
import * as API from "@/services/api";
import type { Mode } from "@/@types/view-mode";
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

  const preferences = await API.getPreferences(token);

  return (
    <html
      lang="en"
      data-theme={preferences.theme || "auto"}
      data-hide-keyboard-shortcuts={preferences.hideKeyboardShortcuts ?? "0"}
    >
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
