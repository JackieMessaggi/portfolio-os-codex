# Interaction Specification

Status: documented interaction intent; detailed choreography and implementation remain unresolved. Follow `site-brief.md` and `visual-direction.md` as the authoritative sources.

## Approved direction and requirements

- Vertical scrolling controls avatar rotation and transitions between professional stages, with accompanying text and cumulative skill indicators. Avoid numerical competency scores.
- Tattoos remain in subsequent stages when clothing permits; order must follow confirmed references.
- After the evolution sequence, vertical scrolling drives large project cards from right to left, then returns to normal vertical flow. A separate horizontal gesture must not be required.
- Provide direct access to work. Visitors must not need to complete the avatar sequence to reach projects.
- Support keyboard, touch, mobile, and reduced motion. Reduced motion uses readable stages and projects in normal vertical flow without forced rotation or horizontal movement.

These requirements describe the intended experience, not evidence that it is implemented or tested. The current v8 is a static composition.

## Technical constraints and open specifications

- Use the stack constraints in `AGENTS.md`. Three.js is optionally approved, but no renderer, asset pipeline, or animation implementation has been selected.
- Feasibility tests are required before committing to rotation, outfit transitions, and scroll-driven cards.
- Define stage labels/order, scroll distances, transition timing, camera behavior, loading/failure behavior, and mobile choreography before implementation approval.
- Object motion and independent layers are recommendations from the composition discussion, not an approved detailed animation specification.
- The Damyller folding accordion and cursor-responsive elements remain explorations.

## Verification required after authorized implementation

Verify direct navigation, keyboard and touch access, reduced-motion behavior, mobile layout, scroll entry/exit, asset loading/failure handling, and performance on representative devices. Record actual checks and results in `project-status.md`; do not infer success from a static preview.
