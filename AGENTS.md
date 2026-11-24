# Agent Instructions

## Key Conventions

- App code lives in `app/`.
- Content lives in `content/`.
- Draft MDX files are prefixed with `_`.
- Supports GitHub Flavored Markdown.
- Blog post headings start at `h2` and go through `h4`.
- Read TODO comments before making related changes.

## Tooling and validation

```sh
vp check
vp test run
vp run build
```

- Use the Vite+ and Bun versions declared in `package.json`.
- Bun manages dependencies only; Node.js runs tools and the application.
- Keep lint, format, and test settings in `vite.config.ts`. `vp check` runs type-aware linting and type checking instead of a standalone `tsc` command.
- Use `vp run dev`, `vp run build`, and `vp run start` for Next.js. Built-in `vp dev` and `vp build` run Vite instead.
- Keep agent workflows in `AGENTS.md`; keep `README.md` focused on human-facing development bootstrap instructions.

## Learning more about Effect

This repository uses the Effect TypeScript library. Use the latest Effect v4 release.

Before writing any Effect code, first read `node_modules/effect/AGENTS.md` **completely**, and follow the links in the file when required.

If you need to learn more about particular Effect APIs and concepts that the guide does not cover, search through the source code in `node_modules/effect/src`.

## Agent skills

### ui-sdk

- Before using ui-sdk, follow the `ui-sdk` skill if installed and read `node_modules/@ui-sdk/react/docs/llms.txt`.
- When building a new ui-sdk component, also search `node_modules/@ui-sdk/react/docs/core.md` by heading and read `node_modules/@ui-sdk/react/docs/rendering.md`.

### Issue tracker

Issues live in Linear. Use Linear MCP in the Citra workspace and Citra (TIF) team; default new issues to Backlog. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the five default triage labels. See `docs/agents/triage-labels.md`.

### Domain docs

Read applicable agent instructions and ADRs; this repo does not use `CONTEXT.md`. See `docs/agents/domain.md`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
