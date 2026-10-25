# Phase 00 compatibility assessment and setup runbook

Date: 2026-10-26 (Europe/Budapest). Status: preparation READY_FOR_REVIEW; device execution PENDING, not authorized. This is a plan, not evidence that these steps ran.

## Current evidence

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

This session permits documentation corrections, package extraction and local Git preparation only. Obtain separate approval before downloading/installing tools, changing TV/network/firewall settings, creating/importing signing credentials, connecting SDK tools to TV, or creating/building/installing/running diagnostic application code. No account credentials should be pasted into chat or committed. Approval of this document does not itself execute these steps.

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
