# Project Status

Updated: November 4, 2026, by Claude Code. Replace this snapshot; do not append history. Add Active Task / Handoff only for an in-progress or interrupted task, following `agent-collaboration.md`.

## Where we are

Working toward the course delivery on Friday, November 6, 2026 (plan in `decision-log.md`). Hero v03 and Selected Work are implemented locally. Approved but not implemented: Contact in Fraunces B. Optional: the skin selector (P1). No active task or reserved files.

## What is ready

- Implemented locally in `02 Site/` (not committed, not deployed):
  - Monogram header and Hero v03: Fraunces B headline, Deep Orange positioning band, supporting sentence, avatar in a `data-skin` slot ready for a future skin selector (no interaction), currently showing the temporary 3D clay dummy (provisionally approved for Friday). No CTA or skills. Name kept in page metadata and the monogram's accessible name.
  - Selected Work v02 with the Fraunces B title; on mobile (up to 760 px) a functional vertical stack, validated at 390 px with no overflow and no overlap with the nav rail; desktop unchanged.
  - Fixed section navigation (desktop bottom bar, mobile numbered rail), validated in Chrome at 1440 and 390 px: active state, progress, and anchors correct per section; no page overflow. Known overlap conflicts listed in `interaction-spec.md`.
  - Fonts self-hosted with OFL files: DM Sans and Fraunces, both WOFF2 (Fraunces converted with all axes kept).
- Validated in Chrome on November 4: the Hero matches the v03 study at 1440 and 390 px; no page overflow from 390 to 1440 px; no band/avatar overlap at intermediate widths; Selected Work, About, Contact, and footer positions and styles unchanged. Captures in `01 Projects/Portfolio OS/Site Validation/`.
- Shared agent docs and the public repository with the manual-only GitHub Pages preview: https://jackiemessaggi.github.io/portfolio-os-codex/. `01 Projects/` is private and untracked.

## What is missing

Strategy: functional-first, then technical validation, then visual refinement (see `decision-log.md`).

Technical / functional (P0 for Friday, November 6):
- Snoof case study P0 implemented locally November 4 in `02 Site/snoof.html` (eight sections, real assets in `02 Site/assets/snoof/`, case-only navigation), validated in headless Chrome at 1440 and 390 px: no overflow, no broken images, active section and progress correct across all eight sections, homepage unchanged. Visual refinement round done the same day: new Hero photo of Jäger (`jager-yucca-portrait.webp`, full-height and bleeding right on desktop, full-width on mobile), UI crops re-cut to exact card bounds from the original screenshots (lossless), consistent section rhythm, clearer type hierarchy, and a case nav that hides over the Hero and while scrolling down. Round 3 (same day): Hero photo fills the full hero height on desktop and sits below the title on mobile; peach highlight behind the glyphs; Research "Toxic" as a label; restructured Origin cards, equal-height Connecting the dots cards, side-by-side 5B layers, Meet Snoof grouped (title first, then Color, Characters, Interface, Tone of voice); narrative highlights kept below section-title scale. Round 4: compact Hero (ends at 893 px at 1440 × 900, so face, paws, and pot show in the first screen), Origin cards in eggplant / peach / ivory, SVG icon in the "Toxic" label, larger Meet Snoof screens with the collection detail beside its caption, case nav starts hidden (no flash). Captures: `01 Projects/Portfolio OS/Site Validation/snoof-p0-r4-*`. Round 5: Origin tile shells all ivory, color only inside the visual area; approved by Jackie (`snoof-p0-r5-origin-strip.png`). Homepage Snoof card is now first in Selected Work (order: Snoof, TerraYou, Quiz Bingo, Damyller), links to `snoof.html` (media area, accessible name "Snoof, read the case study") and reads "Self-initiated project · End-to-End Design"; image placeholder kept until the four cards are designed together. Links verified in headless Chrome (card → case, case → `index.html#work`, "Let's talk" → `#contact`, monogram → home); homepage layout unchanged. Fragment scrolling on arrival must be confirmed in a real browser (headless does not scroll to anchors). Pending: Jackie's review; link from the homepage Snoof card and its copy update ("Self-initiated project", "End-to-End Design"); demo video (poster placeholder in place); P1 scroll animations; real-browser check of both nav scripts. The wordmark is a transparent PNG rendered from the v1.0 documentation PDF (no SVG source was found); a vector SVG export from Jackie's source file would be sharper.
- Navigation between homepage and case, including the fixed nav on the case page.
- About and Contact content (Contact title in Fraunces B).
- Real-browser check of the nav script (headless Chrome validated the logic with a stubbed animation frame), plus a final responsive pass, then publishing with Jackie's explicit approval.

Approvals and assets:
- Public release of `02 Site/assets/work/` before any commit.

Visual backlog (after the functional pass):
- Desktop navigation bar redesign (it also covers card metadata at the bottom of the viewport).
- Mobile nav rail touch targets over the 20 px gutter; mobile card entrance animations; Selected Work card art direction and final images.
- Avatar refinement or final transparent avatar; final headline and supporting sentence.
- Optional P1: skin selector (`interaction-spec.md`). After Friday: advanced animation and other case studies.

## Next step

Jackie reviews the Snoof case P0 (`02 Site/snoof.html`). Then, with approval: link it from the homepage card and update the card copy. Afterwards: record the demo video, then P1 animations.
