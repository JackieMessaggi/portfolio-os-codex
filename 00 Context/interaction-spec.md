# Interaction Specification

Status: documented interaction intent; detailed choreography and implementation remain unresolved. Follow `site-brief.md` and `visual-direction.md` as the authoritative sources.

## Approved direction and requirements

- Priority (approved November 3, 2026): study the Selected Work gallery and the fixed navigation first. The avatar evolution below remains a planned future phase.
- Interaction reference: https://nesilnoble.com/ for navigation, progressive reveals, and project presentation during scrolling. Do not copy its identity, colors, typography, or code.
- Elements may enter and reveal progressively during scrolling, with transitions that connect sections. Motion supports the narrative and must not turn the portfolio into an effects showcase.
- Provide direct access to work. Visitors must not need to complete the avatar sequence or the gallery to reach projects or contact.
- Support keyboard, touch, mobile, adequate touch targets, and reduced motion. Reduced motion uses readable stages and projects in normal vertical flow without forced rotation, horizontal movement, or smooth-scroll animation.

### Fixed navigation (approved November 3, 2026)

- Header: only the small JM monogram, linking back to the start of the home page. Not fixed. No navigation links in the header.
- Desktop: a horizontal bar fixed at the bottom, with clickable section names, an active-section indicator, and navigation progress. Selecting a section scrolls smoothly to it.
- Mobile: a compact vertical bar fixed on the right, with section indicators and the current position. Sections are reachable by touch. It must not cover content or interfere with interaction.
- Implemented November 4, 2026 (`02 Site/index.html`, `styles.css`, `script.js`): sections Home, Work, About, Contact numbered 01 to 04 (About and Contact eyebrows renumbered). Desktop: centered bottom bar, ivory with a 1 px eggplant border and square corners, DM Sans 13 px uppercase, 44 px targets, 2 px progress line (beige track, Signal Orange fill); active link bold with a 6 px Deep Orange `#CC4808` square and `aria-current`. Mobile (up to 760 px): numbers only on the right edge with a vertical progress line; active number white on Deep Orange; numbers turn ivory over the eggplant Selected Work section; 44 × 44 px targets. Plain anchors work without JavaScript; smooth scrolling only without `prefers-reduced-motion`. Active section = last section whose top passed 35% of the viewport; the page end selects Contact.
- Mobile rail clarity (November 5, 2026): when the active section changes, its name appears for about 1.8 s as a Deep Orange label beside the number, then the rail returns to numbers only. Desktop bar unchanged.
- Known conflicts: on mobile the 44 px targets extend about 24 px over the 20 px gutter outside Selected Work (Selected Work cards now clear the rail); on desktop the bar covers the bottom 75 px of the viewport, including card metadata at some scroll positions. Desktop nav redesign is in the visual backlog.

### Selected Work gallery (approved direction November 3, 2026)

- Desktop: a horizontal gallery of large cards, with part of the next project visible, driven by continued vertical scrolling. A separate horizontal gesture must not be required. Normal vertical flow resumes after the gallery.
- Mobile: projects stack vertically, with entrance animations. Implemented November 4, 2026 as a functional stack without animations (up to 760 px): full card content, gallery counter hidden, 48 px right padding so cards clear the nav rail. Entrance animations are visual backlog.
- Implemented November 5, 2026 at Jackie's request (local, not committed): on desktop (wider than 760 px) with motion allowed, the Selected Work section pins and the cards move sideways with vertical scroll (same technique as the Snoof Origin strip); the counter follows the visible card; cards scale with viewport height so image and text fit while pinned. Mobile keeps the vertical stack; reduced motion keeps the manual horizontal scroll. Selected Work title reduced to the About title scale (up to 68 px).

### Skin selector (planned November 3, 2026; optional P1; not implemented)

- A simplified first step toward the avatar evolution, inspired by the skin selector pattern in games such as Fortnite. Do not copy any game's identity or assets.
- Versions of the same avatar represent real professional stages, with different outfits and visual elements. Stages must follow verified experience (see `character-bible.md`).
- Clickable thumbnails swap the main Hero image. Use real buttons with accessible names and a selected state; keyboard and touch must work.
- Target three versions; two are enough for the MVP. No 3D rotation and no complex animation.
- The positioning band stays fixed; it does not change with the selected skin.
- Only if time and assets allow before Friday, November 6. It must not block the homepage or the Snoof case study.
- Decided November 5, 2026: the current Hero avatar (Senior Designer with laptop) is the present-day skin. Each skin has its own set of floating icons, which change with the selected stage. Which and how many earlier stages get a skin is still open; skins are added one at a time as Jackie generates them (image plus idle video on green, processed like the current avatar).
- Implemented November 5, 2026 (local, not committed): "Choose a stage" row under the Hero support text with round thumbnail buttons (`aria-pressed`, keyboard and touch), in chronological order: Digital Designer, Design Team Lead, Senior Designer (Now, default). Selecting a stage swaps the avatar loop (one video element per skin, loaded on first use), the transparent still, the accessible name, and the stage's icon set, with a short fade (instant with reduced motion). Team Lead assets: `avatar-skin2-idle-alpha.mp4` (10.5 s ping-pong, 1.4 MB), `avatar-skin2-idle-poster.webp`, `skin-lead-thumb.webp`, and seven `lead-*.webp` icons (team, chat, notes, brief, kanban, browser, puzzle). Digital Designer assets (added November 5): `avatar-skin3-idle-alpha.mp4` (7.3 s ping-pong, 1 MB) with Jackie's separate cat idle video composited into the same loop, the tabby sitting between her feet, leaning on the inside of her left foot; `avatar-skin3-idle-poster.webp`, `skin-digital-thumb.webp`, and five `dd-*.webp` icons (phone, cards, cursor, pen, cloud).

### Avatar evolution (future phase)

- Vertical scrolling controls avatar rotation and transitions between professional stages, with accompanying text and cumulative skill indicators. Avoid numerical competency scores.
- Tattoos remain in subsequent stages when clothing permits; order must follow confirmed references.

These requirements describe the intended experience, not evidence that it is implemented or tested. The current v8 is a static composition.

## Technical hypotheses (not approved)

- The reference site uses GSAP, ScrollTrigger, and Lenis, based on its public source. None is approved here. The working assumption is that native HTML, CSS, and JavaScript can cover these behaviors:
  - Fixed navigation: a `<nav>` with anchor links, `IntersectionObserver` for the active section and `aria-current`, and a light scroll listener for progress.
  - Smooth scrolling: `scroll-behavior: smooth`, disabled under `prefers-reduced-motion`.
  - Progressive reveals: `IntersectionObserver` with CSS transitions; CSS scroll-driven animations only as progressive enhancement.
  - Desktop gallery: a sticky section whose cards translate horizontally with vertical scroll progress.
- Native smooth scrolling will feel closer to the browser default than the reference site's Lenis scrolling.

## Open questions and risks

- Final section names and count for the navigation bar.
- Project order in the gallery.
- Gallery mechanics: scroll distance, entry and exit, keyboard focus moving into off-screen cards, and how direct links into the gallery behave.
- Fixed desktop bar versus the lower area of the hero: Hero v03 removed the skill row, but Selected Work starts right below, so the hero still needs bottom clearance.
- Mobile bar versus content width, the full-body avatar, and touch-target size.
- Performance of large gallery images.
- Feasibility tests are still required for the gallery, avatar rotation, and outfit transitions. Three.js is optionally approved, but no renderer, asset pipeline, or animation implementation has been selected. Use the stack constraints in `AGENTS.md`.
- Define stage labels and order, scroll distances, transition timing, camera behavior, loading and failure behavior, and mobile choreography before implementation approval.
- Object motion and independent layers are recommendations from the composition discussion, not an approved detailed animation specification.
- The Damyller folding accordion and cursor-responsive elements remain explorations.

## Verification required after authorized implementation

Verify direct navigation, keyboard and touch access, reduced-motion behavior, mobile layout, scroll entry/exit, asset loading/failure handling, and performance on representative devices. Record actual checks and results in `project-status.md`; do not infer success from a static preview.
