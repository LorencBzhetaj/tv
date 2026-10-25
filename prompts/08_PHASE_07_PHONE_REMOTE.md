# PHASE 07 — PHONE REMOTE

Read `CLAUDE.md`, `docs/ROADMAP.md`, `docs/ACCEPTANCE_TESTS.md`, `docs/PHASE_TRACKER.md`, `docs/ARCHITECTURE_DECISIONS.md`, and relevant UI mockups before action. First inspect git status. Confirm that I explicitly authorized **Phase 07**; if not, STOP.

## Task
Implement mobile PWA pairing, TV approval, secure scoped commands, D-pad, keyboard search, voice fallback, Send to TV and reconnect.

## Mandatory process
1. Present current-state audit, exact in-scope changes, proposed file list, risks, assumptions, and relevant acceptance IDs **before edits**. Ask before any major architectural decision.
2. Make minimal, modular changes for this phase only. Do not implement future phases or use unapproved providers.
3. Run and report relevant lint, typecheck, unit/integration, build and real-device tests. Do not claim unrun tests passed.
4. For a failing root cause, attempt at most TWO automated fixes, then STOP and report evidence.
5. Produce final gate report: diff summary, test commands/results, device evidence, security/content checks, ADRs, unresolved issues, and next-phase dependencies.
6. Update `docs/PHASE_TRACKER.md` with **verified evidence only**; do not mark COMPLETED until I approve.
7. Wait for explicit approval before advancing to Phase 07B; Phase 08 follows accepted Phase 07B.

Do not deploy, purchase, sign with unapproved credentials, or install on a real TV without explicit authorization.

## Hand-off to Phase 07B
Phase 07 must expose secure pairing, scoped device/session commands, and transport abstraction needed for future `LORI Cast`. Do NOT implement Cast in Phase 07; after passing Phase 07 exit gate, request separate approval to run `prompts/08B_PHASE_07B_LORI_CAST.md`.
