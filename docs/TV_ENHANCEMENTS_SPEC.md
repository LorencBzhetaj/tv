# LORI TV v3.4 — TV Enhancements Specification

Status: APPROVED FOR PLANNING ONLY. No implementation or device tests.

## A. Sleep Timer (v1 target)
User selects Off/30/60/90 min from player menu. Show countdown and allow cancel/extend. On expiry stop playback and return to a safe Home/player-stopped state. This is **not** a Samsung TV shutdown feature. Handle pause, app suspend, restart and casting handoff explicitly; never keep a stale timer across restarts. Acceptance in `ACCEPTANCE_TESTS.md`.

## B. Channel Zapping (v1 target)
CH+/CH− when available/registered; fallback to focusable previous/next actions on screen. Use stable channel ordering; skip unplayable/restricted channels, preserve favorite filter context where possible; support last-channel toggle and short Now/Next overlay. No looping uncontrolled requests.

## C. Stream Health (v1 target)
Observe player state (connecting, buffering, playing, stalled, failed), show status to user, retry a bounded number of times with backoff. Optionally switch among **preauthorized sources of the same channel**. No scraping, stream discovery, arbitrary probing or leaking private URLs. Source failure analytics are local/minimal and redacted by default.

## D. In-app Mini Player / PiP (conditional)
Aim for a mini-player within LORI TV while browsing other screens. **Not** system-wide PiP, and no assumption of multiple video decoders. Requires Phase 00 proof on exact Samsung firmware for AVPlay video-surface behavior, focus, overlays, lifecycle and memory. Feature flag OFF by default until proven. If unsupported, retain playback screen or offer return-to-player affordance. User approval required before choosing alternative.

## Ownership and dependencies
`PlaybackSessionController` owns one active stream. `SleepTimerService`, `ChannelNavigationService`, `StreamHealthService`, `MiniPlayerCoordinator` request transitions through controller; Cast handoff and profile locks remain authoritative. No duplicated player instances.

## Phase mapping
Phase 00 device spikes; Phase 01 designs; Phase 03 Channel Zapping + Stream Health; Phase 06 Sleep Timer + conditional Mini Player; Phase 09 integration and real-device acceptance. Do not add a new phase or begin work without approval.

## UI mockup backlog
Four dedicated TV screens: sleep timer, channel zapping, stream health, mini-player. No images generated yet.
