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

Do not build from the obsolete `/root/staging/William64.com` checkout or overwrite only selected pages for a site-wide release. Publish a complete, validated output from this source together, keeping a verified backup and rollback path. The existing GitHub FTP deployment is known to be failing; changing its credentials or infrastructure is a separate task. A source change is not published merely because it builds. On the TLS-terminated Nginx origin, keep `absolute_redirect off;` in the site server block so slashless URLs such as `/aaron` redirect relatively without downgrading visitors to HTTP.
