---
name: auditar-case
description: Audits a portfolio case study before publishing or committing. Checks PRIME, the recruiter read, narrative, credibility, and the rendered page on desktop and mobile. Read-only. Takes a case name or path, for example `/auditar-case TerraYou`.
---

# $auditar-case

Audits one case study and reports what to fix before it goes public. **Audit only.** It never edits the case, the site, Framer, or Figma, and it never commits, pushes, or deploys.

Talk to the user in PT-BR, following `.agents/voice.md`. Rewrite suggestions for portfolio copy are in natural American English, in Jackie's voice (`00 Context/site-brief.md`), with no em or en dashes.

---

## 1. Find the case

The argument is a case name (e.g. `TerraYou`) or a path.

- **Path:** use it.
- **Name:** look in this order and use the most recent version you find:
  1. `02 Site/<name>.html` (published or ready to publish);
  2. `01 Projects/<name>/Study/`: include versioned directories such as `case-final-07/index.html` and `*-study-<N>/index.html`, as well as `*-study-<N>.html`. Choose the highest numeric version within the relevant family; consult `project-status.md` to distinguish a complete case from an isolated component exploration;
  3. `01 Projects/<name>/case-study.md` (draft text).

  State which file you audited. If you find nothing, ask for the path.

Also read, when they exist:
- `01 Projects/<name>/case-study.md`
- any `00 Context/*<name>*` audit or inventory files
- the matching rows in `00 Context/decision-log.md`

These are the evidence base for the credibility check.

## 2. Load PRIME

PRIME is defined in `.agents/skills/case-study/SKILL.md`:

- **P**roblem
- **R**esearch
- **I**nsight
- **M**aking
- **E**valuation

Read that file before auditing, and use its definitions and its "What good looks like" section as the criteria.

If the file is missing or does not define PRIME, stop and ask the user for the reference. Do not invent what the letters mean.

Note that the project does not force every case into a UX format (`AGENTS.md`, `site-brief.md`). If a PRIME element is legitimately absent for this kind of project (e.g. no user research on a brand project), say so. Do not fail it as a defect.

## 3. Audit

Distinguish three kinds of finding every time:

- **Observed:** a problem you can point to on the page or in the text.
- **Credibility risk:** a claim the evidence base does not support.
- **Editorial preference:** your taste. It is optional, and you must label it as such.

### A. PRIME

For each letter:
- give a rating: *clear*, *partial*, *missing*, or *not applicable*;
- quote the sentence or name the section that serves as evidence;
- say in one line what is missing.

### B. Recruiter read (30 to 60 seconds)

Read only what a skimmer sees:
- the hero;
- the metadata band;
- section titles and leads;
- visible captions.

Can they tell:
- the product;
- the problem;
- Jackie's role;
- her personal contribution vs. the team's;
- the key decisions;
- the outcome?

Mark each one yes, partly, or no.

### C. Narrative

Check for:
- clarity and concision;
- section order;
- repetition (the same idea told twice);
- the chain problem → decision → result;
- sentences that describe intent instead of what happened.

Flag "Read more" collapses that hide context the reader needs.

### D. Credibility

List every claim that needs evidence:
- metrics;
- outcomes;
- "I designed / I led" statements;
- launch facts;
- third-party work (stock, AI, team).

Check each against the evidence base. Flag:
- claims with no source;
- numbers with no source;
- vague team-vs-me wording;
- leftover `[Check: …]` notes;
- placeholder or Lorem ipsum text visible to readers. When the source design used placeholders, say so and flag it if it isn't labeled.

**Never invent facts** to fill a gap. Propose a question for Jackie instead.

### E. Presentation

When a browser is available, render the page at 1440 × 900 and 390 × 844, and capture screenshots. Use native viewport/device emulation and confirm `window.innerWidth === 390` for the mobile capture. Headless Chrome supports this width; use an iframe harness only when the available environment cannot create the requested viewport, and report which method was used. Check:

- **Hierarchy:** headline sizes and the order of emphasis.
- **Legibility:** text size and contrast. Estimate the contrast ratio for any colored text or colored background.
- **Images:** image quality and cropping; alt text present and meaningful.
- **Captions:** they say what the reader is looking at.
- **Links:** they work and point where they should.
- **Layout:** no horizontal overflow; interactive controls are reachable by keyboard, have visible focus, and have a reduced-motion fallback.
- **Rule compliance:** the project's rules in `00 Context/visual-direction.md` are respected (no em or en dashes, approved fonts and colors).

If something can't be checked, say exactly what and why. Examples: animations that only run on real scroll, real-device behavior, screen readers.

## 4. Report

Write the report in PT-BR, in this order.

1. **Verdict:** one of *pronto para publicar*, *pronto com ajustes pontuais*, or *precisa de revisão*, plus one sentence of why.
2. **PRIME:** a table with letter, rating, evidence, and gap.
3. **Recruiter read:** the six questions with yes, partly, or no.
4. **Prioritized problems:** a numbered list, highest impact first. For each one, give:
   - where it is (section or element);
   - the problem, labeled as observed or credibility risk;
   - why it matters;
   - the recommended fix.
5. **Suggested rewrites:** only where needed. Show the current line and the proposed line in English, in Jackie's voice. Never add facts that aren't in the evidence base.
6. **Before commit vs. optional:** two short lists. "Before commit" holds only what is wrong, risky, or broken. Preferences go under optional.
7. **Not verified:** what you could not check.

End with one recommended next step. Do not apply any change until Jackie approves.
