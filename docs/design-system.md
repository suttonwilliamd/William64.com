# William64.com design system

## Direction

One personal notebook, not a collection of unrelated landing pages. Charcoal/slate surfaces, warm-white text, mint links and actions, restrained borders, generous left-aligned headings, and system fonts. Aaron uses the same neutral tags and discovery cards as the rest of the site; AI authorship is indicated with text, not a separate color theme. No animated terminal intros, invented credibility metrics, placeholder testimonials, or rainbow navigation icons.

## Ownership

- `src/styles/site.css` is the **only application stylesheet**. Tokens, base elements, the shell, reusable components, feature layouts, and responsive rules live here in that order. Change colors, spacing, typography, buttons, focus rings, breakpoints, and card treatments here—not in individual pages.
- `BaseLayout.astro` owns the entire document, metadata, canonical URL, skip link, single main landmark, navigation, and footer. Every page uses it, directly or through `ArticleLayout`.
- `PageHeader.astro` owns ordinary page introductions. The homepage uses its larger hero variant.
- `ArticleLayout.astro` owns reading layout and authorship. `PostLayout.astro` adapts the content collection to it. Article contents links come from actual rendered headings.
- `ProjectCard.astro` is shared by the homepage and projects page. `src/data/projects.ts` owns the curated descriptions and limitations. The browser never needs GitHub to render them.
- `PostList.astro` is shared by writing, category, and tag indexes. `src/lib/posts.ts` owns date ordering and URL-compatible category/tag slugs.
- React is used only for the token explorer. It uses the same CSS tokens, forms, cards, and page shell. Input stays in the browser.

## Rules for new pages

1. Wrap content in `BaseLayout` (or the article adapter), with a meaningful title and description.
2. Use one H1, ordinarily via `PageHeader`.
3. Prefer existing `.card`, `.prose`, `.split`, `.section-heading`, `.actions`, and `.btn` components. Add genuine new layout rules to the feature section of `site.css`; do not add another design-system file or page-local reset.
4. Keep reading text around 72 characters wide. Use the wide container for collections and comparison layouts.
5. Give controls labels and keyboard focus styles. Hide enhancement-only controls until their script is ready. Core navigation and content must remain reachable without JavaScript.
6. Use AI-authorship labels for Aaron’s writing. Preserve prototype and demonstration caveats rather than suggesting experiments are production products.
7. Use system fonts. No external font request is needed to render the site.

## Audit and route coverage

The implementation starts from repository revision `d360544` (which was ahead of the previous staging checkout), incorporates the published curated projects page, and recovers the live-only memorial and old preview URL. Live page bodies and links were read before migration.

| Routes                                             | Treatment                                                                                                                                               |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                                | Personal notebook introduction, shared project cards, discovery paths; no runtime GitHub feed or contradictory job-title terminal                       |
| `/projects/`                                       | Curated cards with category/search enhancements and no-JS content                                                                                       |
| `/about/`                                          | Personal background, learning timeline, tools, contact, Aaron context                                                                                   |
| `/blog/`                                           | Honest empty state, or complete chronological post list                                                                                                 |
| `/blog/posts/*`, `/blog/category/*`, `/blog/tag/*` | Shared article/archive templates; verified with disposable sample content                                                                               |
| `/aaron/`, three `/aaron/posts/*`                  | Shared shell and reading typography; explicit AI authorship; existing article bodies retained                                                           |
| `/sirq/`                                           | Existing nine-alert fixture and inspectable reasoning retained; mock/static/no-production-action caveats prominent                                      |
| `/token-viewer/`                                   | Valid page document and shared form styles; local GPT-2 encode/decode interaction                                                                       |
| `/privacy/`, `/terms/`                             | Existing policy body text and revision dates retained, shared prose layout and footer                                                                   |
| `/memorial/`                                       | Live-only story and original family photograph recovered into source; original GoFundMe destination retained; historical campaign figures clearly dated |
| `/admin/`                                          | Accurate static authoring guide, not a claim that a browser CMS is running; noindex                                                                     |
| `/work-in-progress/`                               | Old preview URL remains usable, points to the current site; noindex                                                                                     |
| `/404.html`                                        | Standard shell and recovery links; noindex                                                                                                              |

## Consolidation

Removed the four competing `src/styles/*design-system.css` files, duplicate root/public `styles.css`, Tailwind integration/configuration and its direct packages, and unreferenced legacy UI components (including the alternate Aaron footer). The sole CSS import is in `BaseLayout`. Astro emits one shared content-hashed CSS asset for every route.

Archived experiments under `archive/` and historical plans are not application entry points or design authority. Generated `.astro/` and `dist/` contents are not authoring sources. Their previously tracked snapshots are removed and both directories are ignored; production output is regenerated from source, not maintained as another copy of the site.

## Checks

- `npm test`: production-build assertions for every route, local-link/asset/fragment checks, no-JS content, project filtering/reset, mobile navigation state and focus, SIRQ boundaries, memorial preservation, and populated-blog templates. Builds run from disposable copies and do not rewrite the checkout’s generated files.
- `npm run build`: complete static production output.
- Visual browser checks cover all routes at desktop and 320px mobile widths. Check interactive token encoding, menu open/Escape, filters, and expandable SIRQ explanations in a browser after changing them.

## Publishing

Do not build from the obsolete `/root/staging/William64.com` checkout or overwrite only selected pages for a site-wide release. Publish a complete, validated output from this source together, keeping a verified backup and rollback path. A source change is not published merely because it builds. On the TLS-terminated Nginx origin, keep `absolute_redirect off;` in the site server block so slashless URLs such as `/aaron` redirect relatively without downgrading visitors to HTTP.

### Source recovery and release contract (2026-10-31)

The published October redesign had never been committed to GitHub. The clean
Windows `main` checkout and `origin/main` were both at `d360544`, while production
was built from the uncommitted `cohesive-site` worktree at
`/root/work/william64-cohesive` on Garfield (also visible through its NVMe bind mount
at `/srv/apps/garfield/root-work/william64-cohesive`). That worktree starts at the
same revision. Its source, public assets, tests and design guidance have now been
recovered into the canonical repository; no credentials, dependency caches or
generated outputs were imported. The original remote worktree is left intact.

Nginx serves `/srv/www/william64.com/dist`. At recovery time this was a symlink to
`/srv/www/william64.com/releases/aaron-20261022T144620Z-zi6ivdj4`, whose projects
page matches the recovered curated notebook. `/srv/www/william64.com/source`
and `/root/staging/William64.com` are stale and are **not** release inputs.

The `main` workflow now uses the lockfile, builds the complete site and uploads
`william64-site-<commit SHA>` as a GitHub Actions artifact. It does **not** deploy.
The previous FTP workflow failed with `getaddrinfo ENOTFOUND`; its destination
must not overwrite the recovered site. CI has no configured SSH private-key
secret, so automatic deployment must not be assumed.

For an authorized manual release:

1. Build and test the canonical source revision, then smoke-test its production
   preview at desktop and narrow widths. Use the complete `dist/`, never a subset
   of pages. Record the source commit and archive checksum.
2. Connect to `root@ssh.william64.com` with the operator's existing approved SSH
   identity. Do not put the key or any service credentials in the repository.
3. Record `readlink -f /srv/www/william64.com/dist`. Upload the archive and extract
   it into a new, uniquely named directory under
   `/srv/www/william64.com/releases/`, without touching existing releases.
4. Check the uploaded checksum, expected routes and readable file permissions.
   Windows-built archives can retain mode `666`/`777`: remove group/other write
   bits only within the new release (`chmod -R go-w <new-release>`), then verify
   ordinary files are `644` and directories `755` before publication.
   Create a temporary symlink **beside** `dist` pointing to the new release, then
   use `mv -Tf` to atomically rename that symlink over `dist`. Nginx needs no
   restart or configuration change.
5. Check the origin and public HTTPS routes, project interactions and assets.
   Retain the previous release. To roll back, create another temporary symlink
   to the recorded previous target and atomically rename it over `dist`.

Keep remote builds/dependency installations off the small root filesystem.
Inspect storage before upload; recovery found 9.4 GiB free on root and 410 GiB on
the verified NVMe mount. This procedure publishes only small prebuilt static
assets and does not alter unrelated services, tunnel routes or security settings.

### Project discovery

The homepage links directly to Games & tracking. Category and search filters on
`/projects/` live in the URL (`category` and `q`), so a selected view survives
reload and can be bookmarked or shared. Category/reset changes form browser
history entries; typing updates the current entry instead of adding one per
keystroke. Back and Forward restore the controls and visible cards together.
Clear filters is available for every active filter, not just zero results.
Without JavaScript, all curated projects and source links remain available.

### Recovery and discovery verification (2026-10-31)

- `npm ci --no-audit --no-fund` and one `npm run build` completed on Windows;
  the production build emitted 16 pages. Existing empty-blog collection and large
  token-explorer bundle warnings remain visible.
- `npm test` passed all 14 tests, including production route/asset/fragment
  integrity, populated-blog fixtures, no-JS project content, filter URL reload,
  Back/Forward restoration, unknown categories and keyboard-focus reset.
- Chromium production-preview smoke at 1365px and 320px exercised the homepage
  Games & tracking link, category/search intersections, reload persistence,
  Back/Forward, a no-match search, Enter on Clear filters, and mobile menu
  Escape/focus return. The narrow view had no horizontal overflow; no page
  runtime errors were reported. Desktop and narrow screenshots were captured.
- The original remote source and production release were not changed during
  source recovery or these checks. Publication is a separate atomic-release step.
