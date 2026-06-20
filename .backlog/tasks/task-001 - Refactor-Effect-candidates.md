---
id: TASK-001
title: Refactor Effect candidates
status: To Do
assignee: []
created_date: '2026-06-20 14:28'
updated_date: '2026-06-20 15:03'
labels:
  - effect
  - refactor
dependencies: []
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Parent task for the Effect refactor work identified in the codebase audit. Each candidate is tracked as a direct child task so work can be implemented and reviewed independently.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Blog content loading uses Effect and Schema for filesystem, MDX, and frontmatter boundaries
- [ ] #2 Upstash views fetch candidate is completed or explicitly deferred
- [ ] #3 GitHub stargazers fetch candidate is completed or explicitly deferred
- [ ] #4 Cloudinary image placeholder candidate is completed or explicitly deferred
<!-- AC:END -->



## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Created completed child task TASK-001.01 for the blog Effect refactor. Replaced the grouped external-fetch container with direct child tasks TASK-001.03, TASK-001.04, and TASK-001.05.
<!-- SECTION:NOTES:END -->
