# Visual direction

Source: The portfolio owner's character-customization concept, supplied 3D character rendering reference, two supplied color palettes, and the existing Framer portfolio identity. The motion recording `Screen Recording 2026-11-02 at 15.28.03.mov` could not be visually inspected; rotation behavior below follows the owner's written description.

Character: An open, contemporary editorial interface inspired by character customization, with a polished, expressive avatar and restrained game-inspired controls.

## Colors

Background: Light ivory `#F8F5EF`.
Text primary: Deep Eggplant `#400849`.
Text secondary: Deep Eggplant `#400849`; distinguish secondary content through size and weight until an accessible secondary color is approved.
Accent: Signal Orange `#FF5A0A`.
Secondary surfaces: Warm Cream Beige `#E8D2B5`.
Occasional decorative detail: Pastel Orchid Pink `#E7B0DE`.

Restricted token, approved November 3, 2026: Deep Orange `#CC4808`, only as a background behind white text (white on `#CC4808` is 4.67:1, WCAG AA for all text sizes). Its first and currently only approved use is the Hero positioning band. `#FF5A0A` remains the original Signal Orange for indicators and small highlights. White `#FFFFFF` is approved only as text on Deep Orange.

Keep the main avatar area light ivory. Use orange sparingly for selection, progress, and small highlights. The Hero positioning band is an intentional exception to this rule; do not extend large orange areas elsewhere without approval. Use dark text on colored controls and verify contrast before implementation; orange is not approved as small text on ivory (one owner-approved exception: the "Where AI helped" labels in the Snoof case, November 5, 2026). Beige and pink should remain subordinate to the avatar and project imagery.

Do not introduce other interface colors. Muted Sage Grey and Deep Burgundy were considered but are not part of the selected direction. Avatar clothing, rendered materials, photographs, and project assets may contain their own colors.

## Typography

Approved November 3, 2026: Fraunces B, Expressive, is the direction for display headings. This supersedes Dakota Rough for headings and the temporary PNG-title plan. Fraunces A, Editorial, remains a future alternative, not a discarded direction. Preserve all private exploration files.

- Display: Fraunces variable, exact B axes `"wght" 900, "opsz" 72, "SOFT" 100, "WONK" 1`. Use `font-optical-sizing: none` to retain the approved optical setting. Desktop reference: 96 px, line-height 1.04, letter-spacing -0.025em. Do not substitute a generic Black configuration.
- Role (refined November 3, 2026): Fraunces B is a selective graphic highlight, not the default face for every heading. Planned uses: the Hero headline, the Selected Work title, the About title (added November 4 at the owner's request), and the Contact title, each with a different scale and composition. Exception: the Hero headline uses line-height 0.96. Keep Fraunces at 40 px or larger.
- Body, navigation, About, functional elements, disciplines, contributions, and captions: DM Sans.
- Dakota Rough: reserved exclusively for the existing logo. Do not redesign the logo, embed Dakota as a webfont, or add its font files to the site or Git. Its Desktop license limitations still apply.
- Big Shoulders remains excluded. Dakota Rough Outline and Inter are not approved.
- Local delivery: `02 Site/assets/fonts/Fraunces-variable.woff2`, converted on November 4, 2026 from the official Google Fonts variable TTF without subsetting or renaming (all four axes, 698 glyphs, and the embedded OFL notice kept; only the DSIG signature table is dropped by WOFF2), with `Fraunces-OFL.txt` (SIL Open Font License 1.1). The source TTF is preserved privately in `01 Projects/Portfolio OS/font-sources/`. Source: https://github.com/google/fonts/tree/main/ofl/fraunces. DM Sans remains locally hosted under its OFL license. No remote font runtime dependency.
- Implemented: the Selected Work title (`clamp(2.5rem, 6.6666667vw, 6rem)`) and the Hero headline (November 4, 2026), both with fixed B axes and `font-display: swap`. About and Contact titles implemented November 4, 2026 (pending Jackie's review).

## Local Logo Assets

The owner supplied two SVG files in `02 Site/assets/logo/`:

- `Jackie_Logo_black_Short.svg`
- `JM_Logo.svg`

Preserve the supplied originals. Visual inspection confirmed that `Jackie_Logo_black_Short.svg` is the JM monogram and `JM_Logo.svg` is the full-name wordmark. The owner approved the monogram for the header and replacing its black fill with the approved Deep Eggplant `#400849`. The derived asset is `Jackie_Logo_eggplant_Short.svg`. Header scale and spacing remain subject to the static composition comparison. The monogram is implemented in the site header (56 px wide on desktop, 44 px on mobile) since November 4, 2026. Update November 6, 2026: on the homepage the header now uses the full-name wordmark (`JM_Logo.svg` with its black fill replaced by Deep Eggplant, derived asset `Jackie_Logo_eggplant_Full.svg`, 120 px wide on desktop, 96 px on mobile and on short story viewports), because the name did not appear anywhere in the Hero. Case pages keep the JM monogram. Jackie’s request; supersedes the monogram-only homepage header.

## Layout

Hero: Text on the left and a full-body avatar on the right on desktop. Include a headline, current professional role, short description, and restrained progression cues. Final headlines, role names, number of stages, and chronology remain open.

Use generous whitespace, strong typography, and a limited number of controls. Avoid enclosing every item in a card or panel.

Max content width: Pending layout exploration and approval.
Base spacing unit: Pending layout exploration and approval.
Section padding: Pending layout exploration and approval; provide comfortable mobile gutters and enough space to preserve the full-body avatar.

These measurements are unresolved, not permission to invent final layout rules. This document captures the approved concept and palette; implementation dimensions and typography specifications still require resolution before generating the site structure.

## Approved Homepage Composition

Approved by the portfolio owner on November 3, 2026 as the basis for a static composition study, not as a final design or implementation approval.

- Use an editorial homepage with restrained character-customization cues. The avatar introduces the multidisciplinary trajectory; selected work provides evidence of design quality.
- Header: only the approved JM monogram in Deep Eggplant, small and discreet, linking back to the start of the home page. No navigation links in the header and no adjacent name; the header does not need to be fixed. Section navigation moves to the fixed navigation bar described in `interaction-spec.md`. The name appears prominently in the hero. Use orange for interaction, selection, and the active-section indicator without competing with the identity. Approved November 3, 2026; supersedes the earlier Work, About, and Contact header links.
- Desktop hero: start from a 12-column grid, with five columns for text, one for separation, and six for the full-body avatar. Preserve breathing room and the approved soft ground shadow. Exact widths and spacing remain open.
- Typography hierarchy: follow the Typography section above (Fraunces B as a selective highlight, DM Sans for everything else). Keep the professional specialty understandable without following the animation.
- Hero, version 03 (approved November 3, 2026 as the direction for the Friday, November 6 delivery; not the definitive version). Reference: `01 Projects/Portfolio OS/Hero Study/hero-study-03.html` and `exports/hero-study-03-1440.png` / `-390.png` (private study).
  - Headline (provisional copy): “One character. Many possibilities.” in Fraunces B, line-height 0.96, about 104 px at 1440 and 56 px at 390.
  - Positioning band directly below the headline: `Senior Designer | Brand, Product & Creative Systems`, DM Sans SemiBold, white on Deep Orange `#CC4808`, square corners, no shadow. Desktop: one line, about 22 px. Mobile: compact band, about 18 px, 8 px vertical and 12 px horizontal padding, two lines with the break after “Senior Designer” and the `|` separator hidden.
  - Short supporting sentence in DM Sans (provisional copy). No CTA and no skill indicators in the Hero.
  - Two-column composition preserved: text on the left, avatar on the right on desktop; text then avatar on mobile. The avatar remains provisional.
  - Name (decided November 4, 2026): “Jackie Messaggi” is not the Hero headline; it may appear in the introductory text or in About and stays in the page metadata. Supersedes the earlier two-line hero name.
  - Implemented in `02 Site/` on November 4, 2026, matching the study at 1440 and 390 px. Between 761 and 1240 px the band uses the compact two-line mobile style, because the one-line band would overlap the avatar.
- Skills: a small set of cumulative indicators, without numerical competency bars. Removed from the Hero in v03; they belong to the future avatar evolution.
- Selected Work (approved November 3, 2026): four large, image-led cards for TerraYou, Quiz Bingo, Snoof, and Damyller. Provisional order for the first static study: TerraYou, Quiz Bingo, Snoof, Damyller; it may change after the composition is evaluated.
  - Each card preserves its project's identity, colors, and personality. Custom backgrounds belong to each card's visual composition, not to the Portfolio OS interface palette.
  - Proportions, spacing, and hierarchy follow one consistent card system across the four projects.
  - The project name is integrated into the visual composition and also has an accessible text equivalent.
  - Outside the image: the disciplines and a short description of my contribution.
  - New mockups and compositions may be created from the original project assets; existing Framer mockups are a reference, not a requirement. Do not invent features, results, or contributions.
  - Snoof is identified as an educational project. Damyller is collaborative work; my contribution and the photography credits are documented in its Framer case. Do not invent credits or rebuild a credits list.
  - No final image, mockup, or card composition is approved yet.
- Evaluate card scale, backgrounds, image framing, and rhythm in a static study before the scroll-driven gallery described in `interaction-spec.md`.
- Selected Work section system (Exploration 02, approved November 3, 2026):
  - Section background: Deep Eggplant `#400849`. This applies to the Selected Work section only; the rest of the page keeps the ivory background.
  - Section title and contribution text in Light Ivory `#F8F5EF`; card numbers, disciplines, and the counter in Warm Cream Beige `#E8D2B5`. Orange only for small indicators.
  - Card text sits in two columns: the number on the left, content on the right. The number and the first line of disciplines share a baseline and use the same DM Sans Medium, about 13 px, with matching letter spacing.
  - Contribution text: DM Sans Regular, about 18 px, line-height 1.5, about 12 px below the disciplines, so it reads above the metadata.
  - Card compositions in the study remain placeholders; individual art direction is a separate stage.
  - Open: orange as small text on eggplant (used for the active counter number in the study) has not been contrast-checked. The eggplant monogram is not visible on this background; it was left out of the section view because the header is not fixed. A light monogram variant is not approved.
- About: a short personal introduction with a route to the eventual dedicated About page. Contact: a clear closing section without repeating the resume or introducing another elaborate visual sequence.
- Mobile: text followed by the avatar, vertically stacked projects with entrance animations, and the compact fixed navigation described in `interaction-spec.md`. Exact motion choreography remains open.
- Final copy, likeness assets, dimensions outside the Hero v03 and Selected Work systems, and motion timing remain unresolved. No HTML/CSS, Framer changes, or animation implementation are authorized by composition approval alone.

## Avatar Art Direction

- Create a recognizable, stylized version of Jackie, with a friendly, expressive personality and a fashion-forward editorial attitude.
- Use the supplied character image exclusively for rendering style, materials, texture, and finish. Do not copy its face, physical appearance, or outfit as Jackie's identity.
- Show the entire body with balanced proportions. Avoid exaggerated legs or feet.
- Give clothing, hair, and accessories deliberate visual detail. Preserve a consistent identity through every professional evolution.
- Place a soft ground shadow beneath the avatar to establish contact with the floor. Keep the surrounding hero background smooth and light. This shadow is approved specifically for the avatar; it does not establish a general UI drop-shadow style.
- Character Master v1.2 and the Modeling Reference were approved as the identity references on November 4, 2026. The details and the tattoo map are in `character-bible.md`. No production model, rig, animation, or final avatar asset exists yet.

## Tattoo progression

As the character evolves through different professional stages, tattoos gradually appear and accumulate on the avatar's body.

Unlike outfits, hairstyles, and accessories, tattoos are permanent elements that remain visible in subsequent evolutions whenever the clothing allows.

The progression represents personal growth alongside professional development.

Use the portfolio owner's real tattoos as visual references, preserving their recognizable designs and approximate placement.

The final evolution should represent her current appearance, including her complete tattoo collection.

The sequence and timing of tattoo additions will be defined later. Do not invent tattoo designs or assume their chronological order.

## Motion and Interaction

- Vertical scrolling controls avatar rotation and transitions between professional evolutions. Clothing, hair, accessories, expression, and pose may change during the turn. Accompanying text and skill indicators update with the stage.
- Skills accumulate rather than replacing earlier capabilities. Explore minimal labels or unlocked states without arbitrary competency percentages.
- Career stages must follow verified experience. Graphic Designer, Art Director, Brand Designer, Digital Designer, Design Team Lead, and Entrepreneur are candidates, not a finalized sequence.
- Represent Product Design, AI-assisted workflows, and creative coding as current exploration where appropriate. Do not label these as established specialties without supporting experience.
- On desktop, large image-led project cards move from right to left in response to continued vertical scrolling, as a horizontal gallery with part of the next project visible. Visitors should not need a separate horizontal scrolling gesture. Return to normal vertical flow after the project sequence. On mobile, projects stack vertically. See `interaction-spec.md`.
- Priority (approved November 3, 2026): study the Selected Work gallery and the fixed navigation before developing the avatar evolution. The avatar evolution remains a planned future phase, not a discarded idea.
- Skin selector (planned November 3, 2026, optional P1 for the Friday delivery, not implemented): a simplified first step toward the avatar evolution. See `interaction-spec.md`.
- Keep titles clear and supporting card information brief. Provide direct navigation to work so viewing every avatar stage is not required.
- Preserve usable touch and keyboard access. For reduced motion, present readable stages and projects in a normal vertical flow without forced rotation or horizontal movement.
- Mobile must retain readable text, a recognizable full-body avatar, and easy access to projects. Exact mobile choreography is not yet approved.
- Rotation, outfit transitions, and the horizontal sequence require a feasibility check before committing to an implementation. No real-time 3D renderer or asset pipeline has been selected. Follow the HTML/CSS/JavaScript constraints in `AGENTS.md`: Three.js is an approved optional dependency when it offers a clear advantage over native CSS and JavaScript, loaded through ES modules from a CDN or local files. Keep 3D modular and consider performance, accessibility, and mobile compatibility. Additional libraries require approval. This permission does not select Three.js as the renderer or authorize animation implementation.

## Do NOT generate

- Medieval, dark, or visually dense RPG styling.
- A complex game dashboard, arbitrary skill scores, or invented career milestones.
- A dark or saturated main hero background.
- Hard ground shadows, decorative UI shadows applied everywhere, or unnecessary visual effects.
- An avatar based on the reference model's physical identity.
- Oversized feet, exaggerated legs, or cropped full-body framing.
- Mandatory horizontal navigation or a scroll sequence that prevents direct access to projects.
- A motion-dependent experience without an accessible reduced-motion alternative.
- Final headlines based on “Choose your player” or “Choose your skin” without approval. These are exploratory phrases only.
- Unapproved replacements for the current logo or typography.
- An animation showcase that overshadows the project work.
- Changes to the existing Framer project without explicit approval.

## Selected Composition Study

The owner selected option C (`.impeccable/mocks/header-hero-c.png`), with the character as the focal point, and requested removing the adjacent name from the header. The header-only revision is `.impeccable/mocks/header-hero-c-v2.png`. The latest study, `.impeccable/mocks/header-hero-c-v3.png`, replaces the script-like hero name using the actual Dakota Rough specimen as an image-edit reference. This generated transfer is a composition preview, not exact live font rendering, and awaits review. This is composition approval only, not authorization to implement the site. Generated lettering and logo rendering are approximate; implementation must use the actual approved fonts and SVG. The mannequin is a layout placeholder, not a likeness reference. Final copy, avatar, font files, responsive specifications, and motion remain unresolved.

The owner requested a two-line hero name: “Jackie” above “Messaggi,” left aligned. The latest preview is `.impeccable/mocks/header-hero-c-v4.png`. Exact scale and line spacing await visual review; the monogram-only header and character area remain unchanged in intent.

The owner found the header monogram oversized. Revision `.impeccable/mocks/header-hero-c-v5.png` tests a compact monogram, approximately 100 px wide in the 1487 px preview, with the two-line name retained. This size is a review proposal, not a finalized responsive specification.

After further feedback on monogram size, `.impeccable/mocks/header-hero-c-v6.png` tests approximately 70 px width. This supersedes v5 as the latest preview; approval is pending.

Location placement: The owner requested removing “Berlin, Germany” from the hero and reserving it for About. The revised preview is `.impeccable/mocks/header-hero-c-v7.png`. This is a content-placement decision; no site implementation is authorized by it.

Representative avatar composition test: The owner supplied a second GPT-created image with a smiling, glasses-wearing full-body avatar holding a drink and laptop, accompanied by a cat and floating design and AI objects, and authorized testing it in the existing hero. The resulting static preview is `.impeccable/mocks/header-hero-c-v8.png`. It replaces the mannequin, places the supporting objects around the avatar, and tests the skill indicators in a row below the scene. This is a review proposal, not approval of a final avatar, likeness, tattoo references, object selection, indicator placement, or site implementation. The original supplied image remains the identity reference for this test; generated compositing may introduce differences. Typography and logo rendering remain approximate.

The Work, About, and Contact links shown in v8's header are superseded by the monogram-only header approved on November 3, 2026; v8 itself stays unchanged. The owner subsequently requested leaving v8 as it is for now. Retain it as the current provisional composition reference with the unresolved details above; do not interpret this as final design or implementation approval. See `character-bible.md` for asset status and `project-status.md` for continuity.

Hero Study versions 01 to 03 (November 3, 2026, private, in `01 Projects/Portfolio OS/Hero Study/`) build on v8 with the live fonts. Version 03 is the approved Hero direction for the Friday delivery (see Approved Homepage Composition). It supersedes v8's two-line name, role lines, CTA, and skill row for that delivery; v8 remains the avatar and object reference. Versions 01 and 02 are kept as history.
