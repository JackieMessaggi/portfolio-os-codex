# Site Brief

## Structure
- Multi-page: A home page with a separate page for each project. Use a storytelling structure that fits each project's discipline; do not force every project into a traditional UX case study.
- About page: Yes. A dedicated page for my background and multidisciplinary experience.
- Navigation: The header holds only the small JM monogram in Deep Eggplant, linking back to the start of the home page; it has no navigation links and does not need to be fixed. Section navigation uses a fixed bar: horizontal at the bottom on desktop, compact and vertical on the right on mobile, with clickable sections, an active-section indicator, and position or progress. Final section names are open. The name “Jackie Messaggi” is not the Hero headline (decision of November 4, 2026); it may appear in the introductory text or in About, and stays identifiable in the page metadata (title, description, author) and the monogram's accessible name. Follow `00 Context/visual-direction.md` and `00 Context/interaction-spec.md`; this decision does not authorize site implementation.

## Case Study Display
- Index: Start with image-based project cards. This is an initial decision that can be revisited.
- Inside case study: Sections with an anchor-link menu so visitors can jump to specific sections or scroll through the full page. Section names should fit the project content.
- Cover images: Yes. Each project should have a cover image in addition to its home-page card image.

## Motion and Interaction
- Animation level: 3. More expressive motion, including scroll-driven movement, hover effects, and page transitions where appropriate.
- Specific interaction: Explore scroll-driven movement of characters and page elements, inspired by https://about.senbuzy.com/.
- Specific interaction: Explore a three-dimensional accordion-fold presentation for the Damyller project, inspired by https://leporello.framer.website/ and the supplied screen recording. Panels unfold and fold as scrolling progresses, revealing images and text. This is a possibility to explore, not an approved implementation.
- Specific interaction: Consider unexpected interactions in which page elements respond to the mouse cursor. The exact behavior is still to be defined.
- Specific interaction: Elements may enter and reveal progressively during scrolling, and Selected Work is explored as a horizontal gallery on desktop. Motion supports the narrative and must not turn the portfolio into an effects showcase. See `00 Context/interaction-spec.md`.

## References
- Like: https://about.senbuzy.com/ because the character and other elements move in response to scrolling, as described by the portfolio owner.
- Like: https://leporello.framer.website/ because its folding, paper-like 3D panels reveal content through scrolling. The supplied screen recording was reviewed; the website itself could not be accessed. Consider this specifically for the Damyller project.
- Like: https://nesilnoble.com/ for its navigation experience, progressive reveals, and the way projects are presented during scrolling. Do not copy its visual identity, colors, typography, or code.
- Dislike: Corporate, overly serious portfolio sites because they lack the personality I want to communicate. The site should convey credibility with a distinctive heading typeface, accent color, unexpected interactions, and friendly writing.

## Tone and Personality
- Write published portfolio content in natural American English, in the first person.
- Sound experienced, credible, confident, warm, and approachable.
- Add a light, friendly touch to the writing. Subtle humor is welcome when natural, but never forced.
- Use specific language and preserve my personality. Avoid corporate jargon, generic design claims, and exaggerated marketing language.
- Present my actual multidisciplinary experience across brand, visual design, UI, digital products, and creative systems. Do not position me as an end-to-end Senior Product Designer.
- Never invent metrics, results, research, responsibilities, or professional AI expertise.
- Do not use em dashes or en dashes as punctuation.

## Do NOT generate
- An overly serious, corporate-feeling portfolio.
- Forced jokes or an exaggeratedly quirky tone.
- A traditional UX case study format imposed on every project.
- Unapproved final typography, colors, or other visual specifications. Define these through `00 Context/visual-direction.md` before generating the site structure.
- Changes to the existing Framer project without explicit approval. Use it as a reference for content and assets, not as the automatically approved final design.
