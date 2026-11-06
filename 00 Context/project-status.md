# Project Status

Updated: November 6, 2026, by Claude Code.

## Where we are

Homepage Hero career story, About, and header refined and committed locally after Jackie’s approval. No active task or reserved files. GitHub Pages runs only through the manual workflow; the live site still shows commit `9f7a7d1` (deployed November 5, 2026).

## What is ready

- Homepage and Snoof case, prototype, and demo loop. Earlier delivery approvals are recorded in `decision-log.md`; sources and exploration files remain private.
- Hero career story with seven stages (Senior Designer, Design Team Lead, Digital Designer, Entrepreneur, Art Director, Graphic Designer, Advertising Student), each with idle avatar loop, thumbnail, icon set, experience duration, Jackie’s copy, and four skill pills.
- Hero scroll v3: native smooth scroll with per-role plateaus, a one-role-at-a-time speed limit, soft snap, keyboard steps, and an exit plateau at Selected Work. In-page nav links glide straight to their sections.
- Skin switches: WebGL glitch on the avatar while the object set orbits around it (800 ms ring turn, reversed when scrolling up).
- Hero intro: new paragraph and “Scroll to explore my journey” cue; full-name logo in the homepage header (case pages keep the monogram); pinned Hero fits viewports below 820 px tall.
- About: new copy and title, new portrait (`jackie-portrait-egg-chair.webp`, credit Silvio Pelegrin), photo centered on the text block.
- Validation in headless Chrome at 1440 × 900, 1280 × 760, 1025 × 700, 1728 × 1000, 1920 × 1080, and 390 px: gesture simulations, frozen orbit frames, shader frames, link navigation, no script errors. Headless Chrome cannot show the avatar video switching live; the live glitch plus orbit needs browser review.
- Story mode falls back to static chapters below 1025 px wide, below 700 px tall, or with reduced motion or no JavaScript.

## What is missing

- Deploy of the latest commit (needs Jackie’s approval).
- Optional cleanup: `assets/about/jackie-portrait.webp` (previous About photo) is no longer referenced; Jackie has not decided whether to remove it. The untracked `assets/avatar/avatar-jackie.webp` stays out of Git.
- Known tight spot: at 1025 × 700 the Design Team Lead “Design Systems” pill touches the bottom nav edge.
- Broader backlog: mobile rail overlap and touch targets, final project-card art direction, later case studies. See `interaction-spec.md` and `character-bible.md`.
- Cross-browser and real-device testing.

## Next step

Jackie reviews the committed changes in the browser; then push and deploy, each with separate approval.
