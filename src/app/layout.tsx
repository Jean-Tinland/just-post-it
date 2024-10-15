import type { Metadata } from "next";
import { cookies } from "next/headers";
import AppContextProvider from "@/components/app-context";
import type { Mode } from "@/@types/view-mode";
import "./globals.css";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Just Post-It",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allCookies = cookies();
  const token = allCookies.get("token")?.value as string;
  const viewMode = (allCookies.get("viewMode")?.value || "free") as Mode;
  const currentCategory = allCookies.get("currentCategory")?.value as string;

  return (
    <html lang="en">
      <body>
        <AppContextProvider
          user={{ token }}
          defaultViewMode={viewMode}
          defaultCategory={currentCategory ? Number(currentCategory) : null}
        >
          {children}
        </AppContextProvider>
      </body>
    </html>
  );
}
