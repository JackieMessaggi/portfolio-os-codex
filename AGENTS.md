# Portfolio OS

## Standing instructions

At the start of every session, read 00 Context/site-brief.md, 00 Context/visual-direction.md, and .agents/voice.md before planning, designing, writing, or building anything.

Treat these files as the source of truth for the portfolio's positioning, content, visual direction, and communication style.

Before making significant changes, inspect the relevant existing files. Do not assume missing information or silently change approved decisions.

Follow `00 Context/agent-collaboration.md` for collaboration across Codex, Claude Code, and Claude Design. At session start, also read `00 Context/project-status.md`; consult `decision-log.md`, `character-bible.md`, and `interaction-spec.md` in `00 Context/` when relevant. Update the shared status after meaningful state changes and before a planned handoff.
---

## Who I am

Name: Jackie Messaggi
Role: Senior Designer | Brand, Product & Creative Systems
Years of experience: 18+ years in the creative and design industry
Location: Berlin, Germany
Currently: Looking for a senior hands-on design role while expanding my skills in Product Design, AI-assisted workflows, and vibe coding.

My background spans graphic design, brand identity, art direction, editorial design, UI design, digital products, design systems, and design leadership.

My career is multidisciplinary and non-linear. I started in graphic design, visual communication, and art direction, moved into digital interfaces and product experiences, and most recently worked as a Design Team Lead while remaining hands-on.

I am not positioning myself as a Senior Product Designer. My strongest areas are visual design, UI craft, brand systems, design systems, typography, creative direction, and translating complex requirements into clear visual solutions.

## What this site is for

Build a distinctive, credible portfolio that communicates my multidisciplinary experience, demonstrates the quality of my work, and attracts senior design opportunities aligned with my actual skills.

What kind of work I want to attract: 
Senior hands-on design roles across UI, visual design, brand design, and visual systems.
Opportunities involving digital products, interfaces, brand experiences, and design systems.
Opportunities to apply and further develop AI-assisted design, prototyping, and vibe coding skills.
Teams exploring how AI can improve creative processes, design workflows, and digital product development.
Roles where I can contribute strong visual design expertise while growing into new AI-driven ways of working.
Teams that value strong visual craft, creativity, consistency, and collaboration.
Roles where I can contribute both strategic design thinking and hands-on execution.
Companies open to English-speaking designers working in Berlin or remotely.

What I do not want to attract: 
Roles primarily focused on UX research, quantitative product analytics, or product strategy.
Pure people-management positions with little hands-on design work.
Roles requiring professional fluency in German.
Opportunities that depend on presenting me as an end-to-end Senior Product Designer.

## Portfolio principles

The portfolio must reflect my actual experience, not an idealized career path.
Show the range of my work without making the portfolio feel unfocused.
Prioritize strong visuals supported by clear context and meaningful explanations.
Communicate what I personally contributed to each project.
Distinguish individual responsibilities from team contributions.
Explain design decisions, challenges, and outcomes when supported by evidence.
Never invent metrics, research findings, user feedback, business impact, or responsibilities.
Never claim professional AI expertise based only on coursework or personal experiments.
Do not force every project into a traditional UX case study format.
Use the storytelling structure that best fits each project's nature: brand, editorial, UI, digital product, or visual system.
Keep the writing specific, natural, confident, and free of generic design jargon.


## Platform

HTML, CSS, and JavaScript.

- No frameworks or build tools.
- No npm or bundlers.
- One HTML file per page and one shared CSS file.
- Prefer native HTML, CSS, and JavaScript whenever possible.
- Three.js is an approved optional dependency for 3D elements, character animation, and interactive visual experiences.
- Load Three.js through ES modules using a CDN or locally hosted files.
- Use Three.js only when it provides a clear advantage over native CSS and JavaScript.
- Keep 3D components modular and separate from the site's core functionality.
- Consider performance, accessibility, and mobile compatibility.
- Do not introduce additional libraries without approval.

Treat the existing Framer portfolio as a reference for content and assets, not as the automatically approved final design.

Do not modify the existing Framer project without explicit approval.

## Tone

Professional, conversational, confident, warm, and direct, with a subtle playful touch.
Voice: first person.
The writing should feel natural, personal, and approachable, reflecting an experienced designer with a creative personality and a sense of humor.
Allow occasional wit, personality, and unexpected phrasing, but keep it subtle and intentional. Never force jokes or sound overly quirky.
Avoid corporate jargon, exaggerated claims, generic AI-generated language, and unnecessary formality.
All published portfolio content must be written in natural American English.

## Visual rules

Run $visual-direction to generate this section. It will be written to 00 Context/visual-direction.md and loaded automatically at the start of every session.

Do NOT generate anything not specified in 00 Context/visual-direction.md.

## File structure

02 Site/ holds the live site files.
00 Context/ holds the portfolio brief, personal context, positioning, and visual rules that Codex reads every session.
01 Projects/ holds one folder per project: raw source material and the generated case study. This folder is private: it is ignored by Git, and no agent may add, version, or publish its content. Final case studies may be published in 02 Site/ only after my explicit approval. See `00 Context/agent-collaboration.md`.
- `.agents/voice.md`: how Codex talks in this project, in every message, command and skill (see Voice below)

## Voice

Every message Codex writes in this project follows `.agents/voice.md`: in conversation, in every command and skill, and in the setup and GitHub tools. It is loaded here so it applies from the first message:

Read `.agents/voice.md` at the start of every session.

All Codex communication must follow this guide.
Published portfolio content must follow the tone defined in `00 Context/site-brief.md`.

## Public Repository Safety Check

This repository is public by decision. Before every commit and every push, Codex and Claude Code must run this check:

- Inspect the actual files and diff, including new, modified, and deleted files, not only `.gitignore`.
- Check for credentials, tokens, secrets, and unnecessary personal data.
- Confirm that no content from `01 Projects/` is included without my explicit approval.
- Check for confidential material from clients, research participants, or third parties.
- Check for temporary files, caches, and changes outside the approved scope.
- Check that images, mocks, and documents are approved for public release.
- Before a push, check again whether the set of commits to send has changed since the last review.

Never show secret values in the report. If anything is doubtful or risky, stop and ask for my decision. Present a concise summary of the check before asking for approval to commit or push. Approval of a commit does not authorize a push, and approval of a push does not authorize a deploy.

## Workflow Guidance & Next Steps

At the end of each completed task:

1. Briefly summarize what was completed or changed.
2. Identify the next logical step based on the current
   project state, course requirements, and pending decisions.
3. Recommend one concrete next action, explaining why it matters.
4. When appropriate, suggest the exact skill or command to run next.
5. Highlight blockers or decisions that require my input
   before proceeding.

Do not stop after reporting task completion. Proactively guide me through the workflow, but do not execute the next task without my approval.

Within an authorized task, complete the necessary reads, edits, and checks without asking for approval at each step. Ask before expanding the scope or making a significant design, content, architecture, or publishing decision that has not already been approved. Approval of the current task does not authorize starting a separate next task.

Keep responses concise, practical, and in PT-BR.
Avoid generic recommendations and unnecessary repetition.
