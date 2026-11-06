# Project Status

Updated: November 6, 2026, by Codex after the authorized GitHub Pages deployment.

## Where we are

Homepage mobile Hero, larger avatar, closer unclipped objects, bottom navigation, and Claude’s mobile Snoof Interface bento refinement are committed, pushed, and deployed as `737b452` (November 6, 2026, successful run `42211933230`). Live site: https://jackiemessaggi.github.io/portfolio-os-codex/. GitHub Pages remains manual. Mobile chapter-skipping correction now includes an all-input adjacent-stage guard and 1100 ms transition hold, validated locally and approved by Jackie for commit, push and manual deploy. No active task or reserved files.

## What is ready

- Selected Work covers: lettering at rest; Snoof glitches into its prototype demo loop on hover, focus, or (touch) scroll into view, on muted teal. TerraYou, Quiz Bingo, and Damyller are typeset placeholders with “Coming soon”.
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
- Optional cleanup: `assets/about/jackie-portrait.webp` (previous About photo) is no longer referenced; Jackie has not decided whether to remove it. The untracked `assets/avatar/avatar-jackie.webp` stays out of Git.
- Known tight spot: at 1025 × 700 the Design Team Lead “Design Systems” pill touches the bottom nav edge.
- Broader backlog: final project-card art direction, later case studies. See `interaction-spec.md` and `character-bible.md`.
- Cross-browser and real-device testing.

## Next step

Check the published mobile scroll correction on a real device, especially iOS/Safari. Chapter sequence and Graphic Designer avatar visibility pass Chrome emulation at both requested sizes. Further refinements need Jackie’s approval.

Claude Code’s mobile Snoof Interface bento refinement is approved for the same local commit: animated avatar creator first/larger, welcome and home side by side below. Deployed with Jackie’s separate approval.
