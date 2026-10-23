import { defineConfig } from "vite-plus"

export default defineConfig({
  oxc: {
    jsx: { runtime: "automatic" },
  },
  test: {
    include: ["scripts/**/*.test.ts"],
  },
  fmt: {
    ignorePatterns: [".agents/skills/**"],
    semi: false,
    useTabs: false,
    tabWidth: 2,
    printWidth: 80,
  },
  lint: {
    plugins: ["nextjs"],
    categories: {
      correctness: "error",
      suspicious: "error",
      perf: "warn",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
})
