# LORI TV — Execution Roadmap v3.5

**Status: PLANNING COMPLETE, DEVELOPMENT NOT AUTHORIZED.** Do not create app source, install, deploy, buy services or contact providers until user explicitly authorizes the next phase. Each phase needs a human approval gate. Use `docs/PHASE_TRACKER.md` for evidence-based status.

| Phase | Goal | Deliverables | Exit gate |
|---|---|---|---|
| 00 | Samsung feasibility | model/firmware verification; signed test .wgt; AVPlay/HTML5 codec test; pairing transport spike; ADRs | Device evidence and risks approved |
| 01 | UI/UX implementation spec | validate 35 individual mockups and two overview boards; complete focus maps; responsive states; accessibility; component map | User approves final UI and flows |
| 02 | TV shell | Tizen React/TS setup, Home default, routing, focus engine, settings storage | Remote-only navigation on TV; package builds |
| 03 | Live TV + EPG | authorized channel catalog, safe M3U/XMLTV parsing, playback, guide, channel search | Channel switch, failures, timezones tested |
| 04 | Movies/Series + Search | global/category search, detail screens, episodes, trailers/track support | Search scope, unavailable content, playback tested |
| 05 | Profiles + Personalization | watchlist, progress, favorites, kids/PIN, profile switching | Isolation and PIN bypass tests pass |
| 06 | Sports + Smart Player | schedule/result adapters, source linkage, adaptive quality and recovery | Graceful API/stream failures; playback soak |
| 07 | LORI Remote | PWA, pairing, D-pad, keyboard, voice fallback, Send to TV | Device pairing/revoke/reconnect tests |
| 08 | LORI Manager | protected admin, imports, EPG mapping, catalog revision/publish/rollback | RBAC, audit, malformed import tests |
| 09 | Release audit | regression, performance, security, package signing, installation guide | Real-device acceptance and user approval |

## For every phase
1. Read CLAUDE.md and all relevant docs; inspect git status.
2. Respond with scope, changed files, assumptions, risks, tests. Wait for approval if significant decision needed.
3. Implement ONLY current authorized phase in small changes.
4. Run typecheck, lint, unit/integration, build; real-device steps as applicable.
5. Two fix attempts max per root cause, then stop with evidence.
6. Report test commands/results, unresolved risks, manual checks, files changed, commit hash if authorized.
7. Update phase tracker only with verified evidence. Wait for user's explicit go-ahead before next phase.

## Suggested release milestones
v0.1 after phase 02; v0.5 after phase 05; v0.8 after phase 08; v1.0 after phase 09. These are scope gates, not promised calendar dates.

### Phase 07B — LORI Cast (new mandatory subphase, after Phase 07 pairing)
**Scope:** selective video-only handoff from LORI Remote to the TV; authorized catalog item, supported direct URL, and required Gallery/Files paths subject to independent feasibility validation. TV playback controls sync to phone. Explicitly no full-screen mirroring or notifications. 
**Deliverables:** cast command contract, TV cast receiver handler, PWA cast flow, casting status/error UX, threat model, integration/device tests, and design mockups for Cast Picker, Casting and Unsupported Media.
**Exit gate:** selected video plays on TV without phone notifications/screens; unauthorized/revoked sessions fail; invalid/DRM/unsupported media fail safely; Wi-Fi loss/reconnect is handled. The implementation may be blocked by device capabilities, and must report that rather than fake support.
**Sequence:** Phase 07 -> 07B -> 08 -> 09. v0.8 milestone requires Phase 07B acceptance as well.


### v3.3 extension — Phase 07B External Media
**Mandatory scoped deliverables:** Gallery picker -> secure temporary media handoff; Files picker -> same secure pipeline; direct Video URL input -> strict validation and TV playback. Implement in this order, behind feature flags, with independent acceptance gates. Discovery/feasibility is required before committing to transport design; a relay must be approved explicitly because it may incur costs. Update UI spec, threat model and per-source test evidence. Universal casting from arbitrary apps/websites and protected streams is out of scope.


### v3.4 — Four enhancements integrated without adding phases
- **Phase 00:** spike/test Tizen CH+/CH− key availability, AVPlay surface resize/reparent and mini-player memory/lifecycle; capture exact model and firmware. PiP remains feasibility-gated.
- **Phase 01:** specify UI/focus states for timer, channel zapping overlay, stream health indicator and mini-player; mockups pending.
- **Phase 03:** implement Channel Zapping + Stream Health as part of Live TV, with authorized fallback only.
- **Phase 06:** implement Sleep Timer and **conditional** in-app Mini Player/PiP as Smart Player capabilities; never power off TV or promise native PiP.
- **Phase 09:** regression/soak/security/device tests for all four, with feature flags and safe fallback.
- **Exit gates:** see `docs/TV_ENHANCEMENTS_SPEC.md` and `docs/ACCEPTANCE_TESTS.md`. No code has been started.

## v3.5 dependency clarification
Sequence: 00 -> 01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07 -> 07B -> 08 -> 09 -> final acceptance. Earlier phases may define authorization/session interfaces and use fixtures, but may not claim profile/cast integration PASS before Phases 05/07B exist. Repeat cross-feature parental, timer and cast tests at the dependency gate and Phase 09. Gallery/Files/Video URL are required investigation/delivery paths subject to separate feasibility gates; BLOCKED requires explicit scope disposition before full 07B acceptance.
