import type { Metadata } from "next";
import { cookies } from "next/headers";
import Favicons from "@/components/favicons";
import AppContextProvider from "@/components/app-context";
import PreferencesInitializer from "@/components/preferences-initializer";
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

  return (
    <html lang="en" data-theme="auto" data-hide-keyboard-shortcuts="0">
      <head>
        <Favicons />
      </head>
      <body>
        <AppContextProvider
          user={{ token }}
          defaultViewMode={viewMode}
          defaultCategory={currentCategory ? Number(currentCategory) : null}
        >
          <PreferencesInitializer />
          {children}
        </AppContextProvider>
      </body>
    </html>
  );
}
