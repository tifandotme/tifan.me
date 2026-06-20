---
id: TASK-001.03
title: Refactor GitHub stargazers fetch to Effect
status: To Do
assignee: []
created_date: '2026-06-20 15:03'
labels:
  - effect
  - github
dependencies: []
modified_files:
  - app/(home)/projects/github.ts
parent_task_id: TASK-1
ordinal: 11000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Refactor app/(home)/projects/github.ts so GitHub stargazer loading uses Effect for configuration, URL parsing, HTTP failure handling, response decoding, and fallback behavior.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 GitHub token configuration is validated without non-null assertions
- [ ] #2 Repo URL parsing, fetch failures, and non-OK responses are represented as typed Effect errors
- [ ] #3 The GitHub JSON response is decoded without unchecked casts
- [ ] #4 fetchStargazersCount keeps the current public behavior of returning a number with 0 as fallback
- [ ] #5 Relevant lint, typecheck, and build checks pass
<!-- AC:END -->
