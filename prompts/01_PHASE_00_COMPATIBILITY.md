# PHASE 00 — COMPATIBILITY

Read `CLAUDE.md`, `docs/ROADMAP.md`, `docs/ACCEPTANCE_TESTS.md`, `docs/PHASE_TRACKER.md`, `docs/ARCHITECTURE_DECISIONS.md`, and relevant UI mockups before action. First inspect git status. Confirm that I explicitly authorized **Phase 00**; if not, STOP.

## Task
Validate exact Samsung model, firmware/Tizen version, dev mode, minimal signed .wgt installation, AVPlay/HTML5 authorized sample streams, and phone connectivity options. Gather physical evidence. No full app build.

## Mandatory process
1. Present current-state audit, exact in-scope changes, proposed file list, risks, assumptions, and relevant acceptance IDs **before edits**. Ask before any major architectural decision.
2. Make minimal, modular changes for this phase only. Do not implement future phases or use unapproved providers.
3. Run and report relevant lint, typecheck, unit/integration, build and real-device tests. Do not claim unrun tests passed.
4. For a failing root cause, attempt at most TWO automated fixes, then STOP and report evidence.
5. Produce final gate report: diff summary, test commands/results, device evidence, security/content checks, ADRs, unresolved issues, and next-phase dependencies.
6. Update `docs/PHASE_TRACKER.md` with **verified evidence only**; do not mark COMPLETED until I approve.
7. Wait for explicit approval before advancing to Phase 01.

Do not deploy, purchase, sign with unapproved credentials, or install on a real TV without explicit authorization.


## v3.4 compatibility checks
Test/register remote CH+/CH− on the exact TV and document fallback; prototype AVPlay/HTML5 in-app video surface resize/mini-player, lifecycle and memory without assuming OS PiP. Record firmware and actual evidence. Do not proceed to full implementation in this phase.
