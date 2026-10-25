# PHASE 01 — UI UX

Read `CLAUDE.md`, `docs/ROADMAP.md`, `docs/ACCEPTANCE_TESTS.md`, `docs/PHASE_TRACKER.md`, `docs/ARCHITECTURE_DECISIONS.md`, and relevant UI mockups before action. First inspect git status. Confirm that I explicitly authorized **Phase 01**; if not, STOP.

## Task
Review 35 individual mockups and two overview boards, create screen flows, component map, D-pad focus maps, loading/empty/error/offline states, phone layouts, and manager flows. Only implement design prototypes if explicitly authorized.

## Mandatory process
1. Present current-state audit, exact in-scope changes, proposed file list, risks, assumptions, and relevant acceptance IDs **before edits**. Ask before any major architectural decision.
2. Make minimal, modular changes for this phase only. Do not implement future phases or use unapproved providers.
3. Run and report relevant lint, typecheck, unit/integration, build and real-device tests. Do not claim unrun tests passed.
4. For a failing root cause, attempt at most TWO automated fixes, then STOP and report evidence.
5. Produce final gate report: diff summary, test commands/results, device evidence, security/content checks, ADRs, unresolved issues, and next-phase dependencies.
6. Update `docs/PHASE_TRACKER.md` with **verified evidence only**; do not mark COMPLETED until I approve.
7. Wait for explicit approval before advancing to Phase 02.

Do not deploy, purchase, sign with unapproved credentials, or install on a real TV without explicit authorization.


## v3.4 design scope
Design Sleep Timer, Channel Zapping overlay, Stream Health error/retry states, and feasibility-conditional Mini Player. Read `docs/TV_ENHANCEMENTS_SPEC.md`. New dedicated mockups are pending; do not claim the PNGs already exist.
