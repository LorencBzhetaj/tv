# LORI TV — Final UI/UX Specification v3.5

## Scope and visual source of truth
The `mockups/tv/` (18 PNG), `mockups/remote/` (9 PNG), and `mockups/manager/` (8 PNG) folders contain **35 individual conceptual screens** (31 base screens plus four Cast concepts). Two additional overview boards bring the total to **37 PNGs**. These are design references, not functioning apps or evidence of content rights. `mockups/LORI_TV_All_Interfaces.png` is the earlier broad mood board. The individual screens are more authoritative for navigation/layout. If a sample channel/movie appears, it is placeholder content only.

## TV design tokens (proposal; calibrate on real TV)
- Target composition: 1600×900 design artboard, scaled to TV resolution; support 1920×1080 and Samsung safe-area/overscan.
- Background `#07101e`; side panel `#081322`; surface `#111f32`; borders `#2b425d`; primary `#1672ed`; text `#f1f6ff`; muted `#9db0c6`; success `#69e3a2`.
- Typography: system sans fallback. TV base 18–22px at 1600px design width; headlines 42–60px; never depend on hover or tiny text.
- Focus: blue outline with visible high-contrast halo; single deterministic focus target; no keyboard trap; Back returns to previous logical focus.
- All controls: focusable, readable, no off-screen focus, labels exposed; avoid autoplay video on Home.
- Motion: subtle, reduced motion option; poster loading skeletons; placeholders on errors.

## Global TV navigation
Persistent sidebar: Home / Live TV / TV Guide / Sports / Movies / Series / Search / Watchlist / Profiles / Settings. Header may expose Search and active profile. On cold start, always route to **Home**. Continue Watching resumes VOD position only when explicitly selected; recent live channel appears as shortcut, not automatic playback.

## TV screen-by-screen behavior
| File | Screen | Required behavior |
|---|---|---|
| 01_home | Home | featured catalog item, Continue Watching, recommendations, favorites, visible empty states |
| 02_live_tv | Live TV | per-category search, filters, selected channel, player preview, favorites, loading/error states |
| 03_tv_guide | TV Guide | now/next, day selection, UTC-to-local timezone/DST, missing schedule placeholder |
| 04_sports | Sports | schedule, live/upcoming/results, sport filters, link to authorized source only |
| 05_movies | Movies | category-only search, genres, catalog cards, availability labels |
| 06_series | Series | category-only search, genres, series cards |
| 07_search | Global Search | ALL/CHANNELS/SPORTS/MOVIES/SERIES, debounce, suggestions, keyboard |
| 08_search_results | Results | query preservation, zero results, loading, filter chips, availability |
| 09_movie_details | Movie Details | metadata, trailer (if permitted), play only if source allowed, watchlist |
| 10_series_details | Series Details | season selector, episodes, resume, next episode |
| 11_player | Player | play/pause, seek where allowed, progress, buffering, failure/retry |
| 12_player_settings | Playback settings | available subtitle/audio tracks, quality options conditional on stream |
| 13_watchlist | Watchlist | per-profile entries, remove, filter, unavailable indicators |
| 14_profiles | Profiles | create/switch, kids profile, guest, local profile boundaries |
| 15_parental_controls | Parental Controls | parent approval, PIN gate, age classification, deny unknown-rated by policy |
| 16_settings | Settings | language, quality, storage, sources, pairing, diagnostics |
| 17_pair_phone | Pair Phone | QR/code expiry, TV-side approval, revoke, errors |

## LORI Remote mobile screen behaviors
1. Pairing: temporary QR/code, expiry and TV confirmation. Do not put long-lived secrets in QR.
2. Remote: D-pad, OK, Back, Home, play/pause; only controls LORI TV, not Samsung OS.
3. Keyboard Search: send normalized search text and selected result; scoped search modes.
4. Voice Search: explicit microphone consent, speech-to-text when supported, graceful fallback.
5. Send to TV: open only a catalog ID, verify permissions on TV, no arbitrary URL playback.
6. Remote Settings: connected devices, revocation, diagnostics, privacy.

## LORI Manager web screen behaviors
Dashboard, Channels, Source Imports, EPG Mapping, Movies & Series, Profiles, Settings, Audit Log. Manager must be authenticated, role-authorized, audit-logged and never expose raw stream credentials in public catalog.

## Search contract
Each category has a clearly visible Search action. Movies search only MOVIES, Series only SERIES, Live TV only CHANNELS, Sports only SPORTS; global search ALL. Show debounce, empty/error/loading and recent queries scoped to active profile. Search catalog items only, never promise universal Netflix/MyFlixer discovery.

## Design acceptance checklist
- Screens visually reviewed on 16:9 TV and narrow phone; text readable from sofa.
- D-pad paths and initial/return focus specified per screen; Back/Home behavior consistent.
- Loading/empty/error/offline/parental-locked/no-source states designed for all data screens.
- No fabricated streaming entitlements or live sports results in production.
- All 35 individual PNGs are **conceptual**; component states, focus maps, responsive adaptation and final branding need implementation validation.

## LORI Cast screens and behavior
Phone: `Cast to LORI TV` action on playable catalog items; Cast Picker (paired TV, connectivity, selected title), Casting (poster/title, progress, pause/seek, stop), Unsupported/Expired Source error. TV: compact incoming cast confirmation/status overlay, then player; Back exits playback without exposing phone content. Pairing and parental PIN policies remain enforced. Never depict or request full-screen capture or notifications. Four dedicated Cast concept PNGs already exist; see `MOCKUP_INDEX.md`. Gallery/Files/Video URL input and transfer-state designs remain pending.


## v3.3 — LORI Cast external media UI
From LORI Remote > Cast: show **Gallery**, **Files**, **Video URL** as three distinct entry points. Gallery/Files open user-initiated pickers, show filename, size, preview when possible, device picker, transfer progress, Play/Stop. Video URL has editable URL input, clear unsupported-webpage explanation and error states. Never show or transmit notifications or other phone content. Add dedicated mockups before implementing these screens; previous Cast mockups cover pairing/playback/errors/TV confirmation only.


## v3.4 — Additional TV UI states (mockups pending)
- **Sleep Timer:** Player > More > Sleep Timer; Off, 30, 60, 90 min; remaining time and cancel confirmation; clear that it stops LORI TV playback, not television power.
- **Channel Zapping:** brief unobtrusive channel name/logo/Now-Next overlay after CH+/CH−; last-channel toggle; D-pad fallback if hardware keys unavailable; preserve focus.
- **Stream Health:** subtle buffering status, retry progress, offline/error state and manual retry; never expose raw stream URL or secrets.
- **Mini Player/PiP:** in-app floating mini-player during browsing if technically supported; focusable Expand/Close; disabled-state fallback if not. Do not depict system-wide floating video.
- Dedicated reference mockups for these four screens are **PENDING**, not part of the current PNG count.
