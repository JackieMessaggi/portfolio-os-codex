# Character Bible

Status: Character Master v1.2 and the Modeling Reference approved as visual direction on November 4, 2026. No production model, rig, animation, or final asset exists yet. The Hero keeps the clay dummy for the November 6 delivery.

## Authoritative direction

Follow the Avatar Art Direction and Tattoo progression sections of `visual-direction.md`: recognizable stylized Jackie, full body, balanced proportions, deliberate clothing/hair/accessories, consistent identity, and a soft ground shadow on light ivory. The approved character below defines that identity.

## Approved character (November 4, 2026)

**Character Master v1.2** is the identity reference:

- Recognizable Jackie in a stylized 3D look inspired by Fortnite's character style (style influence only; no game identity or assets, per `interaction-spec.md`). Facial features and proportions as approved in v1.2.
- Hair: black, asymmetrical, with an undercut.
- Outfit: black tank top, wide-leg tailored trousers without cargo pockets, studded belt, platform boots.
- Default presentation pose: hands in pockets. Future animations may have her holding objects.
- Accessories (such as the earrings, necklace, and wristband in the sheets) are not part of the master character and may change.

**Modeling Reference** complements the Master and does not replace it: same identity, tattoo-free, A-pose, black hair, arms free for rigging.

Iteration rule: preserve the approved identity in every iteration and change only the elements Jackie explicitly asks to change.

## Tattoo map

Jackie's original photographs are authoritative for design and placement. Sides are anatomical (the character's own right and left).

| Area | Design |
| --- | --- |
| Chest | Symmetrical floral design (approved). |
| Right arm | Colorful Alice in Wonderland sleeve: Queen of Hearts with flowers (upper arm), Mad Hatter (middle), Alice (forearm). |
| Left arm | Pink skull (upper arm); black-and-white horned cat (forearm). |
| Back | Angel doll on the right, devil doll on the left. |
| Right leg | Colorful female portrait, outer calf. |
| Left leg | Black-and-white woman, outer calf. |

Tattoos are applied later as UV textures on the model, keeping anatomical placement. They accumulate across career stages; the chronology is still open. Tattooed AI turnarounds were rejected for inconsistency; do not use them as references.

## Production pipeline (planned)

3D modeling → refinement → rigging → animation → GLB → Three.js. Nothing in this pipeline has started: no Meshy account or modeling tool selected, no production model, rig, or animations.

## Current asset register

| Asset | Status and use |
| --- | --- |
| `01 Projects/Portfolio OS/Avatar/Character Master_ Jackie’s Tattoo Design Sheet.png` | Character Master v1.2, approved identity reference, November 4, 2026. 1024 × 1536 PNG: front and back in the default pose plus tattoo detail panels. Private. |
| `01 Projects/Portfolio OS/Avatar/Black-Purple Mohawk Character Turnaround.png` | Modeling Reference, approved November 4, 2026. 1536 × 1024 PNG: tattoo-free A-pose turnaround (front, three-quarter, sides, back) with face, hair, and material details. The hair is black despite the file name. Private. |
| `01 Projects/Portfolio OS/Avatar/Screenshot 2026-11-02 at *.png` (8 files) | Original tattoo photographs, authoritative for design and placement (confirmed by Jackie, November 4, 2026). Not yet mapped file by file to tattoo areas. Private. |
| `02 Site/assets/avatar/avatar-dummy-clay.webp` | Temporary neutral 3D clay dummy (Three.js render, transparent WebP, 1170 × 1390, 43 KB), in the Hero since November 4, 2026; stays in the Hero for the November 6 delivery, no refinement before then. Not a likeness. Source: `01 Projects/Portfolio OS/Avatar Dummy/render.html`. |
| `.impeccable/mocks/header-hero-c-v8.png` | Earlier provisional hero reference with a GPT-generated avatar, cat, and floating objects. Superseded as a likeness reference by Character Master v1.2 (its blue/purple hair no longer applies). Local only, not public. |
| `.impeccable/mocks/header-hero-c-v7.png` | Earlier layout study with mannequin; not a likeness reference. |
| `01 Projects/Portfolio OS/Hero Study/assets/avatar-from-v8.png` | Private crop of v8 used in Hero Studies 01 to 03. Flattened; not a production asset. |
| Original GPT-created avatar images supplied in chat | Earlier composition-test references, superseded for identity by Character Master v1.2. No repository path recorded. |
| Skin versions for the skin selector (P1) | Not created. Stages and outfits still need Jackie's confirmation. See `interaction-spec.md`. |

## Unresolved

- Choose the modeling tool and set up the pipeline (model, refinement, rig, animation, GLB export, Three.js integration).
- Tattoo chronology across career stages, and the verified career stages themselves, including any stage-specific outfits.
- Which objects she holds in future animations.
- Whether supporting objects or companions (such as the cat in v8) return with the new character.

On each new approval, record the source asset path, role, approval scope, and date here and in `decision-log.md`. Preserve originals and version derived assets.
