/** @type {import("next").NextConfig} */
const config = {
  reactCompiler: true,
  serverExternalPackages: ["sharp"],
  experimental: {
    typedEnv: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "abs.twimg.com" },
    ],
    loader: "custom",
    loaderFile: "./app/loader.js",
  },
  async redirects() {
    return [
      {
        source: "/analytics",
        destination:
          "https://analytics.tifan.me/share/dHm1BNZCKGcLOy6g/tifan.me",
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/gpg",
        destination: "https://github.com/tifandotme.gpg",
      },
      {
        source: "/resume",
        destination: "https://resume.tifan.me/resume.pdf",
      },
    ]
  },
  async headers() {
    return [
      {
        source: "/:all*(ttf|otf|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // To allow for loading /giscus.css in development mode
          ...(process.env.NODE_ENV === "development"
            ? [
                {
                  key: "Access-Control-Allow-Origin",
                  value: "*",
                },
              ]
            : []),
        ],
      },
    ]
  },
}

export default config
