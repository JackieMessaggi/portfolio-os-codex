# Project Status

Updated: November 12, 2026, by Claude Code after the authorized TerraYou integration and publication.

## Where we are

Live site: https://jackiemessaggi.com/ (custom domain since November 10, 2026, HTTPS enforced; the old github.io address redirects). Last published commit: `894d7ee` (Add CV link to About), successful manual run `42869627039`, November 10, 2026; the published files match the commit byte for byte. Earlier the same day: Hola! Churros as the fifth Selected Work card in `f5f3199`, and the privacy notice, Privacy Policy, and Impressum in `9d183aa`. `main` and `origin/main` are in sync. GitHub Pages remains manual. No active task or reserved files.

## What is ready

- Privacy (published and tested live, November 10): Cloudflare Web Analytics loaded by `privacy.js` with an opt-out notice (“A little insight?”, Decline / Got it), Privacy settings in every footer, and `privacy.html` and `impressum.html`. A saved Decline stops all Cloudflare requests on later pages and visits. `noindex, nofollow` stays on all five pages. The opt-out model is a conscious choice and may not meet a prior-consent reading of § 25 TDDDG (see `decision-log.md`).
- CV (published `894d7ee`, tested live): “View CV · PDF” at the end of About opens `assets/cv/Jackie-Messaggi-CV.pdf` in a new tab (`rel="noopener"`, no forced download). The PDF is the Web export from the private `Resume/` system: two pages, no phone number, links to `https://jackiemessaggi.com/`, email, and LinkedIn. The Privacy Policy now mentions the hosted PDF.
- Selected Work has five cards (published `f5f3199`): lettering at rest; Snoof glitches into its prototype demo loop on hover, focus, or (touch) scroll into view, on muted teal. TerraYou, Quiz Bingo, Damyller, and Hola! Churros are typeset placeholders with “Coming soon”; the horizontal gallery adapts to five cards. Hola! Churros case study and final card identity come later.
- Selected Work Editorial Statement studies 01 (Codex, private, November 6): TerraYou with original wordmark and one dominant website-hero crop; Quiz Bingo with hybrid editorial title and a single gameplay screen. Private HTML and PNGs: `01 Projects/Portfolio OS/Selected Work Study/editorial-statement-v01/`. Chrome renders reviewed and local fonts confirmed. Source-resolution limits documented; no site integration or final card approval. Snoof/Damyller audited only.

- Snoof case peer-review pass (November 6): short Jäger intro with “Read the full story”, captioned Origin strip, “How I worked with AI” notes from documented process, C1-B rationale first, clickable v1.0/v2.0 comparator with synced copy, rebalanced brand palette, callout motion in The direction, and a looping avatar-creator recording in Interface. Brand › Characters now features the kitten video loop (`pet-cat-loop.mp4`). The public prototype now ships its cat avatar images (aligned), fixing broken images in the avatar creator.
- Homepage and Snoof case, prototype, and demo loop. Earlier delivery approvals are recorded in `decision-log.md`; sources and exploration files remain private.
- Hero career story with seven stages (Senior Designer, Design Team Lead, Digital Designer, Entrepreneur, Art Director, Graphic Designer, Advertising Student), each with idle avatar loop, thumbnail, icon set, experience duration, Jackie’s copy, and four skill pills.
- Hero scroll v3: native smooth scroll with per-role plateaus, a one-role-at-a-time speed limit, soft snap, keyboard steps, and an exit plateau at Selected Work. In-page nav links glide straight to their sections. Gestures that begin as native scrolling (e.g. up through Selected Work) stay native and settle on a chapter afterwards.
- Skin switches: WebGL glitch on the avatar while the object set orbits around it (800 ms ring turn, reversed when scrolling up).
- Hero intro: new paragraph and “Scroll to explore my journey” cue; full-name logo in the homepage header (case pages keep the monogram); pinned Hero fits viewports below 820 px tall.
- About: new copy and title, new portrait (`jackie-portrait-egg-chair.webp`, credit Silvio Pelegrin), photo centered on the text block.
- Validation in headless Chrome at 1440 × 900, 1280 × 760, 1025 × 700, 1728 × 1000, 1920 × 1080, and 390 px: gesture simulations, frozen orbit frames, shader frames, link navigation, no script errors. Headless Chrome cannot show the avatar video switching live; the live glitch plus orbit needs browser review.
- Mobile bottom navigation implemented locally with persistent labels and 56 px targets; larger full-body avatar validated at both requested sizes. Mobile Hero story implemented locally: native scroll with pinned avatar above one chapter at a time, all seven stages and existing glitch/idle loops, no timeline; responsive object sets and orbit restored and brought closer to the avatar with internal clipping removed after owner feedback. Validated at 390 × 844 and 360 × 740 in both scroll directions, with touch, reduced motion/no-JavaScript fallback, mode changes, and reachable Selected Work. No page overflow or script errors. Evidence and limits in `interaction-spec.md`. Reduced motion/no JavaScript and short desktop windows retain the static layout.

## What is missing

- Reveal animations for TerraYou, Quiz Bingo, and Damyller covers (need assets; see the November 6 audit in the conversation and Codex’s private studies).
- Optional cleanup: `assets/about/jackie-portrait.webp` (previous About photo) is no longer referenced; Jackie has not decided whether to remove it.
- Known tight spot: at 1025 × 700 the Design Team Lead “Design Systems” pill touches the bottom nav edge.
- Broader backlog: final project-card art direction, later case studies. See `interaction-spec.md` and `character-bible.md`.
- Cross-browser and real-device testing.

## Next step

TerraYou case study: **integrated into the site on November 12, 2026** (Claude Code), from the final private Study 10, as a secondary case. Jackie approved the 54 public assets and authorized one commit, a push, and publication through the existing manual Pages workflow.

- **New page:** `02 Site/terrayou.html`. It follows the Snoof case conventions: same head with privacy.js and noindex, case nav, footer, and links back to `index.html#work`.
- **Shared files:**
  - `styles.css`: TerraYou rules appended at the end, all scoped to `.ty-*`. Dead rules for the removed SVG illustrations and a duplicate `.case main` were dropped.
  - `script.js`: TerraYou code appended inside an `if (document.body.classList.contains('ty'))` guard. Dead simulator and component-explorer code was removed.
- **Homepage:** the TerraYou card now links to the case. "Coming soon" is removed for TerraYou only. Card order and layout are unchanged.
- **Assets:** `02 Site/assets/terrayou/` holds 48 WebP files converted through Chrome (quality 0.84 to 0.9, alpha kept for the cut-outs) plus 6 SVG logos, 1.5 MB in total. Only assets used by the page were copied. Study sources stay private.
- **Validation:** CDP-driven Chrome at 1440 × 900 and 390 × 844 over local HTTP. The checks covered:
  - card to case navigation and back;
  - real scrolling with the timeline animation;
  - chapter navigation;
  - pillar, flow, logo, guide-tab, do's and don'ts, app-screen, read-more, and concept-hover interactions.

  Results: no exceptions, no 404s, no broken images, no overflow. The Snoof page also shows no exceptions. The only console noise is localhost-only (Cloudflare analytics CORS and a missing favicon), and it predates this work.
- **Final `/auditar-case` on `terrayou.html`:** ready to publish, no blocking issues.
- **Public Repository Safety Check:** done. Internal inventories and audits are git-ignored; Figma file keys are removed from the log.

No other active task. Still open: real-device checks (iOS/Safari) for the mobile scroll and the privacy notice; on mobile the notice covers the Hero “Scroll to explore” cue until a choice is made.
