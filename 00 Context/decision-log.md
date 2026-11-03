# Decision Log

This is a concise index of approved decisions, not a replacement for the linked specifications. Earlier decisions below were transcribed on November 3, 2026; their original dates are not assumed unless recorded in the source.

| Recorded | Decision and approval scope | Source |
| --- | --- | --- |
| November 3, 2026 | Positioning: Senior Designer, Brand, Product & Creative Systems; 18+ years; senior hands-on opportunities. Do not position Jackie as an end-to-end Senior Product Designer. | `AGENTS.md`, `site-brief.md` |
| November 3, 2026 | Plain HTML/CSS/JS, one HTML per page and shared CSS. Three.js is optional under the stated conditions; other libraries need approval. | `AGENTS.md` |
| November 3, 2026 | Retain approved palette, Dakota Rough and DM Sans, and original logo assets. Header uses the eggplant JM monogram without an adjacent name. Big Shoulders is excluded. | `visual-direction.md` |
| November 3, 2026 | Option C is the basis for a static composition study. Two-line hero name; Berlin belongs in About. This does not authorize implementation. | `visual-direction.md` |
| November 3, 2026 | Test the supplied GPT-created avatar and supporting objects in the existing hero. Result: `.impeccable/mocks/header-hero-c-v8.png`. Jackie then said to leave it as it is for now; retain as a provisional reference. Final likeness, object selection, responsive layout, and motion are not approved by this. | Owner's test authorization and subsequent request in the project conversation; `visual-direction.md` |
| November 3, 2026 | Codex, Claude Code, and Claude Design use shared repository documentation for continuity and handoffs, with preferred but nonexclusive responsibilities. | Owner's collaboration instructions; `agent-collaboration.md` |
| November 3, 2026 | The repository stays public by decision. GitHub Pages hosts the current preview. Publishing is manual through `workflow_dispatch` after Jackie's explicit approval; commits and pushes do not deploy. The current preview stays online. | Owner approval of Option A in the project conversation; `.github/workflows/pages.yml`, `agent-collaboration.md`, `PRODUCT.md` |
| November 3, 2026 | `01 Projects/` is private, including future projects: ignored by Git and removed from tracking, with local files preserved. Existing Git history is kept without rewriting. Final case studies reach `02 Site/` only after Jackie's explicit approval. | Owner approval in the project conversation; `.gitignore`, `AGENTS.md`, `agent-collaboration.md` |
| November 3, 2026 | Keep `.impeccable/mocks/header-hero-c-v8.png` out of the repository for now: it is not approved for public release. It stays local only, so references to it in other documents point to a file that is not on GitHub. Publishing it requires Jackie's approval. | Owner decision after the Public Repository Safety Check in the project conversation |

For each new significant approval, add its date, exact scope, owner approval source, and affected files. Link superseded decisions rather than presenting both as active. Agent suggestions and generated previews are not owner approvals.
