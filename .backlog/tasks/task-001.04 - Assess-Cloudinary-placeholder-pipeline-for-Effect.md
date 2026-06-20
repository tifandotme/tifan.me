---
id: TASK-001.04
title: Assess Cloudinary placeholder pipeline for Effect
status: To Do
assignee: []
created_date: '2026-06-20 15:03'
labels:
  - effect
  - cloudinary
dependencies: []
modified_files:
  - app/_components/cloudinary-image.tsx
parent_task_id: TASK-1
ordinal: 12000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Assess app/_components/cloudinary-image.tsx and either refactor the remote image fetch plus plaiceholder generation pipeline to Effect or document why plain async remains the better fit.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Remote Cloudinary fetch failures and non-OK responses are handled explicitly
- [ ] #2 Plaiceholder generation failures are represented with typed errors if Effect is introduced
- [ ] #3 CloudinaryImage keeps the current React fallback behavior of returning null on failure
- [ ] #4 If Effect is not introduced, the task records the reason and any smaller cleanup performed
- [ ] #5 Relevant lint, typecheck, and build checks pass
<!-- AC:END -->
