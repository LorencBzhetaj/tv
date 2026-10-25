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

## v3.5 evidence clarification
T00-01 is only PARTIAL: user reported model/software details and same-network placement on 2026-10-26; platform API, developer mode and SDK diagnostics are UNVERIFIED. T00-02/03/04 are NOT RUN. Hardware availability is not a compatibility PASS.

All external Cast paths are required scope with independent feasibility gates. A blocked Gallery/Files path is not satisfied merely by an unavailable UI label; record evidence and obtain a scope change before accepting reduced delivery. Phase 01 reviews 35 individual PNGs and two boards, and must complete missing Manager content, external-media flows and TV-enhancement states.
