# Multi-agent workflow — Codex ↔ Claude Code

## Single source of truth
The checked-out Git repository, its committed documentation, tests and evidence—not chat history—define the current state. `AGENTS.md` guides Codex; `CLAUDE.md` guides Claude Code; both defer to the shared docs and this workflow. Never allow simultaneous writes to the same branch.

## Initial setup (human supervised)
1. Extract the package into a local folder; open that folder in Codex.
2. Inspect `git status`, `git remote -v`, and `git log -1 --oneline` before initialization. If the folder is not a Git repo, ask before `git init`.
3. The intended remote is `https://github.com/LorencBzhetaj/tv.git`. If `origin` exists, check its URL; never overwrite automatically. If remote contains commits, reconcile safely rather than force-push.
4. Execute `prompts/CODEX_00_BOOTSTRAP_READ_ONLY.md` first. No coding.
5. User explicitly approves each next phase; follow phase prompt only then.

## Phase lifecycle
PENDING → IN_PROGRESS → BLOCKED or READY_FOR_REVIEW → COMPLETED (only after user acceptance). Each phase gate must include: scope, diff, branch/commit, automated test output, real device evidence when applicable, risks, decisions, rollback path, and next phase proposal. If no device access, mark hardware checks UNVERIFIED, never PASS.

## Switching agents
1. Current agent stops modifications; records a concise handoff in `docs/HANDOFF.md` and tracker.
2. Commit only authorized changes; do not push without approval. Working tree must be explained if dirty.
3. Next agent runs `prompts/CODEX_HANDOFF_READ_ONLY.md` or `prompts/CLAUDE_HANDOFF_READ_ONLY.md` depending on tool.
4. Next agent checks `git status`, branch, log, docs, tests and actual code; reports discrepancies and awaits approval.
5. Never replay completed phases, silently rewrite architecture, or continue beyond authorized scope.

## Low-credit guardrails
One primary coding agent per phase; optional independent reviewer. Prefer targeted tests and concise logs. Two repair attempts per root cause; stop and report. No loops or bulk speculative refactors.

## Special feasibility gates
Samsung hardware compatibility; AVPlay codec/DRM behavior; local network casting transport; native Share integration; PiP; CH+/- key events. Keep conditional features clearly labeled until verified.
