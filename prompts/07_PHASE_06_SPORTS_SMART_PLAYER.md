# PHASE 06 — SPORTS SMART PLAYER

Read `CLAUDE.md`, `docs/ROADMAP.md`, `docs/ACCEPTANCE_TESTS.md`, `docs/PHASE_TRACKER.md`, `docs/ARCHITECTURE_DECISIONS.md`, and relevant UI mockups before action. First inspect git status. Confirm that I explicitly authorized **Phase 06**; if not, STOP.

## Task
Implement sports fixtures/results via approved provider, source linking, quality adaptation and robust playback recovery. No invented live data.

## Mandatory process
1. Present current-state audit, exact in-scope changes, proposed file list, risks, assumptions, and relevant acceptance IDs **before edits**. Ask before any major architectural decision.
2. Make minimal, modular changes for this phase only. Do not implement future phases or use unapproved providers.
3. Run and report relevant lint, typecheck, unit/integration, build and real-device tests. Do not claim unrun tests passed.
4. For a failing root cause, attempt at most TWO automated fixes, then STOP and report evidence.
5. Produce final gate report: diff summary, test commands/results, device evidence, security/content checks, ADRs, unresolved issues, and next-phase dependencies.
6. Update `docs/PHASE_TRACKER.md` with **verified evidence only**; do not mark COMPLETED until I approve.
7. Wait for explicit approval before advancing to Phase 07.

Do not deploy, purchase, sign with unapproved credentials, or install on a real TV without explicit authorization.


## v3.4 Smart Player additions
Implement Sleep Timer with in-app playback stop, cancel and countdown. Implement in-app Mini Player only if Phase 00 device proof and explicit user approval establish compatibility; otherwise report blocked and document a safe fallback. Never claim native OS PiP or TV power-off. Test casting handoff and session ownership.
