import posthog from "posthog-js"

const posthogProjectToken = process.env["NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN"]

if (posthogProjectToken) {
  posthog.init(posthogProjectToken, {
    api_host: process.env["NEXT_PUBLIC_POSTHOG_HOST"] ?? "/ph",
    defaults: "2026-01-30",
  })
}
