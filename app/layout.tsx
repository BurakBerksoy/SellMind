import type { Metadata } from "next";
import "./globals.css";
import { APP_TITLE, APP_DESCRIPTION } from "@/lib/constants";

export const metadata: Metadata = {
  title: APP_TITLE,
  description: APP_DESCRIPTION,
  openGraph: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    type: "website",
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_TITLE,
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
