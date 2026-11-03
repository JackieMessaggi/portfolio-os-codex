## Snoof

*First draft for review. An individual educational project developed during my training in AI-assisted design. Snoof is a high-fidelity prototype, not a launched product.*

### My role and collaboration with AI

I defined the research focus, recruited participants, and personally conducted the interviews. I interpreted the findings, set priorities, evaluated alternatives, and made the product and UX/UI decisions. I also created the Snoof logo directly and developed the brand identity, including its concept, color palette, typography, and graphic language.

ChatGPT and Claude supported research preparation, analysis, documentation, and exploration. I used Claude to help organize the research and affinity mapping, then questioned the proposed patterns and checked their connection to the evidence. Claude Design built and connected the prototype interfaces from my instructions. I directed the work, reviewed the output, requested corrections, and checked the flows iteratively; I did not manually write all of the prototype code.

### The problem

People choosing plants for a home shared with a cat or dog can find a “toxic” or “non-toxic” label without understanding the possible effects or severity. In the interviews, some participants described avoiding or giving up plants because their safety questions remained unresolved. I explored this problem as part of an educational project, with the aim of supporting more informed plant decisions rather than promising that a plant was safe.

### Research

I conducted six interviews with people who lived with cats or dogs and kept houseplants, using AI to help prepare the guide and organize the material. AI-assisted synthesis helped me examine patterns around uncertainty, precautionary plant choices, and how owners interpreted their own pets' behavior; I reviewed those interpretations against the interview evidence. A separate desk research synthesis compared how veterinary and animal-safety resources communicated classifications, effects, and uncertainty, without treating that comparison as clinical validation. The interviews also included contrasting experiences: a binary answer was sufficient for one participant, so I did not treat the need for more explanation as universal or use the small sample to claim prevalence.

### The insight

A toxicity label can answer whether a plant is classified as harmful while leaving the person's actual question unanswered: what could that mean for the pet they live with?

### What was made and why

#### Explain the finding in context

I selected a concept that combined source-attributed plant information with the pet's reported interactions with plants. I chose it because I believed context could make the explanation more relevant than a classification alone. The proposed journey lets someone identify a plant, confirm the plant and pet context, review the finding and its limits, and record a decision. This was a design hypothesis selected for prototyping, not a demonstrated improvement in understanding.

#### Separate classification, evidence, and personal choice

I kept the plant finding, the quality and limits of the evidence, and the person's decision distinct. Earlier compatibility-style verdicts would have compressed those dimensions into a single recommendation, potentially implying more certainty than the evidence supported. A documented classification can coexist with incomplete details or unresolved source limitations, so combining them would hide useful information. Pet behavior could contextualize the explanation, but it would not change source-reported severity or become a personalized risk score.

#### Treat missing information as a meaningful result

I included an information-gap path instead of forcing every check into a toxic or non-toxic conclusion. The criterion was whether the available information supported an applicable finding, not whether the interface could produce a reassuring answer. I also kept the permanent pet profile optional, while requiring the animal species for the check and allowing temporary context. This made it possible to explore the main journey without requiring a saved profile or inventing behavioral information.

#### Connect a personal brand experience to the interface

I developed the logo and visual identity alongside the product, then directed how that language carried into the UI. The brand reference emphasized approachable explanation, empathy, and the relationship between people, pets, and their home. I used those principles to guide an experience that could communicate uncertainty without relying on fear or unsupported reassurance. I am not claiming a documented comparison between every visual alternative; the case can expand on those choices when the relevant design evidence is selected.

#### Build and review a focused prototype

I directed a high-fidelity iOS prototype in Claude Design, supported by a design system and structured documentation. It explored one primary plant-check journey, supporting states, and three scripted content scenarios covering toxic, non-toxic, and insufficient-evidence findings. Rather than treating generated screens as finished, I checked the routes, identified inconsistencies, and requested corrections to interactions such as temporary pet context and editing saved information. The handoff records also distinguish design-system work completed separately from components whose integration into the frozen prototype was deferred.

### Outcome

I produced a high-fidelity interactive prototype and a documented design system, with AI carrying out a substantial part of the technical execution under my direction. The prototype used scripted sample data, with no backend, real plant identification, live evidence retrieval, or persistence across sessions; the supplied documentation records no completed user testing or clinical validation. My flow checks and the documented technical verifications helped identify implementation gaps, but they do not establish usability, comprehension, or product impact.

### What I learned

The hardest part was keeping control of a project spread across many stages, documents, and AI tools. Generating output quickly did not guarantee that it was correct or consistent with earlier decisions. I had to keep checking the relationship between the evidence, the documentation, and what the prototype actually did.

I learned that working with AI requires more than prompts. It requires clear context, explicit decisions, and a systematic way to assess the output. Letting the tools handle more technical execution gave me more room to focus on creative direction and the experience, while still requiring me to understand and review what was being built.

In another iteration, I would establish tool responsibilities, reference documents, and review criteria earlier, then work in smaller increments with more frequent checks. Before making claims about effectiveness, I would need to test whether people understand the findings and their limits without reading them as a safety guarantee. AI accelerated the work; the judgment and responsibility for design decisions remained mine.

### Draft notes and source trail

This section supports editorial review and is not intended as final portfolio copy.

- **Context:** `raw/00 Context/project-2-brief.md`.
- **Problem and limitations:** `raw/01 Discover/problem-framing/selected-problem-sprint-1.md`.
- **Research interpretation:** `raw/01 Discover/insights/insights-sprint-1.md` and `raw/01 Discover/desk-research/desk-research-synthesis-sprint-1.md`. Reviewed or approved synthesis is not equivalent to validated findings.
- **Selected direction and decisions:** `raw/02 Define/concepts/selected-concept-sprint-1.md` and `raw/04 Deliver/design-rationale.md`. The latter is a derived reconstruction, used for explicitly documented decisions rather than to invent missing rationale.
- **Brand intent:** `raw/00 Context/snoof-brand-reference.md`. It preserves historical pending-review labels; authorship and identity-development work above reflect the owner's direct clarification, without claiming every brand standard was finalized.
- **Prototype scope and limitations:** `raw/04 Deliver/implementation-document.md` and `raw/04 Deliver/gap-tracking.md`. These describe historical inspections, not a new independent inspection performed for this draft.
- **Contribution and learning:** the owner's direct account in this conversation.
- Test fixtures, archived alternatives, and intermediate logs were not treated as user evidence or validation. Participant names and identifying interview details are omitted.
- The insight sentence is an editorial synthesis of the selected problem and reviewed insights, not a participant quote. Review it for accuracy along with the first-person decision descriptions.
- Suggested evidence for a later revision: the logo and identity, a finding/evidence screen, the information-gap state, and the main prototype flow. No assets have been selected or integrated in this draft.
