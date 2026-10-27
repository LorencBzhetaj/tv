# LORI TV — Acceptance Test Matrix v3.5

**Testing labels:** AUTOMATED (unit/integration/E2E), DEVICE (real Samsung/phone), MANUAL (human), PROVIDER (terms/rights verification). Never claim DEVICE PASS based on browser simulator.

| ID | Phase | Scenario | Evidence required |
|---|---|---|---|
| T00-01 | 00 | Confirm exact model, firmware, Tizen API and dev mode | TV settings photo and SDK diagnostics |
| T00-02 | 00 | Install signed minimal .wgt; cold launch from icon | TV photo/video and logs |
| T00-03 | 00 | Play authorized HLS/MP4; try subtitle/audio/quality controls | Per-codec capability matrix |
| T00-04 | 00 | Pair phone LAN spike; test fallback relay need | iOS/Android and TV network logs |
| T01-01 | 01 | All 35 individual mockups and two overview boards reviewed; focus maps approved | User approval and annotated flow map |
| T02-01 | 02 | Always open Home, never autoplay last channel | DEVICE cold/relaunch |
| T02-02 | 02 | D-pad/OK/Back across all sidebar routes | DEVICE focus audit |
| T02-03 | 02 | Recover focus after modal/route change | DEVICE test |
| T03-01 | 03 | Import malformed/oversized M3U safely | AUTOMATED negative tests |
| T03-02 | 03 | Channel search/filter/favorite/switch | AUTOMATED + DEVICE |
| T03-03 | 03 | EPG timezone, DST, overlap, missing and expired | AUTOMATED + DEVICE |
| T03-04 | 03 | Stream fails, retries bounded, channel change cancels previous | DEVICE + logs |
| T04-01 | 04 | Global vs scoped category search, accents and no results | AUTOMATED + DEVICE |
| T04-02 | 04 | Movie/series detail, episode resume and unavailable item | AUTOMATED + DEVICE |
| T04-03 | 04 | Only supported subtitles/audio/tracks selectable | DEVICE |
| T05-01 | 05 | Per-profile watchlist/favorites/progress isolation | AUTOMATED + DEVICE |
| T05-02 | 05 | Kids/PIN blocks locked playback and profile escape | AUTOMATED + DEVICE |
| T06-01 | 06 | Sports provider missing/stale/rate-limited | AUTOMATED + DEVICE |
| T06-02 | 06 | Quality fallback, buffer recovery, 2h soak without crash | DEVICE logs and memory |
| T07-01 | 07 | Pair expiry, TV approval, revoke and replay defense | AUTOMATED + DEVICE |
| T07-02 | 07 | Remote D-pad/keyboard/Send to TV, reconnect | DEVICE iOS+Android |
| T07-03 | 07 | Voice denied/unsupported uses keyboard fallback | DEVICE |
| T08-01 | 08 | Manager RBAC, audit logs, malicious imports | AUTOMATED security tests |
| T08-02 | 08 | Publish versioned catalog; rollback and offline cache | AUTOMATED + DEVICE |
| T09-01 | 09 | Full regression, signed package, startup and restore | CI logs + DEVICE |
| T09-02 | 09 | Verify content rights and no client-side credentials | PROVIDER + security review |

## Content Engine FREE-FIRST acceptance — 2026-10-28

All CE tests below are PENDING implementation/execution. Policy approval is not an AUTOMATED, PROVIDER or DEVICE PASS. ARCHITECTURE.md section 13 / ADR-004/005/008 define the shared contracts and initial budgets; existing T00..T09 meanings/evidence are preserved.

| ID | Phase | Measurable acceptance | Evidence required |
|---|---|---|---|
| CE-01 | 03A | Initial system uses only approved free plans, zero mandatory paid VPS/database/backend/media hosting/custom domain; quotas/retention bounded and no automatic paid upgrade | MANUAL plan/terms/usage-budget review; no account provisioned by this document |
| CE-02 | 03A/03 | With development PC off and TV online, cold start loads an approved catalog without playlist/URL input; required authentication cannot be bypassed | DEVICE cold launch and provider/network observations |
| CE-03 | 03A | After a successful changed six-hour publish, foreground online TV adopts the new valid revision within 30 minutes; startup/resume also checks; delayed/dropped/disabled job is detected as stale | AUTOMATED scheduler/clock fixtures + deployed timing evidence; no exact scheduler SLA claim |
| CE-04 | 03A/04/06 | Every main watchable item has an approved rights/territory/format-eligible, unexpired resolvable source; metadata-only, revoked, expired, known-failed and unknown-provider fixtures excluded; series exposes only eligible episodes | AUTOMATED eligibility/projection tests + PROVIDER rights record; HTTP 200 fixture alone must not create DEVICE PASS |
| CE-05 | 03A | Reject unknown API/media/CDN/artwork origins, unsafe schemes, private/link-local redirects, oversized input, XML DTD/entities and malformed playlists; all permitted redirects revalidated | AUTOMATED negative tests + least-privilege Tizen access/CSP review; deny at first invalid destination |
| CE-06 | 03A | Entire public deployment and runner logs/artifacts contain no API keys, cookies, credentials, bearer/signed-private URLs, private provider payload or personal history; separate publication rights for metadata/artwork/EPG/media | AUTOMATED export inventory/secret tests + PROVIDER republication approval, including preview URLs |
| CE-07 | 03A/03 | Selected source rights/URL/control lease enforced before playback and while active; generated lease <=24h; known revocation disables/removes source and stops active session; unreliable/rolled-back clock cannot extend authorization | AUTOMATED boundary/time tests + DEVICE controller stop; offline discovery latency explicitly recorded |
| CE-08 | 03A | Online TV applies a valid published revocation within 30 minutes with observed host cache <=10min; old catalog/site rollback cannot undo tombstones or policy high-watermark | AUTOMATED replay/rollback tests + deployed CDN/poll measurement; host choice blocked if target cannot be met |
| CE-09 | 03A | Bad signature/schema/digest, partial upload, mixed revisions and failed refresh leave active LKG unchanged; rollback uses higher policy sequence and current revocation/expiry filtering | AUTOMATED corruption/transaction/replay tests; catalog signing separate from Tizen keys |
| CE-10 | 03A/03 | Hosting timeout/404/429/offline: still-valid authorized LKG may be used; expired/revoked or no-cache state disables Play and shows unavailable/Retry; recovery swaps one complete revision without losing saved IDs/focus | AUTOMATED outage tests + DEVICE cold/resume tests; never claim offline media playback or indefinite stale authorization |
| CE-11 | 03A | Scheduled jobs need no generated Git commits; changed/static-control snapshots only; one publisher; <=10min/run, <=2 upstream concurrency, <=2 transient retries, lower provider quotas and Retry-After respected | AUTOMATED controlled publish/429/overlap/failure tests + hosting usage report; no billable fallback |
| CE-12 | 03A/04 | EPG rolling 48h with six-hour refresh, stale/DST/overlap/missing handled; daily metadata and IDs/attribution consistent; <=256KiB control, <=2MiB shard, <=50MiB deploy and <=20MiB active TV cache enforced | AUTOMATED size/time/mapping tests + DEVICE memory evidence; lower provider limits win; budgets are caps, not required catalog counts |
| CE-13 | 02/03/04 | Zero LORI ad injections/pop-ups/ad-player iframes/ad-page navigation/unapproved tracker scripts; original provider ads and attribution preserved/disclosed | AUTOMATED UI/network inventory + PROVIDER terms + DEVICE observation; no ad-removal promises |
| CE-14 | 03/04/06 | Each enabled provider/format profile has real target Samsung AVPlay prepare/play, moving picture, sound, advancing time and Stop/Close evidence; HLS >30s across segments, VOD seek/pause where supported, Live session/channel switch tested | DEVICE user confirmation + redacted native events; per-source UNKNOWN stays UNKNOWN until actually tested; Phase00 sample PASS does not certify new sources/DRM |
| CE-15 | 02 fixtures; native 03/04 | Play/Watch direct immersive; OK transport; Back topmost modal -> visible transport -> hidden-controls Stop/Close + exact origin/focus/scroll; Normal Player Back closes; repeated Back coalesced; no mini/background session | AUTOMATED fixture transitions + separately approved DEVICE evidence; no native PASS from browser preview |
| CE-16 | Future extension | Switch an approved host/backend adapter using unchanged domain/catalog/provider contracts, stable IDs/profile references and UX; changed origin/trust config explicit; token/entitlement providers blocked until backend approved | AUTOMATED adapter contract/migration fixtures + MANUAL security/cost approval; no paid/auth/DRM bypass fallback |

T03-03/T03-04, T04-02, T06-01/T06-02 and T08-02 continue to apply at their owning gates. A network-reachable manifest is distinct from successful native preparation/playback; a technical PASS is distinct from provider authorization. No new media/hosting/device tests have run in this documentation checkpoint.

## Proposed performance targets (not yet measured)
Cold Home interactive <=5s on target TV under normal network; D-pad focus feedback <=150ms; local indexed search <=300ms for test dataset; paired LAN command latency typically <=300ms; two-hour playback soak without critical crash. If target is not achievable, report measured data and ask for revised target.

## LORI Cast — Phase 07B acceptance
- [ ] User chooses exactly one authorized media item on phone and sends it to the paired LORI TV; TV requests explicit confirmation when policy requires.
- [ ] Playback starts only if media format, network and source authorization are compatible; failure is clear and non-crashing.
- [ ] No phone display, app UI, notifications, messages, or audio from unrelated apps are transmitted.
- [ ] Play/pause/seek/status from paired phone remain consistent with TV playback; disconnects and re-pairing are handled.
- [ ] Unpaired, revoked, expired, replayed and wrong-TV commands are rejected; logs do not reveal private URLs/tokens.
- [ ] URL validation blocks non-allowlisted/private network targets and unsafe schemes; no generic URL proxy.
- [ ] Personal-file transfer (if enabled) is explicit, temporary, resource-limited and cleaned up; if unsupported, UI labels it unavailable.
- [ ] Device testing documents iOS/Android + exact Samsung model/firmware; built-in AirPlay is tested/documented separately if available.


## v3.3 — External Media acceptance matrix (not yet executed)
- [ ] Gallery iOS: explicitly selected video -> paired Samsung; no screen/notification exposure.
- [ ] Gallery Android: same result; denied permissions and cancellation handled.
- [ ] Files: MP4 and compatible MOV verified on actual TV; unsupported codec fails cleanly.
- [ ] Video URL: direct allowed MP4/HLS works when supported; ordinary webpage link reports unsupported.
- [ ] Security: block localhost/private/link-local/metadata IP, malicious redirects, unauthenticated devices, revoked sessions, oversized files, replay, stale uploads.
- [ ] Reliability: cancel/stop, Wi-Fi interruption, timeout, temporary file cleanup, bounded resource use.
- [ ] Privacy: no notification, screen mirroring, photo library enumeration, or automatic cloud upload.
- [ ] Record real Samsung firmware/codec evidence and iPhone/Android versions; unverified means pending.


## v3.4 — TV enhancements (PENDING, not tested)
- [ ] **Sleep Timer:** options Off/30/60/90 minutes, remaining-time display and cancel; playback stops at expiry without turning off the TV; no stale timer after restart; remote navigation works.
- [ ] **Channel Zapping:** CH+/CH− work where key registration supports them; accessible fallback otherwise; skip invalid/restricted channels, handle list ends, restore last channel, no unexpected source switching.
- [ ] **Stream Health:** report buffering/offline/errors from actual playback events; bounded retry/backoff, user-visible error, no infinite loops; alternate sources only if explicitly authorized for same channel; no private URLs in logs.
- [ ] **Mini Player/PiP:** real-device proof for supported AVPlay/HTML5 behavior, D-pad focus, overlay/back/fullscreen, app lifecycle and 2-hour memory soak; when unsupported, feature hidden/disabled with documented fallback. No second decoder assumption.
- [ ] All four tested with remote, loss of internet, profile/parental restrictions, casting handoff and Samsung firmware details; no result marked PASS without evidence.

## Initial v3.5 evidence clarification (historical; superseded by final checkpoint below)
T00-01 is only PARTIAL: user reported model/software details and same-network placement on 2026-10-26; platform API, developer mode and SDK diagnostics are UNVERIFIED. T00-02/03/04 are NOT RUN. Hardware availability is not a compatibility PASS.

All external Cast paths are required scope with independent feasibility gates. A blocked Gallery/Files path is not satisfied merely by an unavailable UI label; record evidence and obtain a scope change before accepting reduced delivery. Phase 01 reviews 35 individual PNGs and two boards, and must complete missing Manager content, external-media flows and TV-enhancement states.

## Phase 00 R3 — isolated HTML5 audio acceptance
R2 icon/Apps launch/R1 regression: user-confirmed physical PASS. The following R3 physical results remain PENDING; simulated unit checks and signed-package validation do not satisfy DEVICE evidence.

| ID | Scenario | Evidence and criterion | Current DEVICE status |
|---|---|---|---|
| T00-A01 | Local metadata/no autoplay | Load gives finite duration; no sound before explicit Play | PENDING |
| T00-A02 | Play/pause/resume/time | Playing/time advance, pause freezes clock/sound, resume continues | PENDING |
| T00-A03 | Mute/unmute/element volume | Property/event agree; user separately reports audible behavior | PENDING |
| T00-A04 | Failed load and recovery | Intentional malformed local fixture reports error; explicit Recover+Play works | PENDING |
| T00-A05 | Focus/navigation/Back/lifecycle | D-pad/OK accessible, Back stops/returns to R1, no auto-resume on visibility return | PENDING |
| T00-A06 | TV-speaker audibility | User personally confirms sound through TV speakers; never inferred from time/events | PENDING |

R3 uses packaged public-domain Media-440Hz derivative MP3 and an explicitly invalid local fixture. Source/license in media/LICENSE.txt. No streaming URL, new network privilege, video or AVPlay in R3 audio scope.

## R3 confirmation clarification and R4 device gates — 2026-10-26
User confirms R3 Audio physically tested and works. This is general confirmation only; no explicit results for each grouped A01..A06 scenario were supplied, so all individual statuses above remain PENDING. Do not infer mute, recovery, lifecycle, pause/seek details or TV-speaker routing from a general works statement.

| ID | R4 scenario | Required physical evidence | Status |
|---|---|---|---|
| T00-V01 | HTML5 local MP4 H264/AAC | Metadata, moving picture and audible sound after explicit Play | PENDING |
| T00-V02 | Remote play/pause/resume/seek | Visible/time change, freeze/resume, seek callback/event and focused controls | PENDING |
| T00-V03 | In-app fullscreen/Back/Stop | Correct picture rectangle, first Back returns controls, second stops/returns R1 | PENDING |
| T00-V04 | Native HTML5 local HLS | Independent local VOD load/play result; no assumption from MP4 or capability hint | PENDING |
| T00-V05 | AVPlay local MP4 | API/open/preparation/PLAYING/PAUSED/seek/stop/close in valid states | PENDING |
| T00-V06 | AVPlay local HLS | Independently recorded local playlist/segment compatibility, picture/sound | PENDING |
| T00-V07 | Error/recovery/buffering | Intentional error handled, explicit Recover+Play works; real buffer events if present | PENDING |
| T00-V08 | Single-player/lifecycle | Switching releases old engine, no double audio/video, no auto-resume | PENDING |
| T00-V09 | Actual picture/TV-speaker audio | User confirms both for each tested engine/format | PENDING |

R4 package/local fixture/state-machine/signature validation PASS does not satisfy any DEVICE result. Network HLS/buffering remains a separate pending capability; local-file rejection is not a blanket HLS failure.


## Phase 00 accepted checkpoint — 2026-10-27 (Europe/Budapest)
This entry supersedes earlier preparation/deployment/pending summaries for the tested scenarios only. User has explicitly confirmed physical results on Samsung UE50M70HAUXXH, Tizen TV 10.0.

| Scenario | Physical result | Scope of evidence |
|---|---|---|
| R6 AVPlay packaged MP4 | PASS | Moving picture, TV-speaker sound, pause/resume, seek +/-3s, fullscreen/Back, Stop/reload, return to R1 |
| R8 AVPlay HTTPS HLS VOD | PASS | Moving picture, sound, advancing playback clock, >30s uninterrupted across segments, Stop/Close successful |
| R7 AVPlay packaged local HLS | FAIL; non-blocking for Phase 01 | Files accessible; prepareAsync timeout followed by PLAYER_ERROR_NOT_SUPPORTED_FORMAT. Not a general HLS failure |
| Intentional failed-load recovery | PENDING; deferred | Expected invalid-fixture error observed; Recover + explicit Play success not confirmed. Revisit Phase 06 stability/player work and Phase 09 regression |
| Remote navigation | PASS | Prior user-confirmed arrows/OK/Back/focus/exit/relaunch; R1 return navigation confirmed |

- Working deployed R8 WGT: LORITVDiagnostic/Debug/LORITVDiagnostic.wgt; SHA-256 526030eeb6c890682af3f84538ab7f321f57ca47b01e68e5c4bca79c9e00ea11. tz install and tz run each succeeded once, exit 0; launch PID20473 debug0. Package, configuration/SDK schema and author/distributor XML signatures with 25/26 reference digests passed before deployment. Certificate continuity verified; not a general PKI chain audit.
- Proven MP4 approach: check wgt-package/media/video-test.mp4 using tizen.filesystem.pathExists/isFile, generate tizen.filesystem.toURI, pass returned URI unchanged to av.open; filesystem.read required for checks. No manual prefix, decode or scheme stripping.
- Proven HTTPS HLS approach: exact fixed Apple test URL https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/gear1/prog_index.m3u8 passed unchanged to av.open; internet privilege, access limited to https://devstreaming-cdn.apple.com with subdomains=false; CSP media-src self/file/exact HTTPS origin, connect-src self/exact origin. No wildcard network origin, HTTP downgrade, TLS bypass, packaged remote media or automatic fallback.
- Shared lifecycle: explicit selection/open, listener/display setup, prepareAsync, explicit Play, one active player, Stop/Close; bounded diagnostics. Existing HTML5 functionality preserved; no broader codec/DRM/live/ABR compatibility inferred from one fixed HLS rendition.
- Remaining independent gates: detailed R3 audio subtests, HTML5 local HLS, full lifecycle/soak and error recovery, subtitles/track/quality selection, phone transport/casting, CH keys and conditional PiP remain unverified unless separately evidenced. They are not silently marked PASS. Phase 01 may specify conditional states; implementation promises remain gated.
- Phase 00 playback/navigation checkpoint accepted; checkpoint documentation READY_FOR_REVIEW. Phase 01 NOT STARTED and requires separate approval. No code/UI changes, build/device tests, staging, commit or push in this closure session.

Acceptance interpretation: T00-03 is PARTIAL across its full original scope: tested MP4/HLS playback PASS; subtitle/audio-track/quality controls are not accepted by this checkpoint. T00-04 phone pairing transport remains NOT RUN. T00-V05 PASS for tested R6 interactions; T00-V06 FAIL/non-blocking; T00-V07 PARTIAL (buffer/error observed, recovery pending); T00-V08 not globally accepted by this limited checkpoint. R8 picture/audio acceptance does not close independent R3 audio subtests.


## Phase 01 specification acceptance — 2026-10-27
Historical draft gate: T01-01 was PARTIAL / READY_FOR_REVIEW. The final disposition below supersedes pending primary-decision statements. All 35 individual concepts + 2 boards reviewed; screen graph, per-screen focus/remote maps, shared state matrix, component/token gaps and approval register are in UI_UX_SPEC.md. No UI implemented, no device/readability/phone layout tests run.

- [x] Existing PNG inventory visually reviewed; Manager blanks and missing concepts explicitly reported.
- [x] Written route/focus/return maps for 18 existing TV views plus required missing overlays/collections.
- [x] Loading/empty/error/offline/rights/PIN/playback state behavior and companion workflow draft.
- [ ] User approves P01-D01..D05 and D12 before production-shell decisions.
- [ ] Missing detailed layouts/states reviewed and approved, including Manager and external casting.
- [ ] User approves final focus/Back/player flows; ADR-007 implementation remains undecided.
- [ ] Later authorized TV/phone rendering verifies readability, contrast, safe area and remote behavior; no physical PASS inferred from PNG review.

Review scenarios proposed for later implementation: cold Home without autoplay/profile interception; sidebar to every route and back to exact anchor; grid edges/empty rows/removed item; query scope and stale response; modal focus/Cancel; locked/no-source action; unsupported track choices; single-player exit; settings destructive Cancel; pairing expiry and deny; no-PC/transport conditional labels. MP4/HLS/device setup is not rerun as part of this specification session.


## Phase 01 final specification closure — 2026-10-27
Specification work COMPLETE for the approved initial-shell scope; closure artifact READY_FOR_REVIEW, not authorization to start Phase02. Core UI decisions accepted by user: English default + Albanian/additional locale architecture; dedicated Favorites and Home/Live sections; explicit-selection Live preview only; premium token baseline; separate production app; final Stop/Close + Back. Written focus/state/token/acceptance maps finalized. No production components or physical readability tests implemented.

T01-01 disposition: 35 individual mockups + 2 boards REVIEWED; primary behaviors APPROVED; written closure baseline FINALIZED. Missing later-surface layouts explicitly DEFERRED by user, not Phase02 blockers without a direct dependency. Final closure/checkpoint approval remains pending. Do not report all future visual layouts or device acceptance as PASS.

Future shell checks T02-04..07 supplement T02-01..03:
- Final Phase 01.5 override: direct immersive Play/Watch; Back dismisses topmost menu, then visible immersive transport controls; hidden immersive controls or Normal Player Back request Stop then Close/release before exact origin/item/scroll restoration. No auto-mini-player/background playback.

### Phase 01.5 presentation acceptance (browser prototype; production TV evidence pending)

- Full View defaults on, content expands; Standard View retains sidebar. Menu overlay supports arrows/OK, traps focus and Back restores its invoker/scroll. F toggles only outside text inputs/dialogs; Settings exposes View Mode. Route and scroll persist across toggles, with deterministic focus fallback when a sidebar item becomes hidden.
- Channel Watch, movie Play and episode Play start the fixture session directly in immersive mode with controls hidden. Video surface fills viewport; 16:9 fixture picture is contained without crop/stretch; no permanent sidebar/header/footer/timeline.
- OK reveals Play/Pause-focused overlay. Live has channel/programme, supported Play/Pause and Stop/Close; VOD adds seek/time/settings. Playing controls auto-hide after four idle seconds; paused controls do not time out.
- Back: settings closes before transport; visible immersive transport hides without stop; hidden immersive transport stops/closes directly to origin; Normal Player Back stops/closes directly. Explicit Stop/Close always releases/returns. Held/rapid Back cannot cause a second exit (preview: 450 ms guard).
- Fullscreen/Exit Fullscreen preserves one session, pause/play and progress; normal Player provides clearly labeled Fullscreen. Interface mode and browser F11 do not affect this state machine.
- Restore exact route/item/scroll after stop. No media, AVPlay, browser Fullscreen API, mini-player or hidden background playback in preview. Production controller release acknowledgment, aspect/display behavior and Samsung remote acceptance remain separately gated. Phase 02 remains unauthorized.
- Duplicate Back during preparation/closing yields one pending exit. Stop/Close failure retains visible error/focus/origin and offers explicit Retry release/Exit; never navigates behind possibly active playback. VOD progress snapshot/save where supported; Live has no VOD resume offset.
- Favorites membership per profile consistent across Home/Live/Favorites; add preserves invoker, remove moves to next/previous/empty Browse, save failure reverts state without focus loss.
- Focus movement over Live channels never starts AVPlay; explicit selection may start one supported preview; route departure releases it; fixture shells do not claim actual live-source support.
- English initial UI and selectable Albanian via locale resource keys, route/focus preserved during language change; no localization engine created in Phase01.
- Separate production directory/IDs; existing diagnostic source, R8 identity and rollback packages remain unchanged. No hidden real PIN/pairing/provider promises in fixtures.

Deferred gates remain: Phase05 PIN enforcement; Phase07/07B pairing/external Cast; Phase08 Manager detail; Phase06 Sleep Timer/advanced player behavior; Phase03/06 recovery and Phase09 performance/stability. Mini-player/PiP/background playback are optional future, capability-gated and excluded from initial shell. No previous Phase00 acceptance test is rerun.
