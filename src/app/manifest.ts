import type { MetadataRoute } from "next";
import { cookies } from "next/headers";
import * as API from "@/services/api";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value as string;

  const preferences = await API.getPreferences(token);

  const themeColor = preferences.theme === "light" ? "#fff" : "#000";

  return {
    name: "Just Post-It",
    description: "A simple note-taking app working with post-it",
    id: "/",
    scope: "/",
    start_url: "/",
    display: "standalone",
    icons: [
      {
        src: "/images/favicon/android-chrome-512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
      {
        src: "/images/favicon/android-chrome-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        src: "/images/favicon/favicon-196x196.png",
        type: "image/png",
        sizes: "196x196",
      },
      {
        src: "/images/favicon/favicon-96x96.png",
        type: "image/png",
        sizes: "96x96",
      },
      {
        src: "/images/favicon/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        src: "/images/favicon/favicon-16x16.png",
        type: "image/png",
        sizes: "16x16",
      },
      {
        src: "/images/favicon/favicon-128.png",
        type: "image/png",
        sizes: "128x128",
      },
    ],
    background_color: themeColor,
    theme_color: themeColor,
  };
}
