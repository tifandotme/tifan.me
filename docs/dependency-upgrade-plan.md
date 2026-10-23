# Dependency upgrade

Registry check: 22 October 2026. Targets are stable npm releases, not canary,
beta, or release-candidate tags. Recheck the registry before implementation.
All direct dependencies are pinned to exact versions below. Transitive
dependencies are refreshed within their parents' supported ranges. The Node
types stay on the latest 24.x release to match the runtime.

## Runtime

Use Node.js 24.22.1, the latest 24.x release in the official release index.
Next.js 16.4.2 requires Node >=20.9.0;
Vite+ 1.3.0 requires ^22.18.0, ^24.11.0, or >=26.0.0; `cn` requires >=22.
Node 24.22.1 satisfies all three.

`package.json` pins `devEngines.runtime` to 24.22.1 and requires
`engines.node >=24.22.1 <25`. CI and the README select 24.22.1. Keep these
values together when a newer Node 24 patch is released. `@types/node` uses
the newest 24.x release instead of 26.x types for unavailable runtime APIs.
Verify Vercel's effective build and function runtime before deployment. Do not
change a shared project setting or trigger a deployment as part of this plan.

Keep Bun 1.4.4 for dependency management. Use `vp env exec` as shown below
to avoid older system executables. Node runs tools and the application.

## Every declared dependency

Before versions come from the original `node_modules`. Target versions are
now installed and pinned in the manifest. No direct dependency uses a caret,
tilde, broad major, or floating `latest` specifier.

| Package                       | Before                             | Target   | Action                                   |
| ----------------------------- | ---------------------------------- | -------- | ---------------------------------------- |
| `@codesandbox/sandpack-react` | 2.20.0                             | 2.20.0   | Keep; exercise editor                    |
| `@giscus/react`               | 3.1.0                              | 3.1.0    | Keep; exercise production embed          |
| `@hcaptcha/react-hcaptcha`    | 2.0.2                              | 2.2.0    | Update; check email unlock               |
| `@mdx-js/mdx`                 | 3.1.1                              | 3.1.1    | Keep; rebuild MDX                        |
| `@posthog/nextjs-config`      | 1.9.37                             | 1.11.5   | Update with PostHog SDK                  |
| `@radix-ui/react-dialog`      | 1.1.15                             | 1.3.1    | Update; check desktop contents dialog    |
| `cn`                          | 0.5.0                              | 0.5.0    | Added; replaces local helper             |
| `effect`                      | 4.0.5                              | 4.0.5    | Keep latest stable v4                    |
| `next`                        | 16.4.2                             | 16.4.2   | Already latest stable; no canary upgrade |
| `posthog-js`                  | 1.376.3                            | 1.438.15 | Update with Next.js integration          |
| `react`                       | 19.0.0                             | 19.3.1   | Update with React DOM                    |
| `react-dom`                   | 19.0.0                             | 19.3.1   | Match React exactly                      |
| `react-tweet`                 | 3.3.0                              | 3.3.1    | Update; check embedded tweet             |
| `vaul`                        | 1.1.2                              | 1.1.2    | Keep; check mobile contents drawer       |
| `vfile`                       | 6.0.3                              | 6.0.3    | Keep                                     |
| `vfile-matter`                | 5.0.1                              | 5.0.1    | Keep                                     |
| `@shikijs/rehype`             | 4.1.0                              | 4.5.0    | Update with transformers                 |
| `@shikijs/transformers`       | 4.1.0                              | 4.5.0    | Match Shiki version                      |
| `@tailwindcss/postcss`        | 4.3.0                              | 4.3.3    | Update with Tailwind                     |
| `@tsconfig/next`              | 2.0.6                              | 2.0.6    | Keep                                     |
| `@tsconfig/strictest`         | 2.0.8                              | 2.0.8    | Keep                                     |
| `@types/node`                 | 24.12.4                            | 24.19.2  | Latest matching runtime major            |
| `@types/react`                | 19.0.8                             | 19.3.0   | Update with React                        |
| `@types/react-dom`            | 19.0.3                             | 19.3.0   | Update with React DOM                    |
| `babel-plugin-react-compiler` | 19.0.0-beta-bafa41b-20250307       | 1.0.0    | Pin stable release                       |
| `rehype-autolink-headings`    | 7.1.0                              | 7.1.0    | Keep                                     |
| `rehype-external-links`       | 3.0.0                              | 3.0.0    | Keep                                     |
| `rehype-slug`                 | 6.0.0                              | 6.0.0    | Keep                                     |
| `remark-gfm`                  | 4.0.1                              | 4.0.1    | Keep                                     |
| `tailwindcss`                 | 4.3.0                              | 4.3.3    | Update with PostCSS integration          |
| `typescript`                  | 6.0.3                              | 7.0.2    | Separate compatibility step              |
| `vite` alias                  | @voidzero-dev/vite-plus-core 1.3.0 | Same     | Preserve alias and override              |
| `vite-plus`                   | 1.3.0                              | 1.3.0    | Already latest stable                    |

The `vite` entry intentionally points at Vite+'s core. Do not replace it with
the independently published `vite@8.3.5`. Update the alias, override, and
Vite+ together when that toolchain releases an update.

## Procedure for future upgrades

1. Establish a passing baseline with the commands below and Bun 1.4.4.
2. Update React, React DOM, their types, and the compiler together. Use
   exact stable versions in the manifest. Keep Next.js at 16.4.2 unless a
   newer stable release exists when implementation starts.
3. Update the PostHog packages together: integration 1.11.5 requires
   `posthog-js >=1.438.5`. Check both the ordinary build and the configured
   source-map integration; placeholder public variables do not exercise the
   credential-dependent wrapper in `next.config.js`.
4. Update hCaptcha, Radix Dialog, react-tweet, Shiki, and Tailwind in their
   groups. Validate after each group so failures have a small search area.
5. Upgrade TypeScript to 7.0.2. Next.js 16.4.2 ships a CLI type-check path
   (`experimental.useTypeScriptCli`), enabled by default in its config. Its
   older compiler-API path rejects TypeScript packages without that API.
   Verify the stable TypeScript 7 package works with the build, MDX tooling,
   and Vite+'s full type-aware checks. Fix actual incompatibilities without
   disabling checks or adding a standalone `tsc` workflow. Report a concrete
   blocker if this group cannot pass; do not call a partial upgrade complete.
6. Refresh the entire lockfile, including transitive dependencies. Recheck
   engine and peer requirements and inspect the lockfile diff. Preserve the
   required Vite+ override. A package already at its latest release is still
   in scope for transitive refresh and validation.

Do not remove an existing package solely because it has no newer release.
GitHub Actions and the globally installed Vercel CLI have separate release
and pinning policies; review their versions during implementation without
changing deployment behavior or running `deploy:prod`.

## `cn` decision

Use named imports directly from `cn@0.5.0`; remove the local helper and its
now-unnecessary nullish fallback. No shadcn component installation, Next.js
plugin, generated tables, or `clsx`/`tailwind-merge` dependencies are needed.

The old helper joined strings. The package also resolves Tailwind conflicts,
so later overrides win. This fits existing base-plus-override calls in copy
buttons, view counters, and the contents drawer. Semantic color utilities
(`text-muted`, `text-foreground`), responsive/data variants, and Tailwind 4
important suffixes are supported. Empty results are `""` instead of
`undefined`; the inspected callers use the result only as `className`.

The package adds a runtime dependency where the old helper needed none. Its
benefit here is standard, typed conflict resolution and removal of local
helper code, not a claimed application performance gain. Render the affected
blog controls at desktop and mobile widths to check the changed semantics.

## Acceptance checks

```sh
vp env exec --node 24.22.1 --package-manager bun@1.4.4 vp install --frozen-lockfile
vp env exec --node 24.22.1 --package-manager bun@1.4.4 vp check
vp env exec --node 24.22.1 --package-manager bun@1.4.4 vp test run
NEXT_PUBLIC_EMAIL=ci@example.invalid NEXT_PUBLIC_HCAPTCHA_SITE_KEY=ci-placeholder vp env exec --node 24.22.1 --package-manager bun@1.4.4 vp run build
git diff --check
```

Confirm the install actually uses Bun 1.4.4. Keep Vite+'s formatting, linting,
and full type checking enabled. Build success must include static generation,
not only compilation.

Select both runtime and package manager explicitly. In system-first mode,
the system package manager's directory can otherwise shadow the selected
Node executable.

In a local browser, check home, About, Projects, and a blog post. Exercise
desktop contents dialog open/close, mobile drawer and its scrolled state,
copy-code feedback, syntax highlighting, MDX layout, and light/dark colors.
Use existing content or temporary local fixtures for tweet, Sandpack, and
full-width MDX coverage, then remove temporary fixtures. Real hCaptcha,
PostHog ingestion/source maps, and production Giscus need their configured
environment; record those checks separately from placeholder builds.

Keep the change local until push/deployment is explicitly authorized.

## Sources

- npm package metadata: `https://registry.npmjs.org/<package>` (including
  dist-tags, engines, and peer dependencies).
- [Official Node.js release index](https://nodejs.org/dist/index.json).
- [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16).
- Installed Next.js 16.4.2: `node_modules/next/package.json`,
  `node_modules/next/dist/lib/verify-typescript-setup.js`, and
  `node_modules/next/dist/server/config-shared.d.ts`.
- [shadcn-ui/cn release source](https://github.com/shadcn-ui/cn/tree/8ebcbf09d1a3355c235295e804a6126f6f2f069a).
- [`cn@0.5.0` metadata](https://registry.npmjs.org/cn/0.5.0).
