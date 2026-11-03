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

### Selected Work gallery (approved direction November 3, 2026)

- Desktop: a horizontal gallery of large cards, with part of the next project visible, driven by continued vertical scrolling. A separate horizontal gesture must not be required. Normal vertical flow resumes after the gallery.
- Mobile: projects stack vertically, with entrance animations.
- The exact horizontal mechanic must be validated in an isolated technical proof before it is approved.

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
- Fixed desktop bar versus the lower area of the hero: v8 places skill indicators and the start of Selected Work there, so the hero needs bottom clearance.
- Mobile bar versus content width, the full-body avatar, and touch-target size.
- Performance of large gallery images.
- Feasibility tests are still required for the gallery, avatar rotation, and outfit transitions. Three.js is optionally approved, but no renderer, asset pipeline, or animation implementation has been selected. Use the stack constraints in `AGENTS.md`.
- Define stage labels and order, scroll distances, transition timing, camera behavior, loading and failure behavior, and mobile choreography before implementation approval.
- Object motion and independent layers are recommendations from the composition discussion, not an approved detailed animation specification.
- The Damyller folding accordion and cursor-responsive elements remain explorations.

## Verification required after authorized implementation

Verify direct navigation, keyboard and touch access, reduced-motion behavior, mobile layout, scroll entry/exit, asset loading/failure handling, and performance on representative devices. Record actual checks and results in `project-status.md`; do not infer success from a static preview.
