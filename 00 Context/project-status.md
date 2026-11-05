# Project Status

Updated: November 5, 2026, by Claude Code.

## Where we are

Local Hero scroll-story review version refined after Jackie’s feedback. No active task or reserved files. Latest local commit is `a5c3101` (Selected Work scroll gallery), preceded by `fc2027c` (skin selector). Existing GitHub Pages preview remains manual-only; remote/deployment state was not rechecked in this task.

## What is ready

- Homepage and Snoof case, prototype, demo loop, About portrait, and three avatar skins exist locally. Earlier delivery approvals are recorded in `decision-log.md`; sources and exploration files remain private.
- Hero story draft: shrinking headline, fixed marker with traveling timeline, three career chapters and synced skins, final-chapter hold, and release into Selected Work. Corrected responsive teardown, Home navigation, chapter/line clipping, and Hero placement inside main. Latest refinements: marker follows an organic trajectory with differently shaped left/right loops inspired by Jackie’s line reference, 72 px headline-to-career separation, common text alignment, and clearer period/role/summary hierarchy. Story mode falls back to static chapters below 1025 px, below 700 px height, or with reduced motion/no JavaScript.
- Chrome validation: 1440 × 900, 390 × 844, short viewport, reduced motion, no JavaScript, live resize and motion-preference change; no script errors or page overflow. Home returns to the opening/current skin, Work bypasses the sequence, gallery reaches card 04, static skin buttons work; Snoof smoke check passes. Private captures and results: `01 Projects/Portfolio OS/Site Validation/hero-story-final-*` and `hero-story-r2-*`; r2/r3 measure the marker against the SVG path at 1440 × 900 and 1025 × 700; r3/r4 captures use HTTP so idle loops remain active; r4 verifies the asymmetric alternating turns.
- Shared specifications and public repository safety rules remain in force. No commit, push, deploy, Framer, or v8 changes in this task.

- Idle playback diagnosed separately: direct file:// opening blocks WebGL video textures in Chrome and shows the still fallback. All three skins play and advance frames correctly over local HTTP; use a local server for visual review. Evidence: private `Site Validation/idle-diagnostic.json`. No site-code changes needed.

- Hero story now has seven career stages: Senior Designer, Design Team Lead, Digital Designer, Entrepreneur, Graphic Designer, Art Director, Advertising Student. Each has an idle avatar loop, thumbnail, six icons, and a chapter; all six past stages have Jackie’s final copy, experience duration, and four skill pills. Jackie approved the sequence on November 5, 2026; committed locally, not pushed or deployed. Details in `interaction-spec.md`.

## What is missing

- Jackie's visual approval of this Hero story draft and its chapter copy; periods for Design Team Lead and Digital Designer remain “Period to confirm”.
- Current uncommitted files: Hero changes in `index.html`, `script.js`, `styles.css`, and continuity docs. The pre-existing untracked `assets/avatar/avatar-jackie.webp` was left untouched and is not part of this change.
- Broader backlog: mobile rail overlap/touch targets, desktop nav covering content near the viewport bottom, final project-card art direction, final headline/support copy, and later case studies. See `interaction-spec.md` and `character-bible.md`; parts of the avatar asset register predate the committed skin implementation.
- Cross-browser/manual device testing and any publication require a separately approved next step.

## Next step

Hero sequence approved and committed locally. Push and GitHub Pages deploy each need separate approval. Open backlog: mobile rail overlap, nav near short-viewport content, project-card art direction.
