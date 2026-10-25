# AGENTS.md — LORI TV / Codex rules

## Scope and repository
Canonical GitHub remote: `https://github.com/LorencBzhetaj/tv.git`. This is a **planning-only** package. No coding, installations, remote pushes or deployment until the user explicitly approves the specific phase. Never assume the remote is empty or overwrite its contents.

## Source of truth (read before any action)
1. `docs/MASTER_PROMPT.md`
2. `docs/ARCHITECTURE.md` and `docs/ARCHITECTURE_DECISIONS.md`
3. `docs/ROADMAP.md` and `docs/PHASE_TRACKER.md`
4. `docs/ACCEPTANCE_TESTS.md`, `docs/UI_UX_SPEC.md`, `docs/MOCKUP_INDEX.md`
5. `docs/LORI_CAST_SPEC.md`, `docs/TV_ENHANCEMENTS_SPEC.md`
6. `docs/HANDOFF.md`, `docs/MULTI_AGENT_WORKFLOW.md`
7. `CLAUDE.md` and phase-specific prompt.

If any documents disagree, report the conflict and ask before making an architectural choice. Mockups are visual concepts, not proof of functioning features or rights to stream depicted content.

## Invariants
- Home is the startup route. Samsung remote navigation is primary.
- Products: LORI TV (Tizen), LORI Remote (phone), LORI Manager (admin).
- Global/category search, IPTV/EPG, movies/series, profiles, parental controls, sports, captions, smart player, watchlist, voice search, casting, sleep timer, zapping, stream health and conditional PiP are in scope.
- LORI Cast includes catalog content, authorized direct video URLs, gallery/local files with user selection, secure ephemeral handling, and **no screen or notification mirroring**. Do not promise universal AirPlay, DRM bypass or arbitrary-site playback.
- Mini-player/PiP and local phone-to-TV transport are feasibility-gated on real Samsung hardware.
- Respect licensing, provider terms, DRM, CORS and device limits. Never introduce pirated streams or unauthorized scraping.
- Treat M3U/XMLTV/URLs as untrusted; protect against SSRF, XSS, malicious redirects, credential leakage and unbounded uploads.

## Operating protocol
- **First turn is read-only**: inventory files, read docs, check git status/remote without changing them, identify contradictions, propose Phase 00 test plan; STOP for approval.
- After approval: one phase at a time, minimal diff, no unrelated refactors, no auto-advance.
- Do not create or change a Git remote without explicit approval. `git remote add origin ...` only if `origin` is absent; otherwise inspect and confirm the existing URL.
- Never force-push, reset, rebase shared branches, delete user files, run migrations against production, install software, buy services or expose secrets without approval.
- Run appropriate typecheck, lint, tests and build after authorized code changes. Real device evidence must not be fabricated.
- Max two attempted fixes for the same root cause; then stop and report blocker.
- At every phase gate, update `docs/PHASE_TRACKER.md` and `docs/HANDOFF.md` with actual evidence; status READY_FOR_REVIEW until user accepts.
- Prefer concise outputs and low token use. Summarize results rather than dumping huge logs.

## Handoff to Claude Code
Before switching: cleanly commit approved changes, record branch/commit, changed files, exact commands/results, blockers, device observations and next recommended phase in `docs/HANDOFF.md`. Claude Code must independently inspect repo status, docs and tests before proceeding. Never mark a phase completed solely because another agent says so.
