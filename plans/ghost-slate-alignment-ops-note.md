# Ghost Slate alignment ops note

Date: 2026-05-16

## Applied on live Ghost (`william64.com/blog`)
- Active theme set to `slate-for-ghost`.
- Removed `cover_image` publication background override.
- Set Ghost `accent_color` to `#175BEB`.
- Set Slate `background_color` custom theme setting to `#FAF2EA`.

## Verification snapshot
- Home page no longer includes `publication-cover.jpg` body background.
- Live HTML includes `--ghost-accent-color: #175BEB`.
- Live HTML includes `--epcl-background-color: #FAF2EA`.
- Slate CSS font stack resolves to Public Sans (body) and Bricolage Grotesque (heading).

## Follow-up
- Theme reports one Ghost 6 compatibility warning (`{{#author}}` deprecation) and should be patched in-theme.
