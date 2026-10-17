import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "../globals.css";

import type { Metadata } from "next";
import { AuthProvider } from "@/components/admin/AuthProvider";

export const metadata: Metadata = {
  title: { default: "لوحة التحكم", template: "%s — لوحة التحكم" },
  robots: { index: false, follow: false },
};

/** The dashboard is a separate root layout: Arabic only, never indexed, rendered in the browser. */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-dvh antialiased" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
