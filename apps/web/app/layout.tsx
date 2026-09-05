import "@xforge/design/globals.css";
import { cn } from "@xforge/design/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono as GeistMono } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  description: "Afenda xForge",
  title: { default: "Afenda xForge", template: "%s · Afenda xForge" },
};

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

const geistMono = GeistMono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      className={cn(
        "antialiased",
        geistMono.variable,
        "font-sans",
        geist.variable
      )}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
