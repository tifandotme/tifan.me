---
id: TASK-001.01
title: Refactor blog content pipeline to Effect
status: Done
assignee: []
created_date: '2026-06-20 14:28'
updated_date: '2026-06-20 14:28'
labels:
  - effect
  - blog
  - done
dependencies: []
modified_files:
  - app/_lib/blog.ts
  - package.json
  - bun.lock
  - .gitignore
  - scripts/prepare-effect.sh
parent_task_id: TASK-1
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Convert the blog content pipeline in app/_lib/blog.ts from ad hoc promises, unchecked frontmatter casts, and thrown validation errors to Effect-based workflows with schema-backed frontmatter validation and typed errors.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Frontmatter is decoded with an Effect Schema instead of an unchecked cast
- [x] #2 Filesystem, MDX evaluation, and validation failures are represented as typed Effect errors
- [x] #3 getAllPosts and getPostBySlug preserve their public async APIs for Next.js callers
- [x] #4 shellcheck scripts/prepare-effect.sh, bun run lint, bun run typecheck, and bun run build pass
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented Effect refactor in app/_lib/blog.ts. Added effect@beta plus the local Effect source bootstrap required for agent research. Replaced unchecked frontmatter casting and thrown validation errors with Schema decoding and typed Effect errors.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Refactored the blog content pipeline to Effect.

Changes:
- Added effect@beta and local Effect source bootstrap support.
- Reworked app/_lib/blog.ts around Effect.fn, Effect.gen, Effect.tryPromise, Effect.all, and Schema decoding.
- Added schema-backed typed errors for content directory, content file, and frontmatter failures.
- Preserved the public async getAllPosts and getPostBySlug APIs used by Next.js callers.

Validation:
- shellcheck scripts/prepare-effect.sh
- bun run lint
- bun run typecheck
- bun run build
<!-- SECTION:FINAL_SUMMARY:END -->
