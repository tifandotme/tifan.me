import { PostHogPageView, PostHogProvider } from "@posthog/next"
import type { Metadata } from "next"
import { Suspense } from "react"
import { fonts } from "./_lib/fonts"
import "./globals.css"
import { PreloadResources } from "./preload"
import { SandPackCSS } from "./sandpack-css"

export const metadata: Metadata = {
  metadataBase: new URL(`https://tifan.me`),
  title: {
    template: "%s — Tifan Dwi Avianto",
    default: "Tifan Dwi Avianto — Software Engineer",
  },
  description: "Developer blog to level up your software engineering skills.",
  openGraph: {
    title: "Tifan Dwi Avianto",
    description: "Developer blog to level up your software engineering skills.",
    type: "website",
    images: "/og",
    locale: "en_US",
    url: "https://tifan.me",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@tifandotme",
    images: "/og",
  },
  keywords: [
    "tifan dwi avianto",
    "tifan",
    "tifandotme",
    "portfolio",
    "blog",
    "personal site",
  ],
  creator: "Tifan Dwi Avianto",
  other: { "darkreader-lock": "_" },
}

export default function RootLayout({ children }: React.PropsWithChildren) {
  const posthogKey = process.env["NEXT_PUBLIC_POSTHOG_KEY"]

  return (
    <html lang="en" className={fonts.map((font) => font.variable).join(" ")}>
      <head>
        <SandPackCSS />
      </head>
      <body>
        {posthogKey ? (
          <PostHogProvider
            apiKey={posthogKey}
            clientOptions={{ api_host: "/ph" }}
          >
            <Suspense fallback={null}>
              <PostHogPageView />
            </Suspense>
            {children}
          </PostHogProvider>
        ) : (
          children
        )}
        <PreloadResources />
        <noscript>
          <style>{`.no-js {display: none;}`}</style>
        </noscript>
      </body>
    </html>
  )
}
