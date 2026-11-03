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

Keep the main avatar area light ivory. Use orange sparingly for selection, progress, and small highlights. Use dark text on colored controls and verify contrast before implementation; orange is not approved as small text on ivory. Beige and pink should remain subordinate to the avatar and project imagery.

Do not introduce other interface colors. Muted Sage Grey and Deep Burgundy were considered but are not part of the selected direction. Avatar clothing, rendered materials, photographs, and project assets may contain their own colors.

## Typography

Retain the current portfolio typography and logo. Do not redesign the logo or replace the established typefaces.

Read-only Framer inspection confirmed Dakota Rough 400 for the hero name and major page titles, DM Sans 400/500/600/700 for reading and supporting text, and Big Shoulders 700/900 for section headings and graphic text in the old portfolio. The owner has explicitly removed Big Shoulders from the rebuild. Do not use it in any role.

Heading: Dakota Rough, weight 400, for the headline and major section headings. Final sizes remain open.
Body: DM Sans, weight 400 for reading text, with 500/600/700 available for supporting hierarchy. Final sizes remain open.
Caption: DM Sans, with a clear hierarchy and readable sizing.
Do not introduce Dakota Rough Outline or Inter merely because they appear in the old project's font inventory; their use in the rebuild has not been approved.
Load via: The published portfolio declares Dakota Rough Regular, weight 400, from `https://framerusercontent.com/assets/RX45IJDrRojclxGn1JuRLUJXdYE.woff2`. Its internal PostScript name is `DakotaRough-Regular`, verified by native font rendering. The actual-font specimen is `.impeccable/mocks/dakota-actual-font.png`. This source was used temporarily for the composition study only; local webfont packaging and license documentation remain unresolved. Do not substitute fonts or add remote runtime dependencies without resolving this.
Do not introduce other font families.

## Local Logo Assets

The owner supplied two SVG files in `02 Site/assets/logo/`:

- `Jackie_Logo_black_Short.svg`
- `JM_Logo.svg`

Preserve the supplied originals. Visual inspection confirmed that `Jackie_Logo_black_Short.svg` is the JM monogram and `JM_Logo.svg` is the full-name wordmark. The owner approved the monogram for the header and replacing its black fill with the approved Deep Eggplant `#400849`. The derived asset is `Jackie_Logo_eggplant_Short.svg`. Header scale and spacing remain subject to the static composition comparison. The current HTML still contains a logo placeholder; no site implementation is approved at this stage.

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
- Header: approved JM monogram in Deep Eggplant on the left, without an adjacent name; Work, About, and Contact links on the right. The name appears prominently in the hero. Use orange for interaction and selection without competing with the identity.
- Desktop hero: start from a 12-column grid, with five columns for text, one for separation, and six for the full-body avatar. Preserve breathing room and the approved soft ground shadow. Exact widths and spacing remain open.
- Typography hierarchy: the existing expressive face serves the headline and major section headings; the existing reading face serves role names, descriptions, and captions. Verify the actual font assignments before rendering an identity-faithful study. Keep the professional specialty understandable without following the animation.
- Skills: a small set of cumulative indicators, without numerical competency bars.
- Selected Work: begin the study with four large image-led cards. Each has a persistent project name, discipline, and concise contribution caption. Four is a starting composition count, not an approved project selection. Preserve each project's own image colors rather than tinting assets to match the interface.
- Evaluate card scale, image framing, and rhythm statically before developing the intended scroll-driven horizontal sequence.
- About: a short personal introduction with a route to the eventual dedicated About page. Contact: a clear closing section without repeating the resume or introducing another elaborate visual sequence.
- Mobile: text followed by the avatar, vertically stacked projects, and readily accessible navigation. Exact motion choreography remains open.
- Next deliverable: a static composition image before code. Final copy, project selection and order, likeness assets, exact fonts, dimensions, and motion timing remain unresolved. No HTML/CSS, Framer changes, or animation implementation are authorized by this composition approval alone.

## Avatar Art Direction

- Create a recognizable, stylized version of Jackie, with a friendly, expressive personality and a fashion-forward editorial attitude.
- Use the supplied character image exclusively for rendering style, materials, texture, and finish. Do not copy its face, physical appearance, or outfit as Jackie's identity.
- Show the entire body with balanced proportions. Avoid exaggerated legs or feet.
- Give clothing, hair, and accessories deliberate visual detail. Preserve a consistent identity through every professional evolution.
- Place a soft ground shadow beneath the avatar to establish contact with the floor. Keep the surrounding hero background smooth and light. This shadow is approved specifically for the avatar; it does not establish a general UI drop-shadow style.
- Personal likeness references and final avatar designs remain to be defined. No avatar asset has been created or approved.

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
- After the evolution sequence, large image-led project cards move from right to left in response to continued vertical scrolling. Visitors should not need a separate horizontal scrolling gesture. Return to normal vertical flow after the project sequence.
- Keep titles clear and supporting card information brief. Provide direct navigation to work so viewing every avatar stage is not required.
- Preserve usable touch and keyboard access. For reduced motion, present readable stages and projects in a normal vertical flow without forced rotation or horizontal movement.
- Mobile must retain readable text, a recognizable full-body avatar, and easy access to projects. Exact mobile choreography is not yet approved.
- Rotation, outfit transitions, and the horizontal sequence require a feasibility check before committing to an implementation. No real-time 3D renderer or asset pipeline has been selected. Existing HTML/CSS/JavaScript and no-dependency constraints remain active.

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
