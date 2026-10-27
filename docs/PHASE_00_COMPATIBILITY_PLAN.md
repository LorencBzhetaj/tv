# Phase 00 compatibility assessment and setup runbook

Date: 2026-10-27 (Europe/Budapest). Current status: accepted Phase 00 playback/navigation checkpoint; R6 MP4 and R8 HTTPS HLS physical PASS. See the final evidence entry below. Earlier runbook sections are historical, not current authorization.

## Initial evidence (historical; superseded by dated results below)

| Item | Observation | Evidence level |
|---|---|---|
| Brand/model | Samsung UE50M70HAUXXH | User confirmed from About screen |
| Display | 50-inch Mini LED | User supplied; no independent panel verification |
| Software string | T-X22UDHDEUC-0100-1 | User confirmed from About screen |
| Displayed version | 213.2 | User confirmed; do not equate with Tizen/API version |
| Network placement | TV and Windows PC on same local network | User confirmed; IP addresses, subnet isolation and port reachability untested |
| SDK tools | tizen and sdb not found on PATH; usual C:/tizen-studio and user tizen-studio locations absent | Read-only PC inspection; not proof no custom installation exists |
| Git | Local main initialized; canonical origin added; fetch returned no refs | Executed locally; no commit or push |

Hardware is now available for the feasibility spike. Model-year group, actual Tizen/API/web-engine version, developer-mode availability, installability, signing compatibility, codecs, phone transport and mini-player support remain UNVERIFIED. T00-01 is PARTIAL; T00-02/03/04 are NOT RUN. No firmware update is requested or authorized.

## Approval boundary

Current Step A authorization permits environment inspection, setup procedure, and interactive user-performed Developer Mode guidance. Stop for each required user interaction. Ask before downloading/installing software; do not automatically change TV/network/firewall settings. Certificate creation/import and diagnostic application creation/build/install/run remain separately gated. SDK connection is planned within Step A after the required tools and TV setup are approved/ready. No account credentials should be pasted into chat or committed. Approval of this document does not itself execute these steps.

## Step-by-step procedure after approval

### 1. Preflight and choose the setup

1. Capture the About screen for the private evidence record. Confirm the exact model/software strings above. Record current settings before making changes.
2. Read PC IPv4 configuration with ipconfig and choose the active physical LAN adapter; obtain the TV IPv4 from its Network Status/IP Settings. Record these privately, not in a public repository. Same Wi-Fi name alone does not prove reachability.
3. Check for a custom Tizen Studio installation and its package versions before installing another copy. Check Windows version/architecture, disk space, and current installer requirements. Do not install an arbitrary JDK based on old SDK documentation.
4. Prepare a Samsung Developer account and choose a private certificate backup location outside this repository. Preserve existing author certificates if any.

### 2. Developer Mode on the TV

On the actual firmware, follow Smart Hub > Apps > App Settings; enter 12345 with remote digits/on-screen keypad. In the Developer Mode dialog, enable the mode, set the host to the PC LAN IPv4 (not the TV IP), confirm, and reboot as prompted. Reopen Apps and verify the developer indicator. If this UI differs or the dialog is absent, record the screen and stop for model-specific investigation; do not use service-menu procedures or reset the TV.

Source: [Samsung TV Device](https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/tv-device.html), checked 2026-10-26. UI availability on this model is not yet proven.

### 3. Install the approved TV toolchain

Use the official Windows Tizen Studio installer after approval. Select SDK/data paths, then open Package Manager > Extension SDK and install TV Extensions and Samsung Certificate Extension. Record exact versions. Samsung warns that certificate creation with Certificate Extension versions below 2.0.73 stopped being supported after September 2025; select a currently supported release. Install the Web/TV development components required by that release; emulator images are unnecessary for this first physical-device test. Resolve any installer prerequisites from its current requirements before adding software.

Source: [Installing TV SDK](https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/installing-tv-sdk.html), checked 2026-10-26.

### 4. Connect the named TV

Open Tools > Device Manager > Remote Device Manager, add a named target using the TV IPv4 and SDB port 26101, then enable its connection. Verify identity and connected status; record platform information exposed by the tools. The host IP in Developer Mode and the target TV IP serve different purposes.

If needed after approval, use the installed SDK's sdb with an explicit full path: sdb connect TV_IP:26101, then sdb devices. These are templates; replace TV_IP with the known TV address. Do not scan the network. A later targeted Test-NetConnection TV_IP -Port 26101 can distinguish reachability failure from signing failure. If connection fails, check entered host IP, reboot, adapter/VPN routing and client isolation first; do not disable the firewall. Any necessary firewall change must be narrow and separately approved.

Source for the device port: [Samsung connection guide](https://developer.samsung.com/smarttv/develop/tools/additional-tools/vscode/connecting-to-tv-device.html). Port 26101 is internal to the device; do not configure router forwarding.

### 5. Create the Samsung TV signing profile

Tools > Certificate Manager > + > Samsung > TV. Name the profile LORI-TV-Phase00. Import an existing approved author certificate or create one using the developer account; back it up privately. Create a distributor certificate with public privilege and include this connected TV's DUID. Finish and select the profile for packaging. Record profile name and certificate expiry, not passwords/private keys/full DUID in public documentation. If Device Manager offers Permit to install applications, use it for this target after approval and record the outcome; investigate if the SDK version uses a different workflow. Preserve author identity for later updates.

Source: [Creating Certificates](https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/creating-certificates.html), checked 2026-10-26. DUID is the device identifier, not its IP or model code.

### 6. Create and install only the first diagnostic app

Only after separate application approval, create a minimal TV Web diagnostic project under spikes/phase-00/tv. Choose an SDK profile compatible with the observed device; do not infer it from 213.2. Assign unique package/application IDs and a diagnostic display name. First screen shows build identity and explicit diagnostic actions; no catalog, backend, production UI or automatic playback. First installation proves launch and keys only; playback probes follow in a separately scoped increment.

Review config.xml for required version, IDs and minimal privileges/access. Build and sign the .wgt with the selected profile. Record its SHA-256, tool versions and build output. Use Run As > Tizen Web Application on the selected TV, or the CLI templates below after checking installed tool help:

- tizen build-web -- DIAGNOSTIC_PROJECT_PATH
- tizen package -t wgt -s LORI-TV-Phase00 -- BUILD_RESULT_PATH
- tizen install -s DEVICE_SERIAL --name DIAGNOSTIC.wgt -- PACKAGE_DIRECTORY
- tizen run -s DEVICE_SERIAL -p APPLICATION_ID

Use the serial returned by sdb devices and the application ID from config.xml; TV launch uses application ID rather than package ID. Capture install/run logs, verify the visible build identity, exit, and manually relaunch from the icon. Record whether an icon actually appears and survives reboot; do not assume it does. Disconnect the PC and repeat launch to prove standalone operation. Do not uninstall anything except the explicitly approved diagnostic app.

Source: [Samsung CLI](https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/command-line-interface.html), checked 2026-10-26.

## Remaining compatibility matrix after first installation

| Test | Procedure and evidence | Gate |
|---|---|---|
| T00-01 | About evidence + SDK/platform diagnostics + developer indicator | Exact device/API facts recorded; no inferred version |
| T00-02 | Signed install, icon launch, relaunch, reboot and PC-disconnected launch | Logs/video and package identity; independent operation |
| T00-03 | Authorized MP4 H.264/AAC and HLS live/VOD through AVPlay and HTML5 separately; audio/subtitle enumeration, seek, quality, source cancellation and failures | Per sample codec/container/resolution/bitrate/protocol/player result; no universal support claim |
| T00-04 | Actual iPhone/Android authenticated command + ACK, rejection/revoke/reconnect and background behavior; assess LAN vs approved relay | Both phone platforms evidenced; command transport distinct from media bytes |
| Remote | D-pad/OK/Back/repeat/media/CH+/CH-; focus recovery | Key log/video; channel-key fallback defined |
| Persistence | IndexedDB write/relaunch/reboot, bounded cache and migration probe | Persistence/error observations |
| Runtime/network | JS/CSS target, safe area, HTTPS/certificates, fetch/CORS vs media behavior, lifecycle and Wi-Fi interruption | Supported runtime baseline and measured recovery |
| External Cast | Gallery and Files picker/MP4/MOV; direct authorized HLS/MP4; cancel, expiry, cleanup, wrong-TV/private-URL rejection | Independent required-source results; local transfer is a separate authenticated boundary |
| Mini-player | Single-surface resize/position, overlay, Back/expand/close, lifecycle and two-hour soak | Disabled unless proven; no second decoder/native PiP assumption |

Measure package proposals (Home <=5 s, focus <=150 ms, indexed search <=300 ms, typical LAN commands <=300 ms) only with a specified device, dataset and network. The first diagnostic install is not full Phase 00 completion.

## Stop conditions and deliverables

Stop for missing Developer Mode, unsupported signing/SDK/device, inability to install a signed package, incompatible baseline playback, or unsafe transport assumptions. Two attempted fixes maximum per root cause; then record BLOCKED and options. Do not update firmware, deploy a relay or choose a native phone wrapper without approval.

Deliver a per-device PASS/FAIL/UNVERIFIED matrix, redacted logs/photos/video, sample provenance, actual commands/results, pending ADRs and recommended feature flags. Save capability matrix/report under docs/phase-00 only when execution is approved. Phase 00 becomes READY_FOR_REVIEW only when its required evidence exists, and COMPLETED only after user acceptance. No automatic Phase 01 start.

## Step A inspection update — 2026-10-26
Windows 11 Home 64-bit (10.0.26200), approximately 377.9 GiB free on C. No tizen/sdb/java executable found on PATH; no matching uninstall entry, relevant Tizen/Java environment variable or Samsung/Tizen installation in checked default/top-level locations. Bounded inspection cannot rule out arbitrary portable installations. Wi-Fi LAN host address and default route identified; private addresses are kept in chat. WARP/virtual adapters are present and unchanged. TV IP and Developer Mode state await user observation.

For TV IPv4, later open Settings > All Settings > Connection (or General on older menus) > Network > Network Status > IP Settings and read IP Address. Do not change DHCP or addresses. If menus differ, report labels before proceeding. For now, only open Home > Apps and report whether App Settings/gear exists.

Required component plan: Windows Tizen Studio with Web development/CLI, Device Manager and SDB; Samsung TV Extension; Samsung Certificate Extension supported release >=2.0.73, for later signing support only. No certificates will be created in Step A. Defer emulator images, native/mobile toolchains and project dependencies. Select actual installer/extension versions from the supported repository at the installation approval gate and validate their current Windows/runtime prerequisites; no release or target API inferred from the TV software string. Follow steps 3 and 4 above after that approval.

Capability verification: after connection, record platform metadata actually exposed by Device Manager/SDB. The documented Tizen SystemInfo capability key is http://tizen.org/feature/platform.version. Querying it requires an appropriate TV application context; there is no diagnostic app authorized now. If connected metadata cannot establish the actual API/platform version, keep it UNVERIFIED until a separately approved diagnostic can query it. AVPlay presence and individual codecs/operations still need later device tests. Do not fabricate a result or treat browser user-agent as proof of all app API capabilities.

Reference: [Samsung platform information](https://developer.samsung.com/smarttv/develop/guides/fundamentals/retrieving-platform-information.html), checked 2026-10-26. No API query or TV connection has yet run.

## Current remote test evidence — 2026-10-26
SDB independently reports version 4.2.36, connected device, platform_version 10.0, profile tv, cpu_arch armv7. Existing project LORITVDiagnostic uses tv-samsung API 10.0, application k5qDkEn7ez.LORITVDiagnostic, version 0.2.1, active existing signing profile LORI_TV_Development. Signed original package/source matched at discovery; original HTML/CSS/JS launch is user-reported. Prior dated setup notes remain historical. Current authorization permits only the approved remote diagnostic extension and one controlled build/install attempt, stopping on failure; no certificates, TV settings, commits or pushes.

One local VM/DOM validation passed; no physical remote results claimed. Standalone tz build -w PROJECT returned 0 silently but did not update the signed WGT. Artifact hash remains edf1355e4281e17777329aa084f06dd3e0b34c833227b2fd069e85ad48f3bc5d and its HTML/JS/CSS differ from current source. Installation skipped to preserve working TV app. Installed extension source shows its Build Project uses tz pack-chain --proj-dir=PROJECT. Proposed next correction is to use that established pipeline, subject to user approval. No second build attempted.

### Manual sequence once the updated package is installed
1. Confirm the original navy LORI TV identity and HTML/CSS/JavaScript OK remain, and Remote compatibility R1 is visible. Initial focus should be Tile 5.
2. Press Up, Down, Left, Right once each: expected Tile 2, Tile 5, Tile 4, Tile 5. Verify visible blue focus and observed checklist entries. At grid edges focus must remain on-screen.
3. Press OK once: Tile 5 activation count increases once. Hold a directional key briefly; observe repeated navigation/logging without a trap.
4. Press Back: exit prompt opens with Cancel focused. Press OK: returns to previous tile without exiting. Reopen prompt, move to Exit, then press Back: cancels and restores previous tile.
5. On a noncentral tile, press Home on the Samsung remote, then reopen/return to the app. Record visibility/focus log and restored tile. If the OS restarts the app, record a fresh R1 session/Tile 5 instead of claiming resume.
6. Generate more than 24 events. Log keeps newest 24 only; visible log viewport may show fewer. Confirm six keys observed does not by itself mean hardware PASS.
7. Finally Back > Right > OK explicitly exits. Relaunch from icon and check a fresh checklist, zero activations and Tile 5. Record whether exit/relaunch actually succeeds.
Report each result and any missing/double events, lost focus, unexpected exit, missing lifecycle event or visual clipping. This sequence is pending successful build/install and user execution, not executed evidence.

## R2 icon evidence and deployment gate — 2026-10-26
R1 corrected pipeline succeeded after earlier stopped attempt. User confirms arrows, OK, Back/Cancel, Exit/relaunch and focus PASS. Detailed event-log/lifecycle telemetry is not independently reviewed. Full Phase 00 playback/transport/PiP gates remain open.

Icon source: approved cyan/blue stylized L reference. Existing development icon and installed tv-samsung-10.0 template both 117x117, 32-bit PNG RGBA. Package icon.png replaced at that size; config retains source and explicitly records dimensions. Optional 512/1024 masters are outside the app under assets/branding; they are not claimed as required TV submission artwork. [Samsung icon Q&A](https://developer.samsung.com/smarttv/design/smart-tv-application-design-qa.html) and [published icon requirements](https://developer.samsung.com/smarttv/design/app-icons-and-screenshots.html) distinguish development packaging from Seller Office assets.

Built-in imagegen prompt: faithful approved reference; one premium minimalist stylized capital L, smoothly curved lower corner/rounded foot, electric-blue/cyan gradient and subtle dimensional highlight on dark navy, centered rounded-square composition, safe padding, legible at 117x117, no mockup/captions/specification tables/wordmark or extra text. Generated master resized into 1024/512/117 PNG exports without changing the R1 interface.

One pack-chain build passed; signed WGT SHA-256 9b6111ed07c915c0b5f0364441b48933890a1fc83b4a8a146eac4504a1f0f737. Icon and R1 source bytes verified inside package; config identical after whitespace normalization, app identity unchanged; both signatures/reference digests and R1 certificate continuity verify. Active existing signing profile unchanged.

Deployment gate: user explicitly requires approval before uninstall. Installed tz install previously uninstalled/reinstalled the same app, and no no-uninstall option is documented by installed help. No R2 installation or launch attempted. Once user approves replacement, install this already verified artifact once, launch once, then user opens Samsung Apps and checks the blue L, no Tizen logo/text, readability and preserved R1 behavior. If cached old icon persists, report first; no reset/cache purge/uninstall workaround without approval.

## R3 audio evidence and exact device sequence — 2026-10-26
R2 icon, Apps launch and R1 regression physically confirmed PASS by user after the previously approved single replacement cycle. Earlier R2 deployment gates remain historical. R3 audio implementation/package preparation is now authorized; its deployment is not.

The isolated screen is audio.html, opened from R1 Tile 9 (Audio R3), retaining original R1 control code and R2 icon/config. Remote keys move a 4x3 control grid; Back/Return stops audio and returns to the ordinary R1 initial focus. Audibility is manual-only. No autoplay, no initial audio src, no network media, no video/AVPlay. Valid and deliberate-invalid fixtures are bundled; failed-load recovery never starts playback automatically. UI PASS rows describe events/properties, not speaker output. Element volume does not change Samsung system-volume settings.

Fixture: [Media-440Hz.ogg](https://commons.wikimedia.org/wiki/File:Media-440Hz.ogg), public-domain dedication/PD-self, original uploader Bre Dun. Original SHA-1 checked; locally repeated and converted with existing FFmpeg to mono MP3/44.1 kHz/96 kbit/s, 144867 bytes, 11.994195 s. See media/LICENSE.txt for full provenance, command and derivative SHA-256. No new dependency installed.

One local simulated-DOM/media-event validation passed; one pack-chain build passed exit 0. Signed R3 WGT hash 38c298b3a6c57dc946323e17918c1e9601dbd8d9526b73c642e842923d018434. Eleven source/asset/license entries match package; identity/config/icon unchanged; author/distributor signatures and all 17/18 digests verify with R2 certificates. This is package evidence, not hardware audio evidence.

### Physical instructions after a separately approved deployment
1. Open from Samsung Apps. Confirm custom icon and R1 still work. From Tile 5 press Down, Right, OK to open Tile 9 / Audio R3. Audio must initially be silent, all observations PENDING, focus on Load.
2. Choose Load audio: finite duration near 12 seconds, MP3 fixture metadata and metadata PASS should appear. Loading alone must remain silent. canPlayType is only a browser hint.
3. Choose Play/resume. Watch time advance, press Pause before clip ends, wait to see frozen time/silence, then Play/resume. Record play, pause, resume/time observations; replay after ended when needed.
4. During playback choose Mute/unmute twice and Volume minus/plus. Verify property/event observations and separately report actual audible changes. The app must not adjust Samsung system-volume settings.
5. Confirm TV speakers are the sound source. Only if sound is actually heard during unmuted playback choose I hear TV speakers. Otherwise select I do NOT hear sound and report the failure. No automated event can pass this row.
6. Choose Test failed load. Wait for an expected local error code; controls remain responsive. Choose Recover: load valid. Metadata should reload without sound; explicitly choose Play and observe recovery PASS plus advancing time.
7. Exercise arrows/OK across the grid; Back returns safely to R1 and stops audio. Optional Home/return on audio screen must leave it paused until explicit Play, with focus restored. If OS restarts it, report restart rather than resume.
8. Report metadata/duration; play/pause/resume/time; mute/unmute/volume; error code/recovery; focus/Back; audible TV-speaker result and any clipping. Logs retain newest 24 entries and clear when screen is recreated. Do not mark full Phase 00 complete.

Deployment proposal: after explicit approval, verify named TV and exact R3 hash/signature once, invoke the known SDK targeted uninstall/reinstall replacement once and launch once. Stop on failure. Until then R2 remains installed.

## R4 video/AVPlay preparation and device procedure — 2026-10-26
R3 audio user reports works on the TV; this confirms a general functional result only. A01..A06 require explicit per-scenario feedback before individual PASS. R3 rollback hash 38c298b3a6c57dc946323e17918c1e9601dbd8d9526b73c642e842923d018434 preserved privately.

R4 uses isolated video.html from R1 Tile 8. No changes to R1 control logic, R3 audio implementation, icon, config identity/permissions or certificates. New local fixtures are 12-second generated moving bars/pattern (CC0 dedication), with the existing public-domain R3 audio transcoded to AAC-LC. H264 Constrained Baseline L3.0, 640x360/24fps/yuv420p, AAC-LC mono/44100Hz; MP4 789753 bytes. Local HLS version 6 VOD uses four 3s MPEG-TS segments with relative references/ENDLIST, no encryption/auth/server/network. Exact provenance, codec and SHA-256 data are in media/LICENSE.txt and video-fixture.json. Both formats fully decoded in local FFmpeg tests.

HTML5 MP4 and HTML5 HLS are separate load/play selections; an empty HLS capability hint is logged but still tested explicitly. AVPlay selections use $WEBAPIS built-in library, absolute local pathname, listener/display setup, nonblocking prepareAsync and state-aware operations. Stop/Back wait for pending preparation/seek before cleanup, with stale callbacks ignored. One active player; no autoplay, network permission, external media or library fallback. In-app fullscreen has OK pause/resume, Left/Right seek, first Back restores controls; next Back stops/closes and returns to R1. Logs contain safe enums/state/time, not raw URLs or device identifiers.

References: [Samsung AVPlay guide](https://developer.samsung.com/smarttv/develop/guides/multimedia/media-playback/using-avplay.html) and [API state restrictions](https://developer.samsung.com/smarttv/develop/api-references/samsung-product-api-references/avplay-api.html), checked 2026-10-26. AVPlay local media needs absolute paths, display rectangles use a 1920x1080 coordinate basis, and async callback completion precedes other player operations. No obsolete AVPlay privilege added.

Local tests PASS (simulated DOM/media/AV state machine, not physical TV), one signed pack-chain build exit 0. Package SHA-256 f981155f45f203476c5cba5ecb90911cce77c79e63f64de575e71eee2e21e0a8, 1782994 bytes. All 23 runtime/media/license entries match; R3 configuration/identity/icon/protected sources retained. Signatures and all reference digests verify with existing signing profile. Package prepared only: no TV installation attempted.

### Physical R4 procedure after explicit deployment approval
1. Open from Samsung Apps; confirm existing icon and R1 screen. From Tile 5 press Down then OK to enter Tile 8 Video R4. Confirm silence/black preview until explicit actions; no player should be opened before selection. Tile 9 Audio R3 still works separately.
2. Select HTML5 MP4 load: wait for metadata near 12s/640x360, then Play. Check moving pattern and audible TV-speaker sound personally. Use I see moving video and I hear TV speakers only for actual observations. Technical clock PASS is not picture/sound evidence.
3. Before clip ends, Pause, Play/resume, Seek minus/plus 3s. Observe paused picture/time, resumed movement and seeked time. Reload/replay the short clip manually if ended; no automatic retries.
4. Select In-app fullscreen. OK toggles pause/resume; Left/Right seek; Back must restore the control layout and focus. Stop closes the active player; Back from controls returns to R1 without residual audio. This tests app fullscreen, not Samsung OS/window control.
5. Reenter R4. Load HTML5 HLS, then Play. Record metadata/time, moving picture/sound, buffer/error events independently from MP4. If local-file HLS is rejected, report exact visible code; leave network HLS PENDING. No automatic player/library fallback.
6. Load AVPlay MP4: API presence, IDLE/open and READY/preparation should be logged, without autoplay. Play, pause/resume, seek, fullscreen/Back and Stop. Record state/callbacks, responsiveness and actual picture/sound.
7. Load AVPlay HLS and repeat separately. Only one player may sound/display at a time; switching must stop the previous player. Local VOD success does not prove HTTP/live/adaptive behavior.
8. In either engine, Test failed load should capture the deliberate invalid local file error without freezing controls. Recover loads the last valid engine/format but remains paused until Play. Report recovery picture/time/sound.
9. Optional Home/return must stop/close or queue cleanup and never auto-resume. Report API absence, timeouts, local-path rejection or display-plane problems exactly. Do not repeat build/install automatically.

Pending limitations: every R4 physical result, native decoder support, local-file HLS support, real display/audio, remote/fullscreen/lifecycle correctness; real network buffering and HTTP/live/adaptive HLS not tested by local fixtures. Buffer-event observation remains PENDING if none occurs; never synthesize PASS. Deployment requires a new explicit approval for one targeted SDK replacement and launch cycle.


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
