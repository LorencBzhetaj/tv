# LORI TV — Execution Roadmap v3.5

**Current authorization (2026-10-31): M4 architecture documentation only; GLOBAL / FREE-FIRST, PAID-IF-JUSTIFIED / BROAD product policies approved.** Specification READY_FOR_REVIEW; M4 implementation NOT STARTED. No source/provider/workflow/hosting/TV/Git changes authorized. M3 documentation checkpoint7009b81 published;23 local M2/M3 implementation paths preserved pending separate source checkpoint. Phase boundaries unchanged.

| Phase | Goal | Deliverables | Exit gate |
|---|---|---|---|
| 00 | Samsung feasibility | model/firmware verification; signed test .wgt; AVPlay/HTML5 codec test; pairing transport spike; ADRs | Device evidence and risks approved |
| 01 | UI/UX implementation spec | validate 35 individual mockups and two overview boards; complete focus maps; responsive states; accessibility; component map | User approves final UI and flows |
| 01.5 | Interactive preview | Approved Full View/direct immersive fixture prototype; checkpoint 170540900012a0bf67a1aa5e1a7d1c4dad125d46 | User accepted and GitHub checkpoint verified; no production implementation |
| 02 | TV shell | Separate production identity/config approval, Home/navigation/focus, immersive Samsung AVPlay controller boundary and abstract catalog/provider contracts using fixtures; no real providers | Focus/route/controller fixtures; native integration and any TV deployment separately authorized |
| 03 (03A foundation) | Content Engine + Live TV/EPG | Free-first scheduled static publisher, approved automatic Live ingestion, provenance/eligibility, refresh/cache/revocation and authorized EPG; channel search/zapping/health | Content Engine acceptance plus existing T03 switch/failure/timezone tests; no manual playlist required |
| 04 | Movies/Series + Search | Metadata joined only to authorized playable VOD, eligible seasons/episodes, global/category search, tracks | No metadata-only watchable entries; source rights and Samsung playback evidence |
| 05 | Profiles + Personalization | watchlist, progress, favorites, kids/PIN, profile switching | Isolation and PIN bypass tests pass |
| 06 | Sports + Smart Player | approved sports metadata/content linkage, advanced reliability, quality/recovery | No inferred sports rights; graceful provider failure and playback soak |
| 07 | LORI Remote | PWA, pairing, D-pad, keyboard, voice fallback, Send to TV | Device pairing/revoke/reconnect tests |
| 08 | Full LORI Manager (when needed) | protected admin, editing/import/EPG mapping/audit; builds on Phase03A publisher | Later approval when editing/sync justifies it; deferred from initial MVP, not deleted from future product |
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
v0.1 after phase 02; v0.5 after phase 05; v0.8 after approved later modules (Phase08 Manager only when needed); v1.0 after phase 09 for accepted release scope. These are scope gates, not calendar dates; deferred Manager scope must be explicit, never reported implemented.

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
Sequence: 00 -> 01 -> 01.5 -> 02 -> 03 (03A foundation first) -> 04 -> 05 -> 06 -> 07 -> 07B -> 08 when needed -> 09 -> final accepted release scope. Earlier phases may define authorization/session interfaces and use fixtures, but may not claim profile/cast integration PASS before Phases 05/07B exist. Repeat cross-feature parental, timer and cast tests at the dependency gate and Phase 09. Gallery/Files/Video URL remain separately feasibility-gated; no claim of full 07B acceptance while unresolved. Phase03A is a subphase, not a new product/platform or an always-on backend.


## Phase01 closure and Phase02 entry — 2026-10-27
Player rule updated by the final approved Phase01.5 contract: Play/Watch enters immersive fullscreen directly; OK shows controls; Back closes topmost dialog then hides visible immersive controls without stopping. Back with controls hidden, or from Normal Player, Stop/Close + return to exact origin/focus/scroll; explicit presentation control preserves the session. No automatic mini-player/background playback. English default, Albanian additional, dedicated Favorites and explicit-selection-only Live preview remain approved. This supersedes the older Phase01 uniform Back rule.
Phase02 proposed order: directory/identity/configuration approval -> tokens/shared components -> Home/sidebar -> centralized focus/history/modal handling -> fixture skeletons -> player Stop/Close barrier -> settings/capabilities -> focused validation and separately approved device cycle. Candidate React/TS/Vite and ADR-007 focus implementation remain proposals.
User defers detailed Manager layouts, external casting implementation, PIN enforcement, Sleep Timer, advanced recovery/performance/stability and unverified hardware to their owning phases. Optional mini-player/PiP/background playback is future work only and excluded from initial Phase02; this supersedes earlier enhancement scheduling if it implies default availability. Missing later-phase art is not a shell blocker absent a demonstrated direct dependency. Existing future product requirements/feasibility gates remain, not silently deleted. No Phase02 execution authorized in this closure task.

## Free-first Content Engine placement — 2026-10-28

ADR-004/005/008 policy and [ARCHITECTURE.md section 13](ARCHITECTURE.md#13-free-first-content-engine-contract--2026-10-28) govern the new requirements. Phase03A implements provider registry/ingestion, source/territory/expiry eligibility, EPG normalization and bounded scheduled artifact publication before Live integration. Initial MVP has no mandatory paid infrastructure/PC/manual playlist. Hosting selection, named provider/publication permissions and source format/device evidence are gates, not assumptions. Public static data only; no secrets, provider tokens, paid failover or app backend by default.

Dependency order: approved production shell/abstract fixtures (02) -> publisher/schema/allowlist/cache tests (03A) -> separately approved real Live provider/native playback tests (03) -> authorized VOD and linked metadata (04) -> advanced sports/reliability (06). Full Manager (08) is not a dependency for automatic catalog updates. No media integration or infrastructure creation is approved by this documentation checkpoint. New measurable tests CE-01..CE-16 are in ACCEPTANCE_TESTS.md; existing T03/T04/T06/T08 semantics remain.


## Historical Phase02 M3 proposed next milestone — approval required at planning time

M2 closed with18 tests/22 security assertions and12 browser footer/view/locale cases PASS; no footer overlap bug or runtime correction. Detailed M3 input/focus/history architecture, seven proposed new files, exact modification scope, test matrix and risks are in HANDOFF. ACCEPTANCE_TESTS T02-M3-01..12 all PENDING.

Sequence after approval: typed remote actions/repeat guard -> optional Tizen key adapter -> explicit region/node focus graph and modal scopes -> bounded origin/focus/scroll history -> integrate existing Home/frame/preferences -> PC browser and regression checks. Optional Menu/media/colors require actual supported-key intersection and proposed tv.inputdevice privilege; OS Home/volume/power remain owned by Samsung. Native-select versus app-owned option-dialog decision and ADR-007 implementation choice need review. Synthetic nested screens test the stack only, no catalog/profile/Favorites/player implementation.

First obtain separate M2 checkpoint approval if desired, then explicit M3 source/config approval. Physical Samsung validation/deployment is a later separate gate; prior diagnostic key/playback results do not certify production focus. No M3–M6 auto-start; no providers, paid infrastructure, Content Engine or AVPlay scope.


## Historical M3 implementation review checkpoint — 2026-10-30

Local explicit input owner, Tizen adapter, graph/scopes/scroll manager and bounded Back stack implemented without new dependencies or privileges. Existing Home/frame/preferences integrated; inactive M2 PC adapter retained but unbundled. Native select presentation gains app-owned remote choice dialogs, approved tokens unchanged. Only Home is rendered; nested routes tested synthetically, no catalog/provider/player integration. Future Player leave requires explicit release guard; no playback behavior implemented.

46 tests,22 security assertions,3×1000 stress sequences,50 input-owner cleanup cycles and12 browser cases PASS; schema/inventory/typecheck/build PASS. Actual mandatory/optional key delivery, timing, lifecycle/Exit and Samsung readability remain physical-device gates, not reuse of diagnostic PASS. Next: user review, then separately authorized checkpoint/device-validation step. M3 not automatically completed or published; M4–M6 NOT STARTED.


## M3 accepted completion / M4 boundary — 2026-10-31

M3 COMPLETED in user-confirmed scope: actual Samsung D-pad,OK,Back,Menu,view modes,EN/SQ,language persistence,modal trapping,focus/scroll restoration and Home-return PASS. Signed WGT and cryptographic/digest/configuration checks PASS, one installation and corrected launch succeeded. Obsolete diagnostic removed using full application ID; production preserved. Physical held-key timing, Cancel-first exit, deliberate Exit/relaunch, optional keys, quantified overscan/readability and soak remain PENDING, not silently passed. Existing local46 tests/22 security assertions remain recorded evidence.

Next permissible milestone is a separate M4 architecture and requirements review against approved shell/fixture plans, identifying scope, contracts and acceptance criteria before implementation. M4–M6 NOT STARTED. No Content Engine/provider/AVPlay work, workflow, hosting or infrastructure is authorized. M2/M3 source/checkpoint remains uncommitted; exact inventory review and separate Git approval required.


## M4 architecture review workstream — 2026-10-31

ARCHITECTURE section15 owns detailed system/contracts/flows/security/cost specification; ADR-004/005/008 dated refinements record approved policies versus open gates. Sequence: review contracts and unresolved provider/territory/signing/cache/host decisions -> separately checkpoint existing M2/M3 source -> obtain exact implementation authorization. No extra numbered phase. Phase02 interfaces/fixtures ->03A publisher/Content Engine ->03 Live/EPG ->04 VOD ->06 sports/reliability ->08 Manager. GLOBAL/BROAD imply neither worldwide rights nor promised content counts. Paid-if-justified needs measured benefit and separate spend/deployment approval. M4 ARCHITECTURE REVIEW READY_FOR_REVIEW; M4 IMPLEMENTATION NOT STARTED.
