# Multi-Agent Collaboration & Continuity

Portfolio OS is developed collaboratively using OpenAI Codex, Claude Code, and Claude Design.

Core principle: No task, decision, or project knowledge should depend exclusively on a single AI agent or conversation.

## 1. Agent responsibilities

| Agent | Preferred responsibilities |
| --- | --- |
| Codex | Primary implementation, Three.js development, prototyping, debugging, and automation. |
| Claude Code | Technical review, implementation, debugging, refactoring, and continuation of tasks started by Codex. |
| Claude Design | Visual exploration, UX, interaction design, and design specifications. |

These are preferred responsibilities, not exclusive ownership. Codex and Claude Code must be able to perform each other's development tasks. Jackie approves significant decisions. These roles do not authorize implementation or publishing beyond the current approved task.

## 2. Agent handoff

When switching agents because of token limits, availability, or task suitability:

1. Read `AGENTS.md` (or `CLAUDE.md`, including its imports), `00 Context/site-brief.md`, `00 Context/visual-direction.md`, `.agents/voice.md`, and this guide.
2. Review `00 Context/project-status.md` and the relevant task files. Read the decision log and character or interaction documents when relevant.
3. Verify the actual implementation, pending changes using Git status and diffs, and available tests and validation evidence. Run relevant non-mutating checks where possible; report unavailable or unrun checks explicitly. Git status or a previous report alone does not verify completion.
4. Follow Handoff Acceptance below before modifying any file.
5. After approval, continue from the existing state without unnecessarily restarting or duplicating work.

Never assume another agent's work is complete without verifying it. Before a planned handoff, refresh the status snapshot and its optional Active Task / Handoff section with the exact continuation point. An unexpected interruption may prevent this update; the incoming agent must reconstruct the state through the checks above and record any uncertainty.

### Handoff Acceptance

When Codex or Claude Code takes over a task started by another agent, the reading and verification steps above are mandatory for both planned and unexpected handoffs. Before modifying any file, present a concise summary to Jackie with:

- **Estado encontrado:** what is already implemented and verified.
- **Pendências:** unfinished work, corrections, blockers, and verification gaps.
- **Plano de continuidade:** the proposed approach and files in scope.
- **Próxima ação:** the first concrete action to execute.

Wait for Jackie's approval before making modifications, even if the task was previously authorized for the outgoing agent. Once the handoff plan is accepted, complete its authorized scope without requesting approval for each routine step.

## 3. Shared documentation

Store project-critical information in repository files, not exclusively in chat history.

| File in `00 Context/` | Purpose |
| --- | --- |
| `project-status.md` | Minimal snapshot: where we are, what is ready, what is missing, and the next step. |
| `decision-log.md` | Approved decisions and significant changes, with date, source, and scope of approval. |
| `character-bible.md` | Character identity, asset references, approval status, and unresolved identity details. |
| `interaction-spec.md` | Approved interaction intent, implementation constraints, and unresolved animation behavior. |

Keep documentation concise and current. Link to existing authoritative material rather than copying entire specifications. `AGENTS.md` owns project requirements, the site brief owns structure and content principles, visual direction owns visual decisions, and `.agents/voice.md` owns communication style. The new documents support these sources; they do not silently override them. Record proposals, provisional references, approvals, implementation, and verification as distinct states.

For Claude Design sessions without repository access, provide the relevant current files and assets as a context packet. Save returned specifications and outputs in the repository, with their approval status, before another agent depends on them. The agent with repository access records the handoff; do not claim Claude Design reads or writes local files automatically.

Keep `project-status.md` extremely lean and readable in under a minute. Preserve its four sections: Where we are, What is ready, What is missing, and Next step. Only while a task is in progress or interrupted, add Active Task / Handoff with seven concise fields: Task and status, Last agent, Completed, Pending / blockers, Files changed, Tests / validation, and Next action. Record only actual work and validation; mark unknown or unrun checks explicitly. Remove that section when the task is complete. Replace outdated information instead of appending history. Do not add a diary, completed-task chronology, repeated specifications, or long file/test lists. Store approved decision history in `decision-log.md` and technical details in relevant task or specification files.

## 4. End-of-task reporting

Every agent, including Codex, Claude Code, and Claude Design, must end every task by suggesting one concrete next step and briefly explaining why it matters. Identify any approval or input needed; do not start that next task without authorization.

After meaningful work, also report what was completed, which files changed, what was tested and the results, and what remains unfinished or blocked. Update the concise `project-status.md` snapshot after important milestones or changes in project state, including before a planned handoff. Record significant approved decisions in the log and update the relevant authoritative specification in the same task.

After Handoff Acceptance when applicable, complete necessary actions within the authorized task without repeated approval requests. Starting a separate next task or making an unapproved significant decision requires Jackie's approval.

## 5. Collaboration safeguards

- Do not overwrite another agent's unfinished work or edit the same files simultaneously. Record active ownership and files in progress in `project-status.md`; this is a coordination record, not an automatic file lock. Confirm ownership if another task is still marked active.
- Preserve approved visual and technical decisions. Raise unresolved conflicts with Jackie before acting on the conflicting portion; continue independent authorized work where possible.
- Do not introduce new dependencies without approval. Three.js already has optional approval under the conditions in `AGENTS.md`; that does not select a renderer or authorize animation implementation.
- Do not modify the deployed portfolio or existing Framer project without explicit approval. Edits to local files in `02 Site/` must fit the authorized implementation scope; current composition approval alone does not authorize them.
- No agent may deploy or publish the site without Jackie's explicit approval for that specific publication. The repository is public by decision, and GitHub Pages hosts the current preview at https://jackiemessaggi.github.io/portfolio-os-codex/. `.github/workflows/pages.yml` runs only through manual `workflow_dispatch`; commits and pushes must not trigger deploys. Do not add automatic triggers or run the workflow without approval.
- `01 Projects/` is private, including all current and future projects. It is ignored in `.gitignore`. No agent may add, version, push, or publish its content, or add exceptions to that rule, without Jackie's approval. Earlier commits keep a copy of the Snoof draft by decision; do not rewrite history. Final case studies may be adapted into `02 Site/` only after Jackie's explicit approval of that content.
- Run the Public Repository Safety Check in `AGENTS.md` before every commit and push.
- Keep changes reversible whenever practical. Preserve source assets and existing local changes; do not commit, push, publish, or discard work as a side effect of a handoff.
- Check each agent's actual tool access. Plugins, MCP connections, browser sessions, and credentials are not automatically shared. Keep secrets out of continuity documents.

## 6. Continuity over agent preference

Choose the agent best suited to the task, but prioritize uninterrupted progress. If an agent becomes unavailable or reaches its usage limit, another should resume using the repository and its documentation without requiring a conversational summary from the unavailable agent.

This workflow does not automatically launch agents or transfer sessions. Parallel work requires clearly separated files and scope; switching agents does not itself authorize parallel editing.
