@AGENTS.md
@.agents/voice.md

## Claude Code compatibility

The imported project rules and communication guide apply to Claude Code too, including passages that refer to Codex by name. Keep AGENTS.md as the shared source of project instructions; do not duplicate its contents here.

Before planning or changing anything, read `00 Context/site-brief.md` and `00 Context/visual-direction.md` in full, as required by AGENTS.md. Read the relevant project material before editing it. Conversation history and agent memory do not replace the approved decisions in these files.

### Shared skills

- Project skills live in `.agents/skills/`. The entries in `.claude/skills/` link to those same folders. Edit the originals instead of creating separate Claude copies.
- In Claude Code, invoke skills with `/skill-name`, such as `/case-study` or `/visual-direction`. References to `$skill-name` in shared instructions mean the same skill, not a shell command.
- Read a skill's SKILL.md and required references before following its workflow. Keep the project context and approved visual decisions authoritative.
- Codex plugins, MCP tools, browser sessions, and app connections are not automatically available in Claude Code. Check the actual available tools. If a workflow needs an unavailable integration, explain the limitation and complete only the supported parts without claiming the integration ran.

### Working across agents

- Read `00 Context/agent-collaboration.md` and `00 Context/project-status.md` at session start and follow their handoff and reporting workflow. Read the shared decision log, character bible, and interaction specification when relevant; keep project knowledge in repository files.

- Inspect current files and local changes before editing. Preserve unfinished work from Jackie or another agent.
- Avoid editing the same files simultaneously in Codex and Claude Code.
- Record approved decisions in the existing context files so both agents can read them next session. Do not treat a proposal as approval.
- Keep responses in PT-BR and portfolio content in natural American English, following the shared voice and brief.
