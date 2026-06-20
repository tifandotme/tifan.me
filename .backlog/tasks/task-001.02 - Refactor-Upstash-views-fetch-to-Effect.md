---
id: TASK-001.02
title: Refactor Upstash views fetch to Effect
status: To Do
assignee: []
created_date: '2026-06-20 15:03'
labels:
  - effect
  - upstash
dependencies: []
modified_files:
  - app/_components/redis.ts
parent_task_id: TASK-1
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Refactor app/_components/redis.ts so the Upstash views request uses Effect for configuration, HTTP failure handling, response decoding, and caller-facing fallback behavior.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Upstash environment configuration is validated without non-null assertions
- [ ] #2 Fetch and non-OK responses are represented as typed Effect errors
- [ ] #3 The Upstash JSON response is decoded without unchecked casts
- [ ] #4 fetchViews keeps the current public behavior of returning a number or null
- [ ] #5 Relevant lint, typecheck, and build checks pass
<!-- AC:END -->
