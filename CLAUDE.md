# LORI TV — Claude Code Project Rules

## Mission
Build a personal, premium Samsung Tizen Smart TV entertainment app called **LORI TV**, accompanied by **LORI Remote** (phone PWA) and **LORI Manager** (web dashboard). Home is always the initial route. The app must run on the TV without a PC left on. This repository currently contains planning artifacts only; **DO NOT implement until the user explicitly authorizes a phase**.

## Source of truth, read in this order
1. `docs/MASTER_PROMPT.md`
2. `docs/ARCHITECTURE.md`
3. `docs/ROADMAP.md`
4. `docs/ACCEPTANCE_TESTS.md`
5. `docs/UI_UX_SPEC.md`
6. `docs/ARCHITECTURE_DECISIONS.md` and `docs/PHASE_TRACKER.md`
7. `docs/MOCKUP_INDEX.md` and individual PNGs in `mockups/tv`, `mockups/remote`, `mockups/manager` (35 individual concept screens plus two boards; not pixel-perfect requirements)

For shared-document precedence, use the canonical order in `AGENTS.md`; this list is a reading checklist, not a competing priority order. `docs/ARCHITECTURE_DECISIONS.md` owns ADR numbering.

If documents conflict, flag it before coding. Do not silently invent provider integrations, APIs, licensing, or Samsung compatibility.

## Scope
Samsung TV: Home, Live TV, Sports, Movies, Series, global + category search, EPG, Favorites, Continue Watching, family profiles, subtitles/audio selection, Sports Center, media details/trailers, Watchlist, parental PIN, adaptive quality and Settings.
Phone PWA: QR pairing, navigation, keyboard search, optional speech-to-text, playback controls, Send to TV.
Manager: authenticated source/catalog management, M3U/XMLTV imports, validation, EPG mapping, categories, media metadata, audit logs.

## Technical principles
- TV: Tizen Web Application; React + TypeScript + Vite candidate, subject to device validation. AVPlay as primary for supported streams, HTML5 fallback when appropriate.
- Prefer local-first TV experience. Server is optional for content sync but a remote relay may be needed; decide only after real-device proof.
- Explicit TV focus/navigation model; arrows/OK/Back must always work, no hover-only controls.
- TV uses IndexedDB for cache/progress/preferences, with migrations and per-profile isolation.
- Keep source adapters isolated. M3U, XMLTV, and media metadata are untrusted inputs. No arbitrary remote JS, embedded credentials, or unauthorized stream bypass.
- Respect licensing, CORS, DRM, geographic restrictions and provider terms. Metadata availability does not imply streaming rights.
- Use the mockup's visual direction: dark navy/black, restrained electric blue accents, generous spacing, rounded cards, legible TV-scale typography.
- Build modules with interfaces and dependency boundaries; do not add microservices or a database prematurely.

## Working agreement: no credit-wasting loops
1. Inspect current repo and git status. Summarize what exists and what is missing.
2. Work ONLY on the explicitly authorized phase and acceptance criteria.
3. Before edits, state files to change, technical decisions, risks, and test plan. Ask approval for significant architectural departures.
4. Make small, reviewable changes; avoid unrelated refactors and wholesale rewrites.
5. Run relevant typecheck, lint, unit/integration tests, build, and device checks where possible. Never claim an unrun test passed.
6. At most TWO automated fix attempts per failing root cause. Then STOP and report evidence, suspected cause, and next decision.
7. Do not deploy, purchase services, change external accounts, or install on TV without explicit approval.
8. End every phase with: files changed, test results, manual device verification, unresolved risks, next phase prerequisites, and commit hash if a commit was authorized.
9. Audit continuously, plus independent Codex review at major gates. Reviewer should inspect diffs, not rebuild the project.
10. Do not move to next phase until the user approves.

## Release gates
- Phase 00: real Samsung model/OS/API/player/connectivity proof.
- Phase 01: all screen flows and focus states approved.
- Phase 02: installable TV shell, Home startup, remote controls.
- Phases 03–08: module-specific acceptance tests pass.
- Phase 09: full regression, security review, soak test, signed package and installation evidence.

## Important unknowns
The user reported Samsung UE50M70HAUXXH, software T-X22UDHDEUC-0100-1 and displayed version 213.2 from About on 2026-10-26. These are user-reported device observations, not SDK verification. Tizen version, AVPlay codecs, sideload/dev-mode availability, TV local socket support, and browser speech recognition require verification. See `docs/PHASE_00_COMPATIBILITY_PLAN.md`. Never mark these as verified based on assumptions.

## Prompt execution
- First invocation: `prompts/00_BOOTSTRAP_READ_ONLY.md` only, and STOP.
- Phase prompts: `prompts/01_PHASE_00_COMPATIBILITY.md` through `prompts/10_PHASE_09_FINAL_RELEASE.md`, one at a time after explicit approval.
- Reviewer: `prompts/99_CODEX_REVIEW.md` for read-only independent audits.
- Planning mockups do NOT prove device compatibility or licensed content availability.

## LORI Cast — approved planning scope (not yet implemented)
- Add **selective media casting** to Phase 07 as subphase 07B. Send only a selected playable media item to LORI TV; NEVER capture/mirror the entire phone display, notifications, messages, or other apps.
- LORI Cast is NOT a universal AirPlay receiver, Chromecast receiver, DRM bypass, or a promise to cast content from arbitrary third-party apps. Samsung's built-in AirPlay (if present) remains separate.
- Support authorized catalog media and compatible direct video URLs first; personal phone files are conditional on a secure local transfer/serving feasibility test. No arbitrary URL fetch/proxy, no private network scanning, no unauthorized media extraction.
- Pairing and casting must be authenticated, scoped to the active TV, revocable, and confirmed before changing playback; reject unsolicited commands. Never expose phone content beyond the chosen item.
- Read `docs/LORI_CAST_SPEC.md` and `prompts/08B_PHASE_07B_LORI_CAST.md` before planning 07B; do not start without explicit user approval.


## v3.3 LORI Cast external media requirement
All three flows are in scope: explicit Gallery video, explicit Local File and authorized direct Video URL. Implement only in Phase 07B after device/transport feasibility proof and phase approval. PWA share-sheet and universal third-party casting are NOT guaranteed. Require short-lived authenticated transfer, privacy-by-design, strict URL/SSRF protection and real Samsung tests. Never equate a mockup or plan with working implementation.


## v3.4 — Four approved TV enhancements (PLANNING ONLY)
Include **Sleep Timer**, **Channel Zapping**, **Stream Health**, and **Mini Player / Picture-in-Picture (PiP)** in the approved scope. Sleep Timer, Zapping and Stream Health target v1; PiP is feasibility-gated and must NEVER be represented as guaranteed Samsung OS-level PiP. If AVPlay/HTML5 cannot support a safe in-app mini-player on the actual model, report BLOCKED and offer a static preview/return-to-player fallback for explicit approval. Never silently play two video streams. No code until phase authorization. Read `docs/TV_ENHANCEMENTS_SPEC.md` and corresponding phase prompts.


## v3.5 multi-agent handoff (mandatory)
Before work, read `AGENTS.md`, `docs/HANDOFF.md`, and `docs/MULTI_AGENT_WORKFLOW.md`. Treat Git commits, tests and documented hardware evidence as authoritative, not a prior agent's claims. For an agent switch start with `prompts/CLAUDE_HANDOFF_READ_ONLY.md` and wait for explicit phase approval. Canonical remote: `https://github.com/LorencBzhetaj/tv.git`. Never overwrite an existing origin, force-push, or start coding in read-only bootstrap.
