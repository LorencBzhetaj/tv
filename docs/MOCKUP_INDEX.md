# LORI TV — Mockup index

All PNGs are original **conceptual UI compositions**, not screenshots of a working product. All catalog names, TV channels, matches and statistics are placeholders.

## TV
- `mockups/tv/01_home.png`
- `mockups/tv/02_live_tv.png`
- `mockups/tv/03_tv_guide.png`
- `mockups/tv/04_sports.png`
- `mockups/tv/05_movies.png`
- `mockups/tv/06_series.png`
- `mockups/tv/07_search.png`
- `mockups/tv/08_search_results.png`
- `mockups/tv/09_movie_details.png`
- `mockups/tv/10_series_details.png`
- `mockups/tv/11_player.png`
- `mockups/tv/12_player_settings.png`
- `mockups/tv/13_watchlist.png`
- `mockups/tv/14_profiles.png`
- `mockups/tv/15_parental_controls.png`
- `mockups/tv/16_settings.png`
- `mockups/tv/17_pair_phone.png`
## REMOTE
- `mockups/remote/01_pairing.png`
- `mockups/remote/02_remote.png`
- `mockups/remote/03_keyboard_search.png`
- `mockups/remote/04_voice_search.png`
- `mockups/remote/05_send_to_tv.png`
- `mockups/remote/06_remote_settings.png`
## MANAGER
- `mockups/manager/01_dashboard.png`
- `mockups/manager/02_channels.png`
- `mockups/manager/03_source_imports.png`
- `mockups/manager/04_epg_mapping.png`
- `mockups/manager/05_movies_&_series.png`
- `mockups/manager/06_profiles.png`
- `mockups/manager/07_settings.png`
- `mockups/manager/08_audit_log.png`

**Note:** detailed interaction states (loading/offline/no-source/error/focus) are documented in UI_UX_SPEC.md and must be specified/reviewed during Phase 01 and implemented only in separately authorized development phases; these PNGs do not depict every state.

## LORI Cast — rendered concept screens (v3.2)
- `mockups/remote/cast_picker.png`
- `mockups/remote/casting_now.png`
- `mockups/remote/cast_error.png`
- `mockups/tv/cast_incoming.png`
- `mockups/LORI_Cast_4_Screens.png`: full concept board.

These are static visual concepts; implementation, interaction and device compatibility remain unverified.


## v3.4 — New approved mockup backlog (NOT rendered yet)
- `mockups/tv/sleep_timer.png` — options + countdown in player.
- `mockups/tv/channel_zapping.png` — channel-switch overlay and last-channel action.
- `mockups/tv/stream_health.png` — buffering, retry and unavailable state.
- `mockups/tv/mini_player.png` — conditional in-app mini-player; no OS-level PiP promise.
These paths are target filenames only and must not be treated as existing PNGs.

## Verified inventory — 2026-10-26
35 individual PNGs: TV 18, Remote 9, Manager 8; plus two boards = 37 PNGs. Four Cast concepts exist. The eight Manager PNGs are navigation shells with blank main areas; full content layouts remain Phase 01 work. Gallery/Files/Video URL flows and their transfer/error states remain design backlog, alongside the four TV enhancement mockups above. No images were added or altered.


## Phase 01 visual review — 2026-10-27
All 37 existing PNGs visually inspected: TV 18 (01..17 + cast_incoming), Remote 9 (01..06 + cast_picker/casting_now/cast_error), Manager 8 (01..08), plus both overview boards. Review used temporary contact sheets only; no source PNG changed or new product mockup generated.

| Group | Finding / specification coverage | Remaining gate |
|---|---|---|
| TV 01..08 | Consistent sidebar/rails; Search Results omits Sports chip shown in written scope; Live preview activation unclear | Apply final UI_UX_SPEC maps: dedicated Favorites plus Home/Live sections; explicit-selection preview only |
| TV 09..13 | Detail/player/track/watchlist concepts reviewed; player speed/quality/track lists are capability-dependent | Final Back=Stop/Close+origin; no automatic mini-player; controls hiding never consumes Back |
| TV 14..17 | Profile/PIN/Settings/pairing reviewed; startup option cannot contradict mandatory Home | English default/Albanian approved; PIN and Cast policies deferred to their implementation phases |
| TV cast_incoming | Post-start status artwork with illustrative title; pre-play consent not designed | Explicit consent/replacement policy; safe approval modal |
| Remote 01..06 | Pairing/remote/keyboard/voice/catalog-send/settings covered conceptually | Narrow-layout, connection/permission/keyboard/error states need final approval |
| Remote Cast 3 views | Device choice, playback/control and multi-error examples | No automatic retries/quality fallback inferred; Gallery/Files/URL states missing |
| Manager 01..08 | Navigation-only shells; main content placeholder, Categories in sidebar without dedicated image | Proposed tables/forms/workflows now specified in UI_UX_SPEC; detailed layout approval pending |
| Broad board | Mood/branding/layout direction; contains illustrative media/provider data and older navigation | Individual concepts and written requirements take precedence |
| Cast board | Four existing concepts, not four extra screens | No entitlement, universal cast or guaranteed codec/4K claims |

Unrendered backlog unchanged: four TV enhancements (timer, zapping, stream health, conditional mini-player); Gallery/Files/Video URL source/transfer/cancel/expiry/cleanup; Favorites placement, programme/event information, profile editor/PIN errors, Manager content/login/categories/publish conflicts and shared loading/empty/error/offline states. These are required design states, not necessarily distinct top-level routes or an approved image count. Phase01 now has a finalized written closure baseline; final closure review remains open. Deferred visual detail is not falsely accepted and does not block initial Phase02. See updated P01-D01..D12 in UI_UX_SPEC.md.


## Final Phase 01 disposition — 2026-10-27
Approved: dedicated Favorites route with Home/Live projections; English default and selectable Albanian; explicit-selection/capability-gated Live preview; Player Back Stop/Close + origin/focus/scroll restoration. Back never auto-enters mini-player or leaves background audio/video; passive controls/fullscreen do not add a Back step. UI_UX_SPEC closure contract is authoritative where concept imagery differs.
All 37 PNGs reviewed previously; none regenerated or changed. Dedicated Favorites/Manager/external-cast/enhancement artwork remains absent where identified; these are documented deferrals, not fabricated deliverables. Manager detail is Phase08, external Cast Phase07B, optional mini-player future feasibility only. User explicitly permits initial Phase02 to proceed without those layouts once its architecture is approved. Concrete tokens, screen/focus maps and accessibility targets are specified; real-TV readability remains future validation.
