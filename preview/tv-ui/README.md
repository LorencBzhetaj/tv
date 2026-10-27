# LORI TV — Phase 01.5 design preview

Temporary browser prototype for design review. Phase 02 has not started.

From `C:\Users\Public\tv`, using the existing Node.js installation:

```powershell
node preview/tv-ui/server.cjs
```

Open http://127.0.0.1:4173 in a wide browser window. The 1600×900 interface reference layout scales proportionally; immersive video uses the entire application viewport with an aspect-preserving 16:9 picture. Stop with **Ctrl+C** in the terminal that started it. No installation or build is needed. The server binds only to loopback and serves an explicit asset allowlist.

## Three independent presentation modes

- **Interface Full View** (default): expanded content, hidden sidebar; focusable Menu opens an overlay. **Standard View** keeps the sidebar. Settings → View Mode or **F** outside inputs/dialogs toggles the preference; route, focus and scroll are retained. Hidden sidebar focus falls back to Menu. The preference persists locally.
- **Immersive Fullscreen Video**: Watch/Play on a channel, movie or episode starts the simulated session directly, with transport hidden. Only the fixture picture appears, contained without stretching/cropping. Black letterboxing is intentional when the viewport is not 16:9. No real media is loaded.
- **Browser fullscreen (F11)**: optional browser-owned window/chrome behavior. The preview does not call the browser Fullscreen API. It is independent of the other two modes.

## Controls

- Arrow keys: directional focus. Sidebar Right enters the content; Left returns toward navigation.
- Enter: activate. On a search field, Enter begins editing; type a query, then Enter ends editing. Escape ends editing first.
- Escape / Backspace: Back. Backspace deletes text while editing search.
- Immersive Player OK: reveal temporary controls with Play/Pause focused. Back closes a settings modal first, then hides visible transport while continuing playback. Back with transport hidden stops/closes and restores the exact originating route/item/scroll. There is no intermediate Normal Player detour.
- Overlay Exit Fullscreen opens Normal Player without changing play/pause/progress. Normal Player's Fullscreen button re-enters immersive mode; Back from Normal Player stops/closes and restores origin. Explicit Stop/Close always returns directly.
- Playing controls hide after four idle seconds. Paused controls do not time out; explicit Back may hide them and OK restores them. Rapid Back transitions within 450 ms and held Back repeats are ignored to prevent accidental extra navigation.
- Live controls show channel/programme, simulated Play/Pause and Stop/Close; VOD adds seek/time/settings. One simulated session is retained across presentation changes.
- H: toggle keyboard help outside search editing and immersive playback.
- Tab / Shift+Tab: browser focus navigation; trapped within open modal/navigation/immersive controls. Directional keys work within each active layer.

## Included

Home and sidebar; Live TV; Guide/EPG; Movies; Series and season/episode details; Search; Favorites; Watchlist; movie/channel details; simulated Player; Profiles; Settings. Sports and pairing/quality controls are clearly marked fixture placeholders.

Try a title → Details → Play (direct immersive) → OK → Pause → Exit Fullscreen → Fullscreen. Use Back to hide controls, then a distinct Back to stop/return. Try channel Watch and a series episode too. Add a favorite then visit Favorites; search `signal`; switch EN/SQ. Settings → Preview states opens representative Movies loading, empty, error and offline states.

## Simulated behavior and limitations

- Entire catalog, schedule, progress and player clock are fixtures. No video/audio, AVPlay, IPTV, network API, account, PIN, casting or pairing exists.
- Favorites/watchlist, view preference and language persist in browser localStorage for this origin; profile selection and mock progress are session-only. No credentials or private data are used.
- Sample English/Albanian UI resources demonstrate layout; titles, genres, synopses and some explanatory prototype text remain English.
- Approved brand icon and navy/blue visual hierarchy are reused. Abstract CSS fixture artwork approximates the mockup artwork; this is not a pixel-perfect export. Some extended settings and sports flows are placeholders.
- Directional geometry navigation is a prototype, not the chosen production focus architecture. Real-TV readability, performance and remote behavior require later approval/testing.
- No mini-player/background playback. Changing tabs pauses the simulated clock. Refresh always starts at Home.

## Verification performed

Node syntax checks; HTTP checks for all served assets and rejection of private/repository paths; browser smoke checks of collections, details, keyboard selection, Player Back, restored card focus, Favorites synchronization, search, language switching, modal Tab wrap, loading/empty/error screens and console errors. No diagnostic application or TV build/deployment was involved.

The presentation revision additionally checks Full/Standard views, overlay navigation, direct immersive entry, auto-hide, paused-state persistence, Normal/immersive transitions, Back layers and rapid-Back protection. Wide-display visual review remains required; browser checks are not Samsung acceptance.

## Intended production behavior (not implemented here)

The future Tizen player controller should preserve one decoder/session across presentation changes, fit the source aspect ratio with its display rectangle policy, and acknowledge Stop/Close before restoring origin. Remote repeat handling, overlays, release failures and OS lifecycle need native validation. CSS viewport simulation does not prove AVPlay fullscreen behavior. Phase 02 is still unauthorized.

Await user visual review before further implementation or Phase 02.
