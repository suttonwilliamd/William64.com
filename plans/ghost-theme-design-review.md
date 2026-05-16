# William64.com Ghost Theme Design Review

Date: 2026-05-16

## Goal
Align all william64.com pages with a coherent Ghost-like editorial theme while keeping `/services` and `/hireme` as the commercial funnel.

## Current Findings

1. **Theme mismatch**
   - Existing UI language is dark/cyberpunk.
   - Ghost blog (`/blog/` on production) is light/editorial.
   - This creates a hard visual jump and weak brand continuity.

2. **Navigation mismatch**
   - Users can miss `/services` or `/hireme` when cached/stale build is served.
   - Blog entry point previously targeted local Astro content instead of Ghost posts.

3. **Content hierarchy mismatch**
   - Homepage needs to stay project-first.
   - Services should stay in dedicated funnel pages only.

## Theme Direction (Ghost-aligned)

- **Base palette:** light surfaces, dark neutral text, subtle borders.
- **Typography:** Inter for body + serif display headings (editorial feel).
- **Components:** cleaner cards, lighter nav shell, lower visual noise.
- **Commercial separation:** homepage routes intent, `/services` and `/hireme` convert.

## Execution Plan

### Phase 1 (shipped in this pass)
- Global tokens moved to Ghost-like light palette in `public/styles.css`.
- Display typography switched to serif-style heading family.
- Sticky header updated to light translucent shell.
- Navigation updated to include `Services` and `Hire Me`.
- Blog nav target changed to Ghost blog URL.

### Phase 2 (next)
- Normalize button system for Ghost-like contrast hierarchy.
- Tune card spacing/borders to match blog feel.
- Rework footer and minor components to same language.
- Audit each page (`/`, `/projects`, `/about`, `/aaron`, `/garfield`, `/services`) for visual consistency.

### Phase 3 (final polish)
- Add shared page-shell primitives (headline block, lead text, section spacing rhythm).
- Reduce redundant inline styles in Astro pages.
- Add visual regression screenshots for quick diff checks.

## Acceptance Criteria

- Every page uses a consistent light/editorial visual language.
- `/blog` intent goes to Ghost posts.
- Homepage remains project-first (not ad-heavy).
- Services funnel remains accessible via `/services` and `/hireme`.
