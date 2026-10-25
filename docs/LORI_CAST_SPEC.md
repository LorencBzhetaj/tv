# LORI Cast — Product and Technical Specification v3.5

**Status:** approved planning scope; no implementation authorized. **Phase:** 07B, following phone pairing in 07.

## User outcome
From LORI Remote on iPhone/Android, choose **one** movie/episode/stream in the authorized LORI catalog and tap **Cast to LORI TV**. Only the selected media plays on TV. The phone remains private: no full-screen capture, mirroring, notifications, messages or other apps appear. Phone controls play/pause/seek/stop where supported.

## Supported scope, in order
1. **Catalog handoff (MVP):** phone sends a catalog media ID to paired TV; TV resolves authorized playable source and plays it.
2. **Compatible direct media URLs:** allowlisted/validated HTTPS URLs for permitted content; validate scheme, source, redirect destinations, supported format and access policy. Do not implement open proxy or unrestricted URL fetch.
3. **Gallery and Local Files (required scope, feasibility-gated delivery):** explicit file selection, temporary transfer or serving with bounded size/duration, secure pairing, cleanup and device compatibility proof. If infeasible, mark the affected path BLOCKED and request an approved scope change; do not silently omit it.

## Out of scope
Universal AirPlay receiver, full-screen mirroring, screen/audio capture, mirroring notifications, Netflix/Disney+/other third-party app DRM bypass, extracting streams from websites, guarantee of casting arbitrary apps. Native Samsung AirPlay may work separately depending on TV model/firmware and source app.

## Architecture
LORI Remote PWA -> paired authenticated transport -> TV CastCommand handler -> authorization + profile/PIN policy -> catalog resolver -> Samsung AVPlay/HTML5 -> playback status response to PWA.

Suggested typed command contract (design only):
- `cast.start`: requestId, pairedDeviceId, targetTvId, mediaId (preferred), playbackStartSeconds?; **never** send credentials or arbitrary script.
- `cast.control`: requestId, sessionId, action (pause|resume|seek|stop), positionSeconds?; validate ownership.
- `cast.status`: sessionId, state (loading|playing|paused|error|ended), safe error code, currentPositionSeconds?; avoid leaking tokens or signed URLs.
- All messages authenticated, expiry-bound, replay-resistant and scoped to TV/session; rate-limited and logged without secrets.

## UX
Remote: media detail -> Cast button -> device picker/confirmation -> casting now (controls) -> stop/disconnect. TV: optional confirmation -> player -> clean error state. If media unavailable, present 'Nuk mbështetet ky format/burim' without misleading AirPlay promises.

## Feasibility and security gates
Verify real Samsung firmware/Tizen, socket/network permissions, supported playback formats, phone background constraints, CORS and transport latency. Test unauthorized/revoked/replayed messages, wrong TV, private-network URL abuse, malformed URL/redirect, DRM media, loss of Wi-Fi and cleanup. No app or system-level screen capture permissions.

## Completion evidence
Real-device videos/logs of selected-media casting from iOS and Android; confirmation that notifications do not appear; tests for auth/revocation/parental restrictions; reliable stop and disconnect; document unsupported cases and any relay costs. See ACCEPTANCE_TESTS.md.


## v3.3 — External Media (approved scope; implementation still pending)
Three requested inputs are **all included as product requirements**, with feasibility gates rather than unconditional compatibility promises:
1. **Gallery video** — user explicitly chooses a video in LORI Remote on iOS/Android; PWA file picker is the initial path. Native OS share-sheet integration requires a separately approved native wrapper and is not guaranteed by a PWA.
2. **Local file** — user chooses a file (e.g., MP4/MOV) from the phone's file picker. Treat as a private file; never enumerate the device gallery or filesystem.
3. **External video URL** — user pastes an authorized, direct, reachable media URL; ordinary webpage URLs, third-party apps, DRM content, signed/expiring links, cookies and restrictive CORS may not work. Never extract video streams from protected sites.

### Media transfer architecture
- Gallery and Local File use the same secure `localFile` transfer pipeline; they differ only in picker UX. Prefer short-lived encrypted local transfer/serving if supported on real TV and phone; otherwise evaluate an explicitly approved secure relay with storage, bandwidth and privacy costs disclosed. Do not assume a browser/PWA can host a reliable background HTTP server.
- External URL uses `externalUrl` source validation before playback; do not create an open proxy. Deny loopback, private, link-local, metadata-service and internal addresses and recheck DNS/redirect destinations if any backend fetch is used. Allow only approved schemes/ports, bound redirects, length, size and time. Do not send auth headers or cookies from the phone.
- `cast.start` typed payload: `sourceType: catalog | gallery | localFile | externalUrl`, `mediaId?`, `uploadSessionId?`, `url?`, `requestId`, `pairedDeviceId`, `targetTvId`. Enforce mutually exclusive source fields, source-specific authorization, session expiry, rate limits and parental policy.
- Transfer safeguards: explicit consent, file MIME and signature checks, codec probe where feasible, bounded size and duration, streaming/chunking and backpressure, abort/retry, expiring single-use access, secure cleanup, no permanent cloud retention by default.
- Keep phone screen and notifications private: transmit only selected media bytes or a validated media reference, never screen capture.

### UX screens / states to add to mockup backlog
- Cast source chooser (Gallery / Files / Video URL); native file picker; URL entry with validation; upload/transfer progress; unsupported codec or DRM; permission denial; transfer interrupted; expiry/cleanup notice. Existing four Cast mockups remain visual references, **not** proof these new screens have been drawn.

### Exit criteria per source
- Gallery: selected personal video plays on Samsung; no notifications, other photos or unrelated phone UI appear.
- Local File: supported MP4 and at least one actual MOV sample tested; unsupported codec produces a clear error rather than a crash.
- External URL: allowed direct HLS/MP4 test streams work where supported; webpage-only URL, internal URL, redirect to private address, expired URL and DRM fail safely.
- All three: test iPhone and Android, reconnect, cancel, wrong TV, revoked pairing, parental restrictions, cleanup and no unintended persistence. If a path cannot be proven on the target Samsung, mark BLOCKED with evidence, not DONE.

## v3.5 consolidated requirement and trust boundary
Catalog handoff, Gallery, Local Files and authorized direct Video URL are all in scope. Each external path has its own feasibility and acceptance gate; infeasible paths are BLOCKED pending explicit user scope approval, never silently optional or completed. Implement catalog handoff first; then external paths in the roadmap order Gallery, Files, Video URL. No delivery guarantee precedes hardware proof.

External URL input must reject private/internal destinations, including redirect/DNS changes. A future paired LAN transfer is a separate, authenticated capability scoped to one selected file, TV and expiring session; it must not accept arbitrary private URLs through the external URL field. The transport remains undecided. Incoming-cast confirmation policy is unresolved under ADR-C04; retain explicit confirmation in diagnostic tests.
