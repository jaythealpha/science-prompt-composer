import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import type { Language } from "@/lib/types";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jb",
  display: "swap",
});

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Science Prompt Composer";

export const metadata: Metadata = {
  title: {
    default: `${appName} — Turn complex science into visual prompts`,
    template: `%s · ${appName}`,
  },
  description:
    "Convert plain-language descriptions of scientific phenomena into high-quality scientific visualization prompts, explanations, labels, and infographic plans.",
  applicationName: appName,
  keywords: [
    "science",
    "prompt engineering",
    "AI image generation",
    "scientific visualization",
    "infographic",
    "education",
  ],
  authors: [{ name: appName }],
  openGraph: {
    title: `${appName} — Turn complex science into visual prompts`,
    description:
      "Generate scientific explanations, visual structure, labels, and production-ready image prompts.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f9fc" },
    { media: "(prefers-color-scheme: dark)", color: "#060b16" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("spc-lang")?.value;
  const initialLang: Language =
    cookieLang === "ko" || cookieLang === "ja" ? cookieLang : "en";

  return (
    <html lang={initialLang} suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} min-h-dvh antialiased`}>
        <Providers initialLang={initialLang}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Skip to main content
          </a>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
