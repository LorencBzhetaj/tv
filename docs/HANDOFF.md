# LORI TV — Agent handoff

**Project:** LORI TV (Samsung Tizen + Remote PWA + Manager)  
**Canonical remote:** https://github.com/LorencBzhetaj/tv.git  
**Package:** v3.5 baseline; Phase00 diagnostic and Phase01.5 browser preview checkpoints preserved
**Current agent:** Codex (M2 finalization; M3 planning only)
**Next agent:** Codex or Claude after user review; inspect current files first  
**Current phase:** M2 PASS / COMPLETED for approved local frame/design/localization scope. Visual approval received; final local gates PASS. M3–M6 NOT STARTED; Content Engine NOT IMPLEMENTED. M1 published baseline e22400d926d015061ea1805bed293925930e4691; M2 remains uncommitted.
**Approved scope:** Final M2 inspection/validation and M3 architecture/testing plan only. No M3 source, TV connection/install, signing, certificate changes, commit or push. Earlier milestone records below are historical.

## M2 closure and M3 review handoff — 2026-10-29

### M2 accepted result

- User explicitly approved the visual direction in the finalization request. All final mandatory local gates PASS; M2 COMPLETED for its PC frame/design/localization scope. Physical Samsung safe area, readability and M3 remote handling remain PENDING. M1 remains accepted/published at e22400d926d015061ea1805bed293925930e4691. M2 Git checkpoint is not authorized by this task.
- Footer investigation found NO overlap bug. Main scroll region bottom equals footer top; footer occupies its own CSS Grid row. The initial partially visible preferences panel is below the scroll fold, not hidden by an overlapping footer. No UI/CSS/runtime correction was needed, preserving approved tokens and functionality.
- Browser matrix: 12 cases (Full/Standard × EN/SQ ×1280x720,1920x1080,425x612) PASS. Arrow from Menu reaches Display settings; Enter focuses View mode, Tab reaches Language; native select arrows retain option selection behavior. Both selects remain fully reachable and focused Language outline stays above main/footer boundary. Minimum measured outline clearance28.17px; no horizontal document/main overflow. Six Full-mode Menu/Escape cases restored the Menu invoker and exact content scroll. Standard Mode retains persistent navigation. EN/SQ + view preferences survive reload; safe fallback/storage negatives covered by Node tests. This is PC evidence, not physical remote validation or an arrow-only TV select guarantee.
- One justified final static build (not WGT packaging/resigning) reproduced unchanged five-file runtime inventory. Commands typecheck, build, test, verify:stage all exit0. Exact counts:18 Node tests PASS, including the unchanged22 Java URI/archive/tamper assertions; no assertions removed/weakened. XML/SDK schema, relative paths, exact staging bytes/inventory and original identity/branding/CSP PASS. No new signed M2 WGT exists; no chain/revocation trust claim.
- M1 rollback apps/tv/Build/m1-reference/package.wgt remains unchanged SHA-2568382afd1b3266330ee6fbe45723fea574e71dc5600a521075abe78d18f63b2ee. No diagnostic/Phase01.5 preview, SDK, certificates, privileges, dependencies or app source changed during finalization. Current task changes only HANDOFF, PHASE_TRACKER, ACCEPTANCE_TESTS, ROADMAP and PACKAGE_MANIFEST; prior M2 implementation remains uncommitted.
- Console errors/warnings observed:0. Ignored local evidence: Build/m2-footer-evidence.json (12 measurements), Build/m2-final-footer-full-en.png and Build/m2-final-footer-standard-sq.png. Server remains loopback http://127.0.0.1:4174; Display settings or keyboard Tab exposes controls below the fold. User viewport override restored. Manifest retains76 planning entries, all final checksums refreshed/validated; source/privacy/scope checks exclude generated artifacts/private signing material.

### Proposed M3 architecture — NOT IMPLEMENTED / approval required

Goal: replace the temporary PC DOM-order adapter with one local vanilla-TypeScript input/focus/navigation system; no library/runtime dependency, provider, Content Engine, media source, AVPlay or actual playback. ADR-007 stays evidence-gated; this is a proposed implementation, not physical acceptance.

1. Input boundary: one installed/disposable keydown/keyup owner converts PC keys and Samsung mandatory codes (Left37,Up38,Right39,Down40,Enter13,Back10009) to typed actions. Preserve browser/OS-owned Home, volume and power. Deduplicate Enter/native click activation; do not handle the same event in component and global listeners. Recognized, owned Back is consumed before browser/default exit; editing Backspace remains editing. Clear held-key state on blur/visibility changes.
2. Capability adapter: mandatory keys need no registration. Feature-detect tizen.tvinputdevice; getSupportedKeys and register only the intersection of supported names with an explicit optional Menu/media/color allowlist, once, with bounded errors and cleanup of keys actually registered. Missing API/privilege/key must not disable arrows/OK/Back. Menu action always has an on-screen path; physical Menu is not assumed to exist or be app-owned. Play/Pause emits a typed capability-gated action only when a future consumer exists, otherwise harmlessly ignored; no fake player. Do not register OS Home/volume/power.
3. Proposed permission gate: optional key enumeration/registration requires ONLY http://tizen.org/privilege/tv.inputdevice. User must approve this with M3; no config change now. Verifier must then explicitly allow this single privilege and keep all other privilege/origin/schema/source checks strict; no generic bypass. Mandatory-key-only operation remains usable if optional registration fails. Configured API version, identity, signing profile and five-file package inventory remain unchanged.
4. Focus manager: local registry of stable screen/region/node IDs, explicit Up/Down/Left/Right neighbors and remembered region anchors. No geometry search or framework. Disabled/hidden/inert/disconnected targets are ineligible; find next explicit eligible neighbor, nearest surviving registered sibling, owning region fallback, then Menu. Atomic DOM update/registration before restoration; no polling/retry loops. One logical/DOM focus, selection styled separately. Home initial focus follows approved first enabled hero action (currently Display settings); missing content falls back to Menu. Header Down restores content anchor; content Up reaches header; Standard content Left enters active sidebar; Full content Left reaches Menu, OK opens overlay. Regions clamp by default; only modal Tab wraps.
5. Modal scopes: store invoker ID and each scroller offset; push active scope, inert background, focus current choice or Cancel/Deny. Back/Escape pops only top scope and restores valid invoker+scroll; no background activation. Preserve blue outline/halo, reserved ring space and reduced motion. Recommended M3 native-select strategy for review: replace only View/Language native popup interaction with app-owned accessible option dialogs using the same rows/tokens/resources, so arrows/OK/Back are deterministic on TV; no cosmetic redesign. No production focus test relies solely on a fake DOM.
6. Navigation/back stack: pure bounded screen+focus+scroll snapshots with explicit push/pop/replace. Home remains cold-start; no deep route restored on reboot. Back priority: editing/option popup -> top modal -> Menu overlay -> nested history -> root Exit confirmation (Cancel default). No automatic app exit. Only deliberate confirmation may invoke an injected platform-exit hook, mocked in PC tests. No player/session branch implemented now; preserve the later approved direct-immersive OK/Back and Stop/Close barrier contract without simulating it.
7. Repeat/reentrancy: keyup-bound activation token and event.repeat suppression for OK/Menu/Back, one in-flight transition; coalesce bursts. Preview450ms Back guard is an initial candidate, not validated TV timing. Directional repeats use an injected monotonic clock and bounded throttle, tuned later on TV; no repeated action queue growth. Failed/missing targets yield deterministic fallback and bounded non-sensitive diagnostics. Lifecycle restore is focus-only; no media lifecycle work.
8. Nested screens are tested through synthetic fixtures and generic stack contracts; M3 does not implement catalog/profile/Favorites content routes. Integrate only the existing Home/frame/preferences/Menu. No hidden full-shell or playback implementation.

Samsung reference evidence reviewed2026-10-29: Remote Control key-code guide https://developer.samsung.com/smarttv/develop/guides/user-interaction/remote-control.html and TVInputDevice API https://developer.samsung.com/smarttv/develop/api-references/tizen-web-device-api-references/tvinputdevice-api.html. The latter documents mandatory keys excluded from registration/getSupportedKeys and the public tv.inputdevice privilege. These establish API contracts, not verified support of optional keys on this physical remote.

### M3 implementation sequence and exact proposed file scope

After separate approval, proceed in this order; no files below have been created by this plan:

| Step | Proposed files | Responsibility |
|---|---|---|
| 1 | apps/tv/src/input/remote-input.ts; apps/tv/tests/remote-input.test.mjs | Typed mandatory/PC mapping, repeat/reentrancy/keyup policy with fake clock |
| 2 | apps/tv/src/input/tizen-keys.ts | Local minimal API types, supported optional-key discovery/registration/disposal; no external Tizen type package |
| 3 | apps/tv/src/focus/focus-manager.ts; apps/tv/tests/focus-manager.test.mjs | Explicit graph, scope stack, eligible targets, focus/scroll and removal fallback |
| 4 | apps/tv/src/navigation/navigation-stack.ts; apps/tv/tests/navigation-stack.test.mjs | Bounded generic history, nested fixture origins, root exit request, atomic Back |
| 5 | apps/tv/src/frame.ts; apps/tv/src/main.ts; apps/tv/src/pc-navigation.ts | Wire one input owner, stable control IDs/scopes, remove/replace temporary adapter; existing frame preserved |
| 6 | apps/tv/src/locales.ts; apps/tv/src/boot.css; apps/tv/tests/dom-helper.mjs; apps/tv/tests/m2.test.mjs | Localized option/exit dialogs if approved, scroll-padding/margin/ring safety, regression adapters |
| 7 | apps/tv/config.xml; apps/tv/scripts/verify-xml-package.ps1; apps/tv/tests/m1.test.mjs | Conditional tv.inputdevice privilege ONLY after approval; exact verifier/identity-security expectations retained |
| 8 | apps/tv/README.md; docs/ARCHITECTURE_DECISIONS.md; docs/ACCEPTANCE_TESTS.md; docs/PHASE_TRACKER.md; docs/HANDOFF.md; docs/ROADMAP.md; PACKAGE_MANIFEST.json | Commands, ADR-007 proposed/evidence status, test records and milestone gate |

Seven proposed new files (four runtime modules, three test files); modify only named existing paths. No new framework, shared packages, workflows, hosting, catalogs, media or production-route scaffolding. package.json/lock/build/signing scripts and assets need no changes by default. If a further file becomes necessary, report scope change first. New runtime modules bundle into existing app.js; no package inventory expansion.

### M3 test strategy, risks and approval gate

- Automated unit cases: all four mandatory directions; PC and Samsung OK/Back; unknown keys; optional API absent/throws/partial registration; duplicate keydown/click; held OK and Back; keyup loss; bounded directional repeat with fake clock. Assert no unowned OS key interception or action while inactive.
- Focus cases: every graph edge/region boundary, initial and return focus, Full/Standard + EN/SQ, modal trap and nested scopes, disabled/hidden/inert/removed targets, no eligible target fallback, locale/view mutation, exact scroll offsets, ring clearance after auto-scroll. Test native editing exclusion or approved option-dialog replacement explicitly.
- Navigation cases: synthetic3-level history, Back from leaf to exact origin, Menu dismissal before history, root Cancel restores invoker, explicit exit hook fires once, rapid/held repeated Back does not cascade. Run at least1000 seeded actions with invariants (one eligible focus, no background activation, bounded stack/log counts), repeated mount/dispose cycles show no duplicate listeners/registrations.
- Real browser (separate evidence): arrows/OK/Tab/Back without mouse in both modes/languages, stacked modal/option dismissal, disappearance fallback, nested fixture history, long navigation, footer/focus bounds at1280x720,1920x1080 and narrow PC window, zero console errors. Existing18 M2/M1 tests and22 signature-security assertions must remain PASS; add focused tests without changing earlier evidence into device PASS.
- Real Samsung TV (PENDING, later separately approved build/deployment): confirm actual input names/codes and supported optional list; one controlled signed package verified before install. User physically exercises D-pad/OK/Return, repeated Back, held arrows, Menu equivalent, focus reachability/overscan/readability and return from OS Home; optional media/colors only when advertised. No need to repeat closed R6/R8 playback tests; no playback integration in M3.
- Main risks: optional Menu/media differences; native select/IME focus ownership; lost keyup; duplicate native activation; changing DOM invalidating anchors; too-fast repeat; scroll clamping when content shrinks; schema/privacy regression when adding privilege. Mitigate with explicit capability/action ownership, scoped dialogs, deterministic fallback, fake-clock tests, narrow permission checks and later real-device evidence.
- Approval decisions: accept explicit custom graph/stack approach for ADR-007 implementation (device evidence still pending); approve minimum tv.inputdevice permission and exact verifier expectation; approve option-dialog replacement for predictable TV controls; approve M3 source scope only. M2 Git checkpoint and any Samsung deployment remain separate approvals. M3–M6 NOT STARTED; Content Engine NOT IMPLEMENTED. STOP for review.

## M2 production frame handoff — 2026-10-29

- Entry verified main, local HEAD/tracking origin/main and live remote all e22400d926d015061ea1805bed293925930e4691; clean tree. M1 source/tests/toolchain present. Diagnostic, approved Phase01.5 preview, allocated production identity O12p0Tvvrb.LORITVProduction, icon, privileges and signing config unchanged. FREE-FIRST architecture untouched. User explicitly authorized M2 only; earlier M1-only ROADMAP authorization is historical.
- Implemented src/{frame,locales,preferences,pc-navigation}.ts with minimal main bootstrap and semantic DOM construction/textContent, no innerHTML. CSS retains navy #07101e, primary #1672ed, focus #48a9ff, Arial/Helvetica, approved type/spacing/radii, local branding. Primary/selected text uses white (contrast 4.50:1); normal text remains #f1f6ff. Design detector's Arial warning deliberately overridden by approved font specification; raw source index links generated CSS, so linked-style scan is incomplete. Manual browser/contrast checks supplied actual evidence.
- Home-only startup frame; Full View defaults on. Menu opens modal navigation with inert background, visible focus, trapped Tab and close/Back invoker+scroll restoration. Standard View exposes persistent sidebar; navigation labels present, future destinations disabled with a reason. Settings action scrolls/focuses local Display & language controls, not a route. No catalog cards, real profiles/Favorites, history, geometric/production focus engine or player.
- EN default, SQ selectable; complete equal-key resources cover runtime UI/title/status/accessibility strings. Known missing translation falls back to English, unknown key visibly brackets key and is inserted as text. Region/timezone not inferred. Validated localStorage key lori-tv.preferences.v1; corrupt values safely default, blocked storage allows session-only settings with localized warning after failed save. View/language changes retain nodes/focus/scroll.
- Frame fills actual viewport; design units scale from actual width/height versus 1600x900 reference, no fixed-resolution canvas/transform. Safe area rounds outward (48 at1600x900,58 at1920x1080,39 at1280x720), minimum16 for narrow PC windows. Narrow reflow and bounded scroll regions preserve reachability; 0.65 type-scale floor is a PC readability accommodation, not Samsung validation. Full View is independent of future video fullscreen and browser F11; no Fullscreen API used.
- pc-navigation.ts is a clearly isolated temporary PC DOM-order adapter: arrows/Enter/browser Tab, Escape or non-editing Backspace dismisses overlay; F toggles outside inputs/selects/dialogs. Native select keyboard behavior remains native. M3 must replace this with approved deterministic region/remote focus; no Samsung media/Back key registration or exit/lifecycle logic implemented.
- Commands: npm --prefix apps/tv run typecheck, run build, test, run verify:stage — PASS. 18 Node tests: original 7 boot/path/identity/source checks adapted to the new DOM plus 10 M2 cases and existing Java security suite (22 assertions). DOM-double tests assert state, not physical layout. Fresh clone requires existing ignored M1 and R8 fixtures for Java regression; test accepts explicit LORI_TEST_WGT override. Java temporary attack ZIPs remain beside the ignored fixture.
- No new signed M2 WGT produced. Current five-runtime-file staging plus SDK YAML passes source hashes/inventory/path checks and secure installed SDK schema, same application identity/CSP with no privileges/origins. M1 WGT preserved at ignored apps/tv/Build/m1-reference/package.wgt; unchanged SHA-256 8382afd1b3266330ee6fbe45723fea574e71dc5600a521075abe78d18f63b2ee. Its historical signature PASS is not M2 signing evidence; no full PKI chain/revocation claim.
- Browser checks: Full/Standard EN/SQ, reload persistence, modal inert/arrow/Tab/Escape behavior, F select exclusion, invoker/scroll restoration; actual viewport1280x720,1600x900,1920x1080 and390x844 narrow Standard adaptation. No horizontal document/main overflow in checked layouts; no console warning/error observed. Native selectors may scroll themselves into view, as expected. No physical TV acceptance claimed; all controls remain scroll-reachable.
- Local server npm --prefix apps/tv run preview at http://127.0.0.1:4174 (loopback only, explicit runtime allowlist); four public runtime URLs 200; six config/private/traversal/WGT URLs rejected404. No remote media/API dependencies. Screenshots ignored locally: Build/m2-full-en.png and Build/m2-standard-sq.png at1280x720. apps/tv/README.md contains exact commands, artifact prerequisite, controls and differences from preview. Temporary reference-preview server stopped; production PC preview left running for review.
- Differences intentionally limited by M2: content rails/details/player and fake catalog/artwork omitted; honest empty-state copy and inline display/language controls replace later screens. No prototype monolith/global geometry/simulated player/unsafe HTML copied. Narrow layout reflows instead of scaling a fixed prototype canvas. Existing approved preview remains unchanged.
- Scope/privacy/manifest checks: planning manifest remains 76 existing documentation/branding entries; application source excluded by established convention and tracked through Git. No dependencies installed, package-lock unchanged, no new permissions/origins, SDK/certificates untouched. Generated Build/node_modules/WGT/screenshots ignored. No commit or push. M2 READY_FOR_REVIEW, not COMPLETED; user visual approval required. M3–M6 NOT STARTED; Content Engine NOT IMPLEMENTED. TV overscan/readability, real remote focus/lifecycle and later routing/player still pending.

## Approved M1 Git checkpoint — 2026-10-29

- User accepted M1 for checkpoint conditional on final verification; all mandatory checks now PASS. M1 COMPLETED within identity/toolchain scope only. Branch main and fetched origin/main both at approved base 2e98a3c450bddc0c1ae490f4c5c3fdc657debe4f before checkpoint. Intended commit: feat(tv): complete phase 02 m1 production toolchain. Final commit/remote SHA will be reported after push; no follow-up documentation commit needed.
- Final commands: npm --prefix apps/tv run typecheck; run build; test; run verify:stage; run verify:package — all exit 0. Original signed Debug artifacts copied to ignored Build/checkpoint-preservation-* before standard build cleared generated staging, then restored byte-for-byte. All five runtime inventory hashes reproduced identically. No signed package rebuild/resigning occurred.
- All 8 tests PASS, including 22 Java URI/archive/tamper assertions. Installed SDK secure XML/schema, package identity O12p0Tvvrb.LORITVProduction, inventory/path/content/CSP checks PASS. Java 8 XMLDSig author/distributor RSA-SHA512 cryptographic signatures PASS; all 6 author and 7 distributor Reference digests PASS; certificate identity continuity to hash-pinned R8 and current leaf validity dates PASS. No full PKI chain trust/revocation validation. WGT SHA-256 unchanged: 8382afd1b3266330ee6fbe45723fea574e71dc5600a521075abe78d18f63b2ee.
- Approved inventory: 18 source/config/asset/toolchain/test files in apps/tv; .gitignore; docs/HANDOFF.md, docs/PHASE_TRACKER.md, docs/ROADMAP.md; PACKAGE_MANIFEST.json (23 files). Planning manifest retains its 76-entry documentation/branding scope, excluding application source as established; Git tracks approved app sources separately. Generated output, WGTs/rollback copies, node_modules, private scaffold and signing material excluded. Diagnostic/preview and FREE-FIRST architecture untouched.
- Limitations: production TV boot/accessibility not physically validated. URI-security test and package checks require the existing local SDK, signed M1 WGT and hash-pinned R8 baseline (ignored artifacts); a fresh clone must provision approved local artifacts before these checks. Static boot build/typecheck do not require signing. No real media/network or production shell interaction implemented.
- M2–M6 NOT STARTED; Content Engine NOT IMPLEMENTED. No TV connection, install or launch; no hosting/workflows or certificate changes. Next action requires separate M2 authorization. Older READY_FOR_REVIEW/blocker records below retain historical evidence and are superseded by this accepted M1 checkpoint record.

## M1 final reference-URI verification — 2026-10-29

- Current result: M1 technical verification PASS, READY_FOR_REVIEW; not user acceptance or permission to commit/deploy/start M2. Main baseline remains 2e98a3c450bddc0c1ae490f4c5c3fdc657debe4f; production O12p0Tvvrb.LORITVProduction. Older blocker records below are historical and resolved.
- Exact author references in signed order: assets%2Ficon.png; app.js; boot.css; config.xml; index.html; #prop. Distributor: same five file references; author-signature.xml; #prop. All file references relative, no other percent encoding, duplicates or unexpected targets. Only nested asset separator is encoded consistently in both signatures. Fragment #prop declares http://www.w3.org/2006/12/xml-c14n11; file references have no transforms. SDK URI encoding was compared literally to ZIP names by the earlier verifier, causing the mismatch.
- Resolver uses java.net.URI without changing SignedInfo/XML: only relative ASCII allowlisted paths and single %2F/%2f separator decoding accepted. Absolute/authority/query/fragment file URIs, invalid escapes, backslashes, encoded traversal, double encoding, dot/empty segments, non-ASCII aliases and unexpected/missing ZIP targets rejected. Canonical targets tracked uniquely; exact ASCII inventory rejects case/Unicode aliases and duplicate ZIP names. Every required file exactly once plus exactly one #prop; only registered unique #prop delegates to standard dereferencer. Canonical XML 1.1 added only for #prop, matching signed SDK metadata; other strict transform/algorithm gates preserved.
- Existing WGT verification command npm --prefix apps/tv run verify:package exited 0. Java 8 XMLDSig provider XMLDSig cryptographically validated RSA-SHA512 SignedInfo/SignatureValue independently for author and distributor, all 6 author references (5 files + properties), all 7 distributor references (6 files + properties), then aggregate validation. Both leaf certificates match hash-pinned trusted R8 baseline byte-for-byte and pass validity-date checks. Package identity/config/schema/source inventory/privacy and archive CRC checks PASS. No general certificate-chain trust-anchor or revocation validation performed; those remain outside this verification scope.
- Regression: strict typecheck PASS, original seven tests PASS, new Java security suite PASS (22 assertions inside eighth Node test). Covers valid plain/encoded paths, canonical duplicate, encoded/plain traversal, double encoding, slash/backslash ambiguity, external/absolute/query/empty/malformed URI, case/Unicode alias, missing/unexpected ZIP target/inventory and tampered runtime digest. Temporary adversarial ZIP copies created/deleted only under ignored Build; original WGT read-only. Stage runtime/source hashes and XML schema PASS. Security tests compile using existing Java 8; no provider installed.
- WGT SHA-256 before/after unchanged: 8382afd1b3266330ee6fbe45723fea574e71dc5600a521075abe78d18f63b2ee. No rebuild/resign, TV contact, certificate/SDK changes, commit/push. Diagnostic/preview unchanged. Manifest 76-entry planning scope retained; all final hashes refreshed/validated. Full reproducibility across independent builds, real-browser accessibility and production TV boot remain untested; no device acceptance inferred.
- Current task changes only VerifyWgt.java, tests/VerifyWgtSecurity.java, tests/uri-security.test.mjs and necessary handoff/tracker/roadmap/manifest. Full original M1 work remains uncommitted. M2–M6 NOT STARTED, Content Engine NOT IMPLEMENTED. Await user review and separate checkpoint approval.

## M1 approved algorithm/staging resolution — 2026-10-29

- Preflight main/HEAD unchanged at approved baseline; original WGT SHA-256 before/after remains 8382afd1b3266330ee6fbe45723fea574e71dc5600a521075abe78d18f63b2ee. No rebuild, resign, TV contact, SDK/certificate changes, commit or push.
- Both SDK signatures use http://www.w3.org/2001/04/xmldsig-more#rsa-sha512; all Reference digests use http://www.w3.org/2001/04/xmlenc#sha512. W3C XML Signature 1.1 sections 6.2/6.4.2 document these URIs (https://www.w3.org/TR/xmldsig-core1/). Original SHA256-only algorithm gate caused rejection, not evidence of invalid cryptography.
- VerifyWgt now explicitly allows only RSA-SHA256/RSA-SHA512 signature URIs and SHA256/SHA512 digest URIs. Java 8 compiles and its DOM XMLDSig provider unmarshals RSA-SHA512; full cryptographic compatibility is NOT yet established because reference checking stops first. Secure XML parsing, secureValidation, strict transforms/reference coverage, byte-identical baseline certificate comparison and validity dates remain enforced. SignatureValue and each Reference now have explicit independent validation calls, followed by aggregate validation, but these were not reached.
- One verification run: package/config/schema/path/inventory checks PASS, then STOP at Unexpected/duplicate file digest. Read-only inspection identifies author/distributor Reference URI assets%2Ficon.png; exact archive entry is assets/icon.png. Current strict URI lookup treats them as different. No URI normalization/fallback was added; no verification retry. Author certificate continuity and dates passed before this gate; distributor continuity/dates and both signatures/all reference digests remain UNVERIFIED. Archive CRC pass precedes this gate. No certificate-chain trust or revocation audit performed.
- Debug directory created 2026-10-28 00:43:58 in local filesystem timestamps, matching the recorded single SDK pack-chain run. Exact files: Debug/package.wgt and Debug/projects/package/{app.js,boot.css,config.xml,index.html,assets/icon.png}. Copies are byte-identical to runtime staging, with no private keys, certificates, logs or source maps among loose artifacts. WGT contains only five runtime files plus public author/distributor signature XML; no Debug entries, private material or SDK metadata.
- Staging verifier now distinguishes the original six staging inputs from this exact optional six-file SDK output set. Any additional/missing file, symlink or changed intermediate runtime byte still fails; WGT inventory verification remains unchanged. No arbitrary Debug contents allowed. Package signature verification remains separately mandatory.
- Regression: strict typecheck PASS; all seven tests PASS; runtime hash/source consistency PASS; secure XML/installed SDK schema PASS; seven-file WGT inventory/path/config/source/privacy checks PASS. Generated Build and node_modules stay ignored. Manifest refreshed and validated; diagnostic/preview unchanged.
- M1 remains BLOCKED solely at reference URI handling. Recommended next reviewed change: narrowly resolve the observed URI encoding to the exact allowlisted archive path, reject traversal, double encoding, external URIs and duplicate normalized references, and retain complete digest/cryptographic checks. No full signature validity, PKI trust or M1 acceptance claimed. M2–M6 NOT STARTED, Content Engine NOT IMPLEMENTED. Prior blocker records below are historical.

## Phase02 M1 evidence and blocker — 2026-10-28

### Surgical verifier follow-up — 2026-10-29 (supersedes compilation blocker below)

- Preflight confirmed main at approved baseline, existing uncommitted M1 scope, diagnostic/preview untouched and expected WGT hash. Only verifier implementation change: named `RSA_SHA256_URI` equals `http://www.w3.org/2001/04/xmldsig-more#rsa-sha256`, replacing unavailable Java constant. No algorithm/certificate/digest/security gates relaxed.
- `npm --prefix apps/tv run verify:package`: Java 8 compilation now PASS. Secure SDK XML/schema, expected production identity, seven-file package inventory/path checks and exact assets/narrow config equivalence PASS. Runtime exited 1 at author algorithm gate: `Unsupported signature algorithm`. Read-only signature metadata shows BOTH author and distributor use `http://www.w3.org/2001/04/xmldsig-more#rsa-sha512`, whereas the approved verifier enforces RSA-SHA256. No retry, resigning or rebuild.
- Cryptographic author/distributor signature validity and reference digests remain UNVERIFIED (algorithm rejection occurs before validation). Author leaf certificate byte continuity against hash-pinned R8 baseline and current validity dates passed before the algorithm gate; distributor continuity/date validation was not reached and is UNVERIFIED. Archive CRC check completed before this gate. Full PKI chain, trust-anchor and revocation checks were not performed; continuity is not PKI trust or cryptographic validity.
- Regression: strict typecheck PASS; seven tests rerun, 6 PASS / 1 FAIL. Inventory test rejects SDK-generated Debug/ now present in the staging tree after packaging (`Unexpected/missing staging files.`). Original pre-package seven-test PASS remains historical. All five runtime staging hashes still match original build inventory, and package content/schema checks pass. No build command run or staged output rewritten to hide this regression. Requires separate narrow staging-verification design review; no broad inventory exclusions approved.
- WGT SHA-256 before AND after: `8382afd1b3266330ee6fbe45723fea574e71dc5600a521075abe78d18f63b2ee`. No TV contact, SDK/certificate changes, commit or push. M1 remains BLOCKED. Next approval must address exact SDK RSA-SHA512 signature/digest policy and post-package staging validation; do not accept arbitrary algorithms or remove security gates. Existing compilation-failure account below is historical.

- Preflight: main, canonical origin, exact approved baseline above, clean working tree. Diagnostic and preview remain unchanged; no TV commands executed.
- SDK allocation: `tz new --type=web --template=Basic_Empty --profile=tv-samsung-10.0 --project-name=LORITVProduction --ws-dir=C:/Users/Public/tv/private/phase02-m1-sdk` succeeded once. Original scaffold retained ignored locally. SDK allocated package `O12p0Tvvrb`, application `O12p0Tvvrb.LORITVProduction`, distinct from diagnostic package `k5qDkEn7ez`. Production widget URI `urn:lori-tv:production`, version 0.1.0, required Tizen 10.0. No diagnostic privileges copied; no privileges or external access origins; background disabled.
- Toolchain: Node 24.11.1, npm 11.6.2; exact dev dependencies TypeScript 7.0.2 and esbuild 0.28.2 with package-lock.json. `npm --prefix apps/tv install --no-fund --no-audit` exited 0. No runtime dependencies. SDK and reference package locations derive from home/repository paths, with optional local environment overrides; no keys/passwords copied.
- New `apps/tv/` contains only boot/config/toolchain/tests and the byte-preserved approved diagnostic icon. No preview migration, router/focus framework, player/media/session, provider or network implementation. Boot labels the starting screen Home; this is not M2 navigation. CSP blocks network/media and external code.
- Commands: `npm --prefix apps/tv run typecheck`, `run build`, `test`, `run verify:stage` all exited 0; seven node tests passed (boot DOM, absent-element failure, relative paths/accessibility, inventory, unsafe paths, distinct identity and unchanged branding). SDK secure XML/schema check passed. Tests use a minimal DOM double, not browser or TV evidence. Staging is an explicit five-runtime-file inventory plus SDK YAML; byte reproducibility across independent builds has not been measured.
- One signed build: `npm --prefix apps/tv run package` invoked existing `tz pack-chain --proj-dir=C:\Users\Public\tv\apps\tv\Build\package`, exit 0. Existing `LORI_TV_Development` profile selected; no certificate regeneration. SDK named output `apps/tv/Build/package/Debug/package.wgt`; verifier path corrected to this observed output without rebuilding.
- WGT SHA-256: `8382afd1b3266330ee6fbe45723fea574e71dc5600a521075abe78d18f63b2ee`. `run verify:package` passed seven-file inventory (five runtime assets plus two signatures), unsafe/duplicate path checks, exact non-XML content comparison, narrow SDK CSP-order/trailing-whitespace config comparison and installed SDK schema validation. No private files/unintended metadata accepted by the allowlist.
- **BLOCKER:** `verify:package` exited 1 because SDK `javac 1.8.0_242` reports `cannot find symbol: variable RSA_SHA256, location: interface SignatureMethod` at `scripts/VerifyWgt.java:41`. Signature verification did not execute. Author/distributor signature validity, referenced digests, certificate continuity/date checks and archive CRC verification remain UNVERIFIED, despite SDK signing success. No verification success record was emitted. Stopped without fixing/retrying or rebuilding.
- Proposed correction for separate review: use the standard RSA-SHA256 algorithm URI literal in the helper instead of the newer Java constant, preserving the same exact algorithm gate and secure validation. Then verify the existing WGT; no rebuild required. No general PKI trust-chain/revocation validation is claimed by this helper.
- Generated Build/, node_modules/, original private scaffold and any signing material are ignored, never staged. Existing R6/R7 and other rollback packages were not changed or deleted. No staging, commit, push or deployment performed.
- M1 is not accepted/complete. Resume only the blocked verifier after review; M2–M6 remain NOT STARTED and Content Engine NOT IMPLEMENTED. Historical documentation gate statuses below do not supersede this current record.

## Current free-first architecture handoff — 2026-10-28

- User approved playable-only main catalog, automatic ingestion/updates without mandatory playlist/URL entry, global categories constrained by rights/territory, zero LORI-injected ads and acceptance/preservation of provider ads. No public URL/HTTP200 as rights/native playback proof.
- Production Samsung AVPlay and Phase01.5 direct immersive Play/Watch -> OK controls -> Back hide visible transport -> hidden-controls Stop/Close + route/focus/scroll restoration remain authoritative. No automatic mini-player/background session. Existing diagnostics/preview are unchanged.
- ADR-004/005/008 record approved policy versus still-unapproved host/named providers/runtime implementation. ARCHITECTURE.md section 13 is the canonical publisher/registry/eligibility/versioning/cache/revocation/resource/hosting contract. Recommend Actions + Pages conditionally; Cloudflare Pages is evaluated for header control; no hosting setup selected or performed.
- Phase02: shell/controller/catalog interfaces using fixtures; Phase03A within 03: automatic approved Live/EPG and free-first publisher; Phase04 authorized playable VOD/metadata; Phase06 sports/advanced reliability; Phase08 full Manager only when needed. No phase auto-start.
- Risks: actual user territory/provider shortlist/publication permissions unresolved; no guaranteed rich free catalog count; static public hosting excludes private/token/entitlement feeds; schedules may delay/drop/disable; online revocation target requires cache tests and offline revocation is delayed until lease expiry. No permanent backend/paid upgrade without approval. Source native evidence and catalog signing design remain implementation gates.
- Entry verified main/HEAD 170540900012a0bf67a1aa5e1a7d1c4dad125d46, canonical origin, clean working tree. Current changes: eight existing docs (ARCHITECTURE, ARCHITECTURE_DECISIONS, ROADMAP, PHASE_TRACKER, HANDOFF, UI_UX_SPEC, ACCEPTANCE_TESTS, TV_ENHANCEMENTS_SPEC) + PACKAGE_MANIFEST.json; no new runtime files.
- Validation scope: Markdown tables/links/ADR and phase consistency, source-byte manifest integrity, complete diff/scope/privacy review. CE-01..16 are new measurable PENDING tests, not run playback or provider tests. No Phase00 retest. Final validation results are returned with the report; no commit created.
- Next: user reviews this documentation checkpoint and unresolved host/provider/territory decisions; explicit commit/push approval required. Phase02 remains separately unauthorized. Older dated session records below are historical, not current commands.

## Latest Phase 01.5 revision — Full View and direct immersive Player

- User's FINAL UX UPDATE supersedes earlier uniform Player Back/normal-entry wording. Full View defaults on; Standard View is a separate persistent preference. Menu opens trapped overlay navigation; Settings/F toggles view outside inputs/dialogs while preserving route/focus/scroll.
- Channel Watch/movie Play/episode Play enters immersive simulated playback directly. OK reveals temporary controls; Back dismisses topmost dialog, then visible immersive controls, then Stop/Close + origin when controls are hidden. Normal Player Back stops/closes. Explicit Fullscreen/Exit Fullscreen preserves play/pause/progress; playing controls auto-hide after four seconds, paused controls remain accessible. Rapid Back is guarded for 450 ms.
- Immersive surface fills application viewport; picture uses contain/16:9 fixture letterboxing, no real media, browser Fullscreen API or AVPlay. Interface view, video presentation and browser F11 are distinct. Production native display/release validation remains pending.
- Revision paths: preview/tv-ui/{app.js,styles.css,index.html,README.md}, docs/{UI_UX_SPEC.md,ACCEPTANCE_TESTS.md,PHASE_TRACKER.md,HANDOFF.md}, PACKAGE_MANIFEST.json (changed tracked-document checksums only). Earlier uncommitted preview fixture/server work preserved.
- Browser checks: all 11 primary routes in Full and Standard views, no horizontal content overflow in tested layout; keyboard/Tab overlay navigation, input/dialog F exclusion; direct immersive Live/movie/episode entry; OK reveal, four-second auto-hide, rapid Back dismissal, settings/transport/stop Back layers; seek/pause/play retained through Normal/immersive changes; episode-3 focus and scroll 156 restored, including view toggles. Surface measured 425×612 viewport with contained ~16:9 picture. No console errors/warnings observed; user visual approval received; native TV behavior remains pending. Node syntax, diff whitespace and manifest checks passed. No physical-TV evidence claimed.
- Status: Phase01.5 user accepted and checkpoint successfully committed/pushed as 170540900012a0bf67a1aa5e1a7d1c4dad125d46. Phase02 not started; that Git authorization is fulfilled, not permission for a new commit. Earlier preview/session records below are historical where superseded here.

## Phase 01.5 preview — 2026-10-27

- Entry: main, origin/main, clean working tree at f174f9ec1c406aea834f18352bf23b160c782d92. Earlier Phase 01 session notes below are historical.
- New files: preview/tv-ui/{index.html,styles.css,fixtures.js,app.js,server.cjs,README.md}. This handoff updated; its existing manifest checksum refreshed. Approved specifications, original mockups and LORITVDiagnostic unchanged.
- Launch from repo: `node preview/tv-ui/server.cjs`; open `http://127.0.0.1:4173`; Ctrl+C stops. Existing Node only, loopback static server, no dependencies. See preview README for controls and limitations.
- Screens: Home/sidebar, Live TV, Guide, Movies, Series/episodes, Search, Favorites, Watchlist, Details, simulated Player, Profiles, Settings; lightweight Sports/connection placeholders. Fixture-only explicit playback, no AVPlay/media/backend. Navy/blue tokens and proportional reference canvas preserved.
- Checks: JavaScript syntax and static asset HTTP checks; browser keyboard Enter/Back, Player return, card focus restoration, Favorites sync, fixture search, English/Albanian sample resources, modal focus wrap, loading/empty/error states. Browser console errors/warnings: none observed in smoke test. Browser evidence is not physical-TV acceptance.
- Visual review: user APPROVED the interactive preview, including Full View default and direct immersive playback/OK/Back restoration. Sample explanatory text remains partly English. No production focus architecture is selected by this prototype.
- Checkpoint outcome: approved eleven-file Phase01.5 commit/push completed at 170540900012a0bf67a1aa5e1a7d1c4dad125d46; no follow-up commit was created. Phase02 production shell/dependencies/device work still require separate approval.

## Repository state (fill in when working in local repo)
- Local path: C:/Users/Public/tv
- Branch: main (tracks origin/main)
- HEAD commit: 170540900012a0bf67a1aa5e1a7d1c4dad125d46 (approved Phase01.5 checkpoint)
- Remote status: canonical origin; this checkpoint's push/SHA verified in preceding Git session; no remote writes in current task
- Working tree clean?: Clean at current entry; current documentation/manifest edits uncommitted and unstaged

## Completed with evidence
- Phase00 accepted diagnostics, Phase01 specification checkpoint and Phase01.5 approved browser prototype; no production TV shell/Content Engine implementation.

## Pending and known risks
- Closed accepted scope: Samsung UE50M70HAUXXH/Tizen10 diagnostics, signing/install, remote navigation, R6 MP4/R8 HTTPS HLS playback. Do not repeat without a directly relevant regression.
- Open scope: new provider/format native evidence, DRM if later approved, PiP feasibility and pairing transport. Local HLS non-blocking FAIL; intentional-error recovery remains deferred.
- Verify legal sources, APIs, licensing and actual supported stream formats.
- External gallery/file/URL casting, security and privacy require design and real-device testing.
- Outstanding dedicated mockups for external media and TV enhancements may require review.

## Most recent agent session
- Date:
- Agent:
- Phase:
- User authorization (exact scope):
- Branch / commit:
- Changed files:
- Commands run + actual results:
- TV/phone observations and evidence:
- Decisions / ADRs:
- Blockers / limitations:
- Next action proposed:
- User approval to proceed?: NO

**Never overwrite earlier session evidence. Append new dated session entries below.**

## Session — 2026-10-26 (Europe/Budapest)
- Agent: Codex. Phase: preparation only, READY_FOR_REVIEW; Phase 00 runtime PENDING.
- User authorization: documentation-only corrections and Git preparation; explicitly no software install, TV modification or application implementation without separate approval.
- User observations: Samsung UE50M70HAUXXH; 50-inch Mini LED; T-X22UDHDEUC-0100-1; displayed version 213.2; TV and PC on same LAN. No independent SDK/platform/codec evidence.
- Commands/results: read archive; collision-safe extraction of 71 entries; git ls-remote (success, no refs); git init -b main (success); git remote add origin canonical URL (success); git fetch origin (success, no refs); git status -sb (unborn main, planning files untracked); Get-Command tizen,sdb (not on PATH); normal SDK locations absent. No device commands run.
- Changes: normalized ADR IDs, casting requirements/trust boundary, 37-PNG inventory, phase transitions and current version headings; clarified dependencies/provider-auth unknowns; added PHASE_00_COMPATIBILITY_PLAN.md and DOCUMENTATION_REVIEW_2026-10-26.md; updated tracker/handoff; regenerated manifest. No PNG or original ZIP changes.
- Validation: all 37 PNGs compared byte-for-byte against the original ZIP: PASS. Final manifest coverage/byte/hash verification is recorded in the tool results; manifest excludes itself and Git metadata. No app tests exist.
- Branch/commit: main; no HEAD, staging, commit or push. Preserve any newly appearing remote history before future baseline publication.
- Decisions: editorial corrections only. Runtime stack, SDK profile, transport, signing/installability, provider/PIN choices and PiP remain pending.
- Blockers: separate approval for setup and diagnostic implementation, actual TV/PC IPv4, compatible SDK discovery, developer account/certificates/DUID, real-device tests. Keep addresses, DUID and certificates private.
- Rollback: original Downloads ZIP remains unchanged; no remote or device rollback needed.
- Next proposed action: approved setup preflight and Developer Mode/SDK connection, then separately scoped diagnostic build/install. Approval to execute: NO.

## Session — 2026-10-26 — Phase 00 Step A, first interaction
- Scope: user approved Windows inspection and one-step-at-a-time Developer Mode guidance. Stop for user input; no installation without approval, no certificates or diagnostic app.
- Base: main / f817880965423b17039fd75a59b5423b53a0d6c6. Git status clean at start. Previous baseline commit/push was successful. No new commit/push in this session.
- Commands: Get-CimInstance Win32_OperatingSystem; Get-Command tizen,sdb,java; Get-NetIPConfiguration; Get-NetRoute for IPv4 default route; selected default paths and top-level installation folder checks; uninstall registry and Tizen/SDB/JAVA_HOME environment variable inspection; Get-Volume C. No device/network probes run.
- Results: Windows 11 Home 64-bit 10.0.26200; ~377.9 GiB free; no Samsung/Tizen/JDK installation identified in checked locations/records and no relevant commands on PATH. This is a bounded inspection, not proof no portable tools exist anywhere.
- Networking: physical Wi-Fi has LAN IPv4 and default gateway; virtual/WARP adapters also present. Actual addresses shown only in chat. No network, VPN or firewall changes. TV IP pending.
- TV evidence remains user-reported About values: UE50M70HAUXXH; T-X22UDHDEUC-0100-1; displayed 213.2. Actual platform/API capabilities unknown. Do not infer Tizen from 213.2.
- Updated files: PHASE_TRACKER.md, HANDOFF.md, PHASE_00_COMPATIBILITY_PLAN.md, PACKAGE_MANIFEST.json. No application/architecture changes. Manifest regenerated and checked after edits.
- Next user action: open Home > Apps, report whether App Settings/gear is visible. No developer code entry or setting change requested yet.
- Later installation proposal: Windows Tizen Studio Web/CLI tools and Device Manager/SDB; Samsung TV Extension; Samsung Certificate Extension (supported version, >=2.0.73) installed only with approval, no certificate creation. Exact available releases/prerequisites to inspect before download/install; no emulator/native/mobile SDK needed for first physical-TV connection.
- Actual capability verification: first inspect device metadata after approved SDK setup/connection. If API version is unavailable without an app context, leave UNVERIFIED; a later separately approved diagnostic app can query platform.version and test individual APIs.
- Stop: waiting for user TV UI observation; Step A incomplete, Phase 00 not accepted.

## Session — 2026-10-26 — Remote diagnostic, stopped at artifact gate
- Read the four pre-existing changed files and preserved earlier setup notes. Base main/f817880965423b17039fd75a59b5423b53a0d6c6; nothing staged/committed/pushed.
- Existing working project: LORITVDiagnostic; app k5qDkEn7ez.LORITVDiagnostic, package k5qDkEn7ez, version 0.2.1; tv-samsung API 10.0; active profile LORI_TV_Development. Source config/YAML preserved byte-for-byte against ignored backup. No certificates altered or secrets exposed.
- SDB discovery verified platform 10.0/armv7/tv and connected device; original display success user-reported. No updated app launched.
- Changes: .gitignore; diagnostic index.html/main.js/css/style.css; existing tracker/compatibility plan/handoff and their manifest entries. No new documentation file, framework, dependency or production UI.
- Backup: original diagnostic sources, config, build YAML and signed WGT in ignored private/phase00-remote-before. Generated Debug, deployment caches and workspace configuration ignored.
- Validation: one Node VM/DOM simulation pass, all assertions passed for direction focus, six-key observations, activation/repeat, safe exit/cancel, focus restoration, log bound and preserved baseline/config. No browser screenshot or physical key PASS claimed.
- One build command: tz build -w PROJECT. Returned code 0 with empty stdout/stderr; no new package. Existing WGT SHA-256 edf1355e4281e17777329aa084f06dd3e0b34c833227b2fd069e85ad48f3bc5d unchanged; three packaged edited files mismatch source. Build artifact validation FAIL; installation and launch skipped. No retry.
- Diagnosis: likely standalone-build versus extension pipeline mismatch. Static installed server code at ProjectBuilder.build calls pack-chain --proj-dir=PROJECT; proposed correction is one approved extension-equivalent pipeline invocation, then validate package and install/run only if valid. No fix/build loop.
- Await approval for correction. Physical TV manual steps are in the existing compatibility plan and remain PENDING. Commit/push must wait for user real-TV results and subsequent approval.

## Session — 2026-10-26 — R2 custom launcher icon
- Previous R1 corrected build/install/launch succeeded; user now confirms five physical categories PASS (arrows, OK, Back/Cancel, Exit/relaunch, focus). Event log was requested but not visually reviewed; attached images are icon references.
- User approved custom Variant A icon and R3 planning, with explicit no-uninstall-without-approval constraint.
- Asset verification: existing icon and installed tv-samsung-10.0 Basic_Empty template are 117x117 PNG RGBA. Samsung official Q&A distinguishes this development icon from Seller Office artwork. Reference mockup size labels are not platform requirements.
- Used built-in imagegen once, then deterministic size exports; final assets assets/branding/lori-tv-icon-1024.png, lori-tv-icon-512.png, and LORITVDiagnostic/icon.png (117). config icon src remains icon.png with explicit width/height. Original R1 sources/icon/config/YAML/WGT backed up under ignored private/phase00-r2-before.
- No edits to R1 HTML/JS/CSS or build YAML; verified hashes unchanged. App ID k5qDkEn7ez.LORITVDiagnostic, package k5qDkEn7ez, version 0.2.1 and signing profile LORI_TV_Development retained.
- One pack-chain build exit 0, signed WGT 9b6111ed07c915c0b5f0364441b48933890a1fc83b4a8a146eac4504a1f0f737. Build record private/phase00-r2-build-attempt.json. Old R1 hash e2d4152734a4cdba6e3746161c9e9b915df78361bb6427a4599912c74f656c00.
- Validation: icon and R1 files byte-match packaged entries; config differs only line endings/trailing whitespace after SDK serialization. Author/distributor signatures, all referenced digests and original certificate continuity verify. No general PKI chain audit claimed.
- Deployment stopped BEFORE install: prior tz install output explicitly runs uninstall then install; installed help offers no documented no-uninstall option. Need user approval for that concrete replacement cycle, or an approved supported non-uninstall workflow. Do not experimentally run alternative device mutations. No icon cache workaround, device setting or relaunch attempted. TV still runs R1.
- Existing pre-session documentation changes preserved. Updates only existing tracker/handoff/compatibility evidence and manifest, plus icon/config/branding assets. No new R3 implementation or planning file; R3 plan provided in final report only. No staging/commit/push.

## Session — 2026-10-26 — R3 audio prepared, not deployed
- User acceptance: R2 icon, Samsung Apps launch and R1 remote regression all PASS from physical TV; no independent claim of audio output.
- Pre-edit Git: main at baseline f817880965423b17039fd75a59b5423b53a0d6c6; five pre-existing tracked changes plus untracked diagnostic/branding assets preserved. No staging/reset/commit/push.
- Rollback: R2 source/config/YAML/icon and signed package backed up under ignored private/phase00-r3-before; WGT hash 9b6111ed07c915c0b5f0364441b48933890a1fc83b4a8a146eac4504a1f0f737.
- Files: index.html changes Tile 9 label/adds audio-entry.js only; main.js, R1 CSS, icon and config unchanged. Added audio.html/audio.js/css/audio.css; local MP3, deliberate invalid fixture and media/LICENSE.txt; YAML lists new assets only. Existing phase tracker/acceptance/compatibility/handoff/manifest updated, no duplicate planning documents.
- Source/license: https://commons.wikimedia.org/wiki/File:Media-440Hz.ogg (PD-self/public-domain), original SHA-1 0e9d650281fbd29f64b081d4a3b221f5cbed2559 verified. Existing FFmpeg generated 12-second-target MP3, probe duration 11.994195 s, mono 44100 Hz 96000 bps, 144867 bytes. Full provenance packaged. No live streaming URLs, media network permissions or dependencies added.
- One local validation PASS with simulated media events/DOM (private/validate-r3.cjs): no autoplay, explicit actions, error/recovery, manual audibility, remote navigation/Back, lifecycle pause/no auto-resume, log/timeout bounds and unchanged protected assets. Real browser rendering/audio device behavior remain untested.
- One build: tz pack-chain --proj-dir=PROJECT, exit 0. Artifact LORITVDiagnostic/Debug/LORITVDiagnostic.wgt; SHA-256 38c298b3a6c57dc946323e17918c1e9601dbd8d9526b73c642e842923d018434. Signed with unchanged active LORI_TV_Development.
- Package checks PASS: all 11 runtime/fixture/license entries equal source, config whitespace-normalized match, same app/package identity and custom icon. Author/distributor signatures and 17/18 digests valid; certs identical to R2. No certificates regenerated/exported.
- Deployment NOT ATTEMPTED. Installed TV remains R2/R1. Next proposed step, only after explicit user approval: verify hash/model/signing, one known tz install replacement targeted solely at k5qDkEn7ez.LORITVDiagnostic, then one tz run. Stop on any failure, no loops.
- Manual test sequence is in PHASE_00_COMPATIBILITY_PLAN.md. Audibility/physical R3 results remain PENDING; do not infer sound from time or events. Do not commit/push until user approval.

## Session — 2026-10-26 — R4 video/AVPlay prepared
- User evidence: R3 physically tested and works, no detailed subtest breakdown supplied. Do not infer every R3 test or TV-speaker-specific confirmation; A01..A06 remain PENDING. Prior R3 deployment succeeded (install/run exit 0; PID 8112).
- Entry Git main baseline f817880965423b17039fd75a59b5423b53a0d6c6; six pre-existing tracked modifications, diagnostic and branding folders untracked. Preserved all unrelated changes; nothing staged/reset/committed/pushed.
- R3 rollback: private/phase00-r4-before/Debug/LORITVDiagnostic.wgt, SHA-256 38c298b3a6c57dc946323e17918c1e9601dbd8d9526b73c642e842923d018434, verified before editing. Source/config/icon/audio backups retained privately.
- New source: video-entry.js/video.html/video.js/css/video.css. Entry index labels Tile 8 Video R4 and includes its entry listener; existing Audio R3/Tile 9 preserved. YAML lists assets; no signing/profile changes. Existing license file extended for generated fixtures and video-fixture.json.
- Video fixture: generated FFmpeg moving test pattern, CC0 dedication, with existing PD audio encoded AAC-LC. H264 Constrained Baseline L3.0 640x360 24fps yuv420p + AAC-LC 44100Hz mono, 12s. MP4 hash c32fcd38d73e657a11c7192b3964633e8fe6ce1e1fc09aa00e176550544eaa75. Local HLS VOD has four relative MPEG-TS 3s segments, version 6/ENDLIST/no encryption. All files codec/hash/access-documented; local decode validates both. No external stream, server, auth or dependency installation.
- AVPlay: built-in $WEBAPIS library, absolute local pathname resolution only, one active engine, state-guarded async preparation/seeking with queued Stop/Back and stale-callback token guards. No synchronous prepare, invalid-order calls or hidden automatic play/retry. Missing API, failed local path, timeout and codec errors stay visible. No AVPlay privilege or network permission added.
- Local simulated DOM/media/AV validation PASS including concurrency/state/cleanup, controls, separate HLS, fullscreen/Back, intentional error/recovery, manual-only AV evidence and all R1/R2/R3 protected hashes. Actual native decoders/display plane remain untested. Private test helper validate-r4.cjs; not staged.
- One pack-chain build exit 0; new WGT SHA-256 f981155f45f203476c5cba5ecb90911cce77c79e63f64de575e71eee2e21e0a8, 1782994 bytes. All 23 app/media/license entries byte-match, protected entries including config match R3. Author/distributor signatures and 29/30 reference digests valid, existing certificates/time validity match; active LORI_TV_Development unchanged.
- Existing docs updated and manifest refreshed; no duplicate plan document. TV remains on verified R3; no R4 install/uninstall/run.
- Pending: explicit deployment approval; then physical MP4, native HTML5 HLS, AVPlay MP4/HLS, remote seek/fullscreen/Back, error/recovery, visible picture and audible TV-speaker results. Local HLS rejection is not proof network HLS is unsupported. No HTTP fixture/server work without separate approval.


## Phase 00 R5 — 2026-10-26 — BLOCKED at package verification
- User physical evidence: HTML5 video PASS; AVPlay playback FAIL. Exact AVPlay runtime error/stage still pending. No blanket audio/video subtest acceptance inferred.
- Approved AV-only instrumentation added to video.js, video.html and css/video.css. HTML5 branches/event handlers, AV source resolver/lifecycle, media, identity, signing configuration and icon preserved. Persistent redacted stage/error panel; both detailed callback arguments; runtime API/scheme/source observations; bounded existing 24-event log. No source-path correction.
- One local validation pass (node private/validate-r5.cjs): PASS for existing mock regressions, stage/error persistence through cleanup, two-argument callback, redaction, absent API and unsupported scheme. Mocks do not establish native TV results.
- One build: tz pack-chain --proj-dir=C:/Users/Public/tv/LORITVDiagnostic; exit 0. Build selected existing LORI_TV_Development author/distributor certificates. WGT SHA-256 b1d4185f92d72970b693be4729ecaa52c1c58683e844c983f2413b42b1cdd821.
- Package verification STOPPED: checker rejected SDK directory entry .tizen-rds/ as Unexpected packaged entry. Checker did not distinguish directory entries from files. No conclusion of package corruption; content/signature verification incomplete. No retry, install or launch. Existing TV R4 untouched.
- R4 rollback preserved in ignored private/phase00-r5-before/LORITVDiagnostic.wgt; SHA-256 f981155f45f203476c5cba5ecb90911cce77c79e63f64de575e71eee2e21e0a8. Private validation/build helpers and records remain ignored.
- Git main baseline f817880965423b17039fd75a59b5423b53a0d6c6; earlier modifications preserved; nothing staged, committed or pushed. Phase 01 not started.
- Next requires approval: correct the verification helper to skip directory entries, complete source/protected-content and cryptographic signature verification on the existing WGT, then perform the single authorized deployment only if checks pass. No rebuild needed merely for this checker error.


## Phase 00 R5 verification follow-up — 2026-10-26 — BLOCKED, not deployed
- User authorized correction of checker and verification of existing package, no rebuild. Added ignored private/verify-r5-package.ps1: explicit directory handling; strict required-file inventory from YAML plus config/signatures; unsafe/encoded/duplicate path rejection; missing-file and byte-mismatch checks retained. No application source changes.
- One verification attempt: expected package SHA-256 b1d4185f92d72970b693be4729ecaa52c1c58683e844c983f2413b42b1cdd821 PASS; then STOP, exit 1: Unexpected packaged FILE: .tizen-rds/baseline-manifest.json. Archive also contains build-manifest.json, changelist.json and deploy-state.json under .tizen-rds; these SDK metadata files contain machine-specific paths. Directory acceptance must not imply acceptance of its files. No sensitive values printed.
- Mandatory content/privacy gate failed; source comparison and cryptographic signing verification not reached. Prior build profile report is not substituted for completed signature verification. No install, launch, rebuild, retry, certificate/source/media changes, commit or push. R4 rollback remains preserved at private/phase00-r5-before/LORITVDiagnostic.wgt.
- Existing R5 WGT cannot satisfy strict no-unintended-local-files policy unchanged. A separately approved SDK exclusion correction and new signed build would be needed; do not edit the signed ZIP or silently permit deployment metadata. Physical R5 panel and AVPlay tests remain unverified.


## Phase 00 R5 packaging exclusion — 2026-10-26 — BLOCKED at configuration comparison
- Installed SDK templates/config/tizen_web_project.yaml documents excludes as matched-pattern exclusion; extension server DEFAULT_INPUT_IGNORE_PATTERNS identifies .tizen-rds/** as RDS state. Project excludes omitted RDS state, so generated JSON with local paths entered the WGT. Git ignore does not control WGT packaging.
- Minimal project change: tizen_web_project.yaml excludes adds .tizen-rds and .tizen-rds/*. No playback/source-path/media/identity/API/signing changes. Ignored checker now takes explicit expected hash and rejects .tizen-rds directories as well as unexpected files; remaining strict checks retained.
- One local validation PASS: exact two-entry YAML delta, protected files unchanged before build, R4 rollback hash intact. Old R5 artifact preserved privately.
- One build: tz pack-chain --proj-dir=C:/Users/Public/tv/LORITVDiagnostic; exit 0; existing LORI_TV_Development selected. WGT SHA-256 243d24346b4370cd51381c8af40f89f7dc8d76d80ff36e45cb5fce0a0a5836bd.
- Verification: hash PASS; full archive inventory/path scan passed (no .tizen-rds or unexpected metadata); required-file/source comparison STOPPED with Source/package mismatch: config.xml. Cryptographic signing verification not reached. XML serialization is a hypothesis only; no normalization, retry or additional build attempted.
- Deployment NOT ATTEMPTED. R5 panel not physically confirmed; TV remains prior R4. No install/run, certificate changes, commit/push or Phase 01. Need separately approved read-only config difference diagnosis before proceeding.


## Phase 00 R5 final verification attempt — 2026-10-26 — BLOCKED at verifier parsing
- Approved narrow config-only trailing XML whitespace correction attempted in ignored private/verify-r5-package.ps1; no application/source/media/package changes or rebuild.
- Execution STOPPED before package validation: PowerShell ParserError line 49, Missing closing parenthesis in method call. The agent introduced a quoting/substitution error while generating checker text. No repair/retry was attempted under user stop-on-failure rule. Checker must be repaired and syntax-validated under new approval before reuse.
- Java signature verifier did not run. No SDB mutation, installation or launch occurred. R5 hash remains 243d24346b4370cd51381c8af40f89f7dc8d76d80ff36e45cb5fce0a0a5836bd. Physical panel/AVPlay tests remain pending. No certificate, identity, commit/push or Phase 01 change.


## R5 final verification — 2026-10-26 — verified package; device gate blocked
- Ignored package checker repaired and PowerShell parser validation PASS. Config securely XML-parsed with DTD/external resolution disabled; only terminal XML whitespace allowed; remaining file comparisons byte-exact; strict inventory/path/duplicate checks retained.
- Existing R5 SHA256 243d24346b4370cd51381c8af40f89f7dc8d76d80ff36e45cb5fce0a0a5836bd PASS; all 26 packaged files accounted for; required application assets/source match; no RDS or unexpected/private files. No rebuild or application code changes.
- Existing Java VerifyWgt PASS: author signature plus 25 reference digests; distributor signature plus 26 reference digests; preserved R4 certificate continuity and certificate time validity. This is not a general PKI trust-chain audit.
- Device gate STOPPED: Target device confirmation failed; SDB devices output did not satisfy exact expected serial/device/model check. No retry/install/launch. Do not infer connection root cause from this alone.
- R4 rollback current SHA256 f981155f45f203476c5cba5ecb90911cce77c79e63f64de575e71eee2e21e0a8. Physical R5 panel and AVPlay MP4/HLS remain pending. No commit/push or Phase 01.


## Phase 00 R6 — 2026-10-26 — deployed, physical MP4 result PENDING
- User R5 physical evidence: API exists; both local MP4/HLS prepareAsync fail InvalidValuesError code 26 PLAYER_ERROR_INVALID_URI.
- Approved change only video.js valid AVPlay MP4 branch: filesystem.pathExists/isFile on wgt-package/media/video-test.mp4; filesystem.toURI returned value forwarded unchanged to av.open; no URI prefix/decode/strip or fallback. config.xml adds only filesystem.read privilege required for file existence/type checks. R5 panel/stages preserved, source description identifies R6; HTML5 and AVPlay HLS resolver unchanged.
- One local mock validation PASS: R4/R5 regressions plus unchanged platform URI forwarding, missing file and security exceptions stop before open without fallback. Native media behavior still PENDING.
- One tz pack-chain --proj-dir=C:/Users/Public/tv/LORITVDiagnostic build exit 0; SHA256 78c001846eeb8c42934503b0803d85ade004dc604a0829fd5fd31ce372c3e875. Strict package inventory/path/source/privacy checks PASS (26 files); config differs only permitted final whitespace. Java author/distributor signatures and 25/26 reference digests PASS; certificate continuity/time validity PASS, not a general PKI trust-chain audit.
- R5 rollback private/phase00-r6-before/Debug/LORITVDiagnostic.wgt hash 243d24346b4370cd51381c8af40f89f7dc8d76d80ff36e45cb5fce0a0a5836bd; R4 rollback private/phase00-r5-before/LORITVDiagnostic.wgt hash f981155f45f203476c5cba5ecb90911cce77c79e63f64de575e71eee2e21e0a8, both checked intact.
- SDB exact target UE50M70HAUXXH device confirmed; one tz install replacement targeted only k5qDkEn7ez.LORITVDiagnostic exit 0; one tz run exit 0 PID14532 debug0. No reconnect/retry, HTTPS or source-format fallback.
- Next: user opens Video, selects AVPlay MP4 load once, photographs source/stage/error panel; if READY press Play and report visible moving picture/audible sound separately. Do not infer physical success from command results. No HLS change or Phase 01. No commit/push. Existing uncommitted work preserved.


## Phase 00B R7 — 2026-10-26 — deployed; physical local HLS PENDING
- R6 accepted physical results closed: MP4 picture/audio, pause/resume, seek, fullscreen/Back, stop/reload and R1 navigation PASS per user. Not repeated.
- Only runtime delta: video.js valid AVPlay HLS branch checks packaged playlist + segment-00.ts through segment-03.ts via pathExists/isFile; toURI(wgt-package/media/hls/playlist.m3u8) returned unchanged to av.open. No fallback/network. Exact inverse insertion check confirms all other JS unchanged; MP4, HTML5, lifecycle, panel, fixtures/config/privileges preserved.
- One focused local mock validation PASS: five file checks, exact URI forwarding, no autoplay, explicit play, missing playlist/segments and empty URI stop without fallback. Native local HLS remains unverified.
- One tz pack-chain --proj-dir=C:/Users/Public/tv/LORITVDiagnostic build exit 0; WGT SHA256 eabfadde769f5a40759fd49909a5673f4f925ae0cdd66fc3f7e5b45b069b88fa. Strict package source/config/inventory/path/privacy checks PASS (26 files). Author/distributor cryptographic signatures and all 25/26 reference digests PASS; R4 certificate continuity/time validity PASS (not general PKI chain audit).
- R6 rollback private/phase00-r7-before/Debug/LORITVDiagnostic.wgt hash 78c001846eeb8c42934503b0803d85ade004dc604a0829fd5fd31ce372c3e875 and R4 private/phase00-r5-before/LORITVDiagnostic.wgt hash f981155f45f203476c5cba5ecb90911cce77c79e63f64de575e71eee2e21e0a8 both checked intact.
- Correct UE50M70HAUXXH device confirmed; one targeted tz install replacement exit0; one tz run exit0 PID19699 debug0. No retries, commit/push or Phase01.
- User next: Video > AVPlay HLS load once; photograph R7 source/stage panel on READY/FAIL; if READY press Play and confirm moving pattern/audio. Stop on failure; no alternate source. This establishes local HLS only, not HTTP network reliability.


## Phase 00B R8 — 2026-10-26 — BLOCKED at packaged config gate, not deployed
- R7 user photo: local HLS filesystem URI/source checks passed but prepareAsync timed out then TypeMismatchError PLAYER_ERROR_NOT_SUPPORTED_FORMAT; no network conclusion.
- Approved fixed Apple gear1 HTTPS test implemented as separate av-https-hls action/observation in video.js/video.html. Exact URL unchanged; explicit Play and existing single-player lifecycle retained. MP4/local HLS branches unchanged; remote grid extended for seventeenth action; network-specific metadata/source description. No external media packaged.
- config.xml adds internet privilege, exact Apple host access subdomains=false, CSP media-src self/file/exact HTTPS host and connect-src self/exact host. No wildcard origin, HTTP fallback or TLS bypass. Installed Tizen10 SDK XSD validation PASS; explicit CSP directive checks PASS. One focused mock pass PASS for fixed URL, explicit play, buffering/time/errors, no fallback, cleanup and remote action reachability.
- One tz pack-chain --proj-dir=C:/Users/Public/tv/LORITVDiagnostic build exit0, existing LORI_TV_Development. WGT SHA256 526030eeb6c890682af3f84538ab7f321f57ca47b01e68e5c4bca79c9e00ea11.
- Strict package verification STOPPED: Configuration differs beyond trailing document whitespace. No normalization/retry; cryptographic signing verification, device check, installation and launch NOT REACHED. Need approved read-only source/package config diff; do not infer semantic equivalence.
- R7 preserved privately at private/phase00-r8-before/Debug/LORITVDiagnostic.wgt; R6 at private/phase00-r7-before/Debug/LORITVDiagnostic.wgt. No source/certificate/identity fallback, commit/push or Phase01. Physical R8 remains pending.


## R8 final verification — 2026-10-27 — package verified; device gate blocked
- Approved config comparison-only correction: secure parsing plus installed SDK XSD validation; exactly one identical root access/CSP each may relocate; all remaining XML/declaration/order/internal text strict apart from final document whitespace. Other asset byte/path/inventory checks unchanged. No app/source changes or rebuild.
- Existing R8 hash 526030eeb6c890682af3f84538ab7f321f57ca47b01e68e5c4bca79c9e00ea11 PASS; 26-file content/inventory/config/privacy checks PASS; SDK schema PASS. Existing Java helper author/distributor signatures and all 25/26 reference digests PASS, certificate continuity/time validity PASS; not general PKI trust-chain audit.
- R6/R7 rollback hashes checked intact. SDB devices returned empty list; mandatory target identity/status check FAILED. No retry/reconnect/install/run. HTTPS action included in verified package, runtime access and physical playback not confirmed.
- No commit/push or Phase01. Next requires restored/confirmed TV connection and approved single deployment of existing verified WGT; no rebuild needed.


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

### Proposed Phase 00 checkpoint allowlist (not staged)
Branch main; existing HEAD f817880965423b17039fd75a59b5423b53a0d6c6. Include exactly these 35 files (6 modified tracked + 29 untracked):
- .gitignore
- PACKAGE_MANIFEST.json
- docs/ACCEPTANCE_TESTS.md
- docs/HANDOFF.md
- docs/PHASE_00_COMPATIBILITY_PLAN.md
- docs/PHASE_TRACKER.md
- LORITVDiagnostic/.project
- LORITVDiagnostic/.tproject
- LORITVDiagnostic/audio-entry.js
- LORITVDiagnostic/audio.html
- LORITVDiagnostic/audio.js
- LORITVDiagnostic/config.xml
- LORITVDiagnostic/css/audio.css
- LORITVDiagnostic/css/style.css
- LORITVDiagnostic/css/video.css
- LORITVDiagnostic/icon.png
- LORITVDiagnostic/index.html
- LORITVDiagnostic/main.js
- LORITVDiagnostic/media/LICENSE.txt
- LORITVDiagnostic/media/audio-test.mp3
- LORITVDiagnostic/media/hls/playlist.m3u8
- LORITVDiagnostic/media/hls/segment-00.ts
- LORITVDiagnostic/media/hls/segment-01.ts
- LORITVDiagnostic/media/hls/segment-02.ts
- LORITVDiagnostic/media/hls/segment-03.ts
- LORITVDiagnostic/media/invalid-audio.mp3
- LORITVDiagnostic/media/invalid-video.mp4
- LORITVDiagnostic/media/video-fixture.json
- LORITVDiagnostic/media/video-test.mp4
- LORITVDiagnostic/tizen_web_project.yaml
- LORITVDiagnostic/video-entry.js
- LORITVDiagnostic/video.html
- LORITVDiagnostic/video.js
- assets/branding/lori-tv-icon-1024.png
- assets/branding/lori-tv-icon-512.png

The .project and .tproject descriptors were inspected: portable project name/builders and tv-samsung-10.0 target, no machine paths or credentials. Keep them as project configuration. Invalid media fixtures are intentional negative-test inputs, not accidental broken assets. Brand masters are the approved R2 source assets. No unrelated nonignored changes identified in this bounded review.

Exclude and preserve locally: private/ (all rollback WGTs, helper scripts/classes, build/deployment records and signing verification tools); LORITVDiagnostic/Debug/ and any Release/Build/Test output; .tizen-rds/, .sign/, .settings/, .buildResult/; *.wgt/*.wgt.sig; .vscode/, *.code-workspace (including workspace-20261026-013732.code-workspace); certificates/keys/profiles.xml/environment/secrets. Existing .gitignore covers these. No private/build/RDS paths are tracked. Signing material remains outside repository. A bounded candidate-text secret/path/token scan found no findings; this is not a forensic guarantee. Reviewed documentation has historical public app identity and private-network address mentions: do not export device addresses/DUIDs or raw private logs as new evidence.

Proposed commit: docs: record Phase 00 acceptance and diagnostic checkpoint
No automatic commit/push. At approval, stage the explicit allowlist only, inspect staged diff/secrets and validate manifest; do not use git add . indiscriminately. WGTs remain local; hashes and provenance provide traceability.

Phase 01 starting point: prompts/02_PHASE_01_UI_UX.md — UI/UX specification, not production shell implementation. Review 35 individual mockups and 2 boards; define flows/component inventory/D-pad focus maps; loading/empty/error/offline states; phone/manager flows; missing Cast/enhancement states and conditional PiP. Preserve diagnostic checkpoint as device evidence. Phase 02 owns the production Tizen shell. Obtain explicit Phase 01 approval first.


## Phase 01 handoff — 2026-10-27
- Base main / 1a2a71ff2982cd7b4a35f43e6efc13535d5e0de2; user authorized planning only. Phase00 physical MP4/HTTPS-HLS/navigation acceptance and R8 hash remain unchanged; local HLS nonblocking FAIL and error recovery deferred. No tests repeated.
- Read canonical planning/docs/prompt and visually reviewed all 35 individual PNGs + 2 boards. Temporary contact sheets under ignored private/ are review aids only, not new mockups or checkpoint candidates.
- Main deliverable: UI_UX_SPEC.md Phase01 review draft contains route graph and focus/OK/Back maps for all 18 TV references plus Favorites, editors, programme/event panels, timer/zapping/health/conditional mini-player, shared states, design-system proposals, Remote and Manager workflow inventory and P01-D01..D12 approval register.
- Mockup discrepancies surfaced, not silently resolved: Favorites placement; Live preview activation; Player sidebar/background/back behavior; Startup page must remain Home; result chips missing Sports; consent card vs pre-play approval; blank Manager content and missing Categories/login; undrawn external Cast/enhancement states.
- No ADR engine/backend/provider/security decision approved by this draft. ADR-007 remains pending library/custom evaluation in authorized Phase02; ADR-003/C03 transport/PiP gates remain open. P01-D12 must settle shell location/identity and framework candidate without overwriting diagnostic app.
- Next user review priorities: D01 Favorites filter/section versus dedicated route; D02 static preview versus explicit Preview; D03 stop-and-return player exit and controls timeout; D04 tokens/safe area/type/focus; D05 EN/SQ initial language; D12 shell/focus approach. Later PIN/next-episode/Cast/timer/retry/layout choices need approval before their implementations.
- Proposed Phase02 sequence: approve shell-blocking design -> approve isolated shell identity/location/stack -> tokens/AppFrame/Home/sidebar -> deterministic focus/history/modals -> fixture-based route skeletons -> settings/capability boundaries -> separately authorized validations/device cycle. No live providers, phone transport or complete player introduced by this planning approval.
- T01-01 is PARTIAL. Written proposal READY_FOR_REVIEW is not Phase01 COMPLETED; missing detailed visuals, user decisions and later device readability remain pending. No source PNG or application code changes, no install/build/deploy/dependencies, no commit/push.
- Files modified: docs/UI_UX_SPEC.md, docs/MOCKUP_INDEX.md, docs/ACCEPTANCE_TESTS.md, docs/PHASE_TRACKER.md, docs/HANDOFF.md, docs/ROADMAP.md, PACKAGE_MANIFEST.json. Manifest refreshed for document integrity only; scope unchanged.


## FINAL Phase01 closure handoff — 2026-10-27 (supersedes draft open primary decisions)
- User request read from attached Pasted text.txt; explicit documentation-only final UI/UX approval, not code/dependency/device/Git authorization. Base main / 1a2a71ff2982cd7b4a35f43e6efc13535d5e0de2; seven pre-existing planning edits preserved and finalized.
- Final decisions: English default, Albanian selectable, future resource-key localization; Favorites dedicated sidebar route + Home/Live collections; explicit OK selection only may preview supported Live source; premium navy/blue/rounded readable tokens; separate production shell from LORITVDiagnostic.
- FINAL Player Back: dismiss topmost keyboard/dialog/menu first; with no interactive overlay Stop/Close/release then origin/focus/scroll immediately, even fullscreen or hidden-controls. No automatic mini-player, no default background playback. Release failure stays in visible Player error with saved origin and explicit Retry/Exit, never silently navigates while audio may continue. VOD progress snapshot where supported, no Live VOD offset. Same barrier for in-app Home/sidebar route transitions.
- UI_UX_SPEC contains full screen/graph/initial/directional/OK/Back maps, removal/scroll restoration, Favorites shared state, player close transaction, concrete token table (1600x900 baseline,48 safe margin,body22/control24/title48,poster176x264,landscape320x180,3px focus ring/4px offset,140ms motion), accessibility targets and Phase02 acceptance. Token values are specification, not measured TV readability.
- Production proposal ONLY: apps/tv/, display LORI TV, widget URI urn:lori-tv:production; new distinct SDK package/app IDs to propose at Phase02 setup. React/TS/Vite candidate and centralized custom/minimal-library focus decision pending ADR-007 review. No production files, IDs, dependencies or certificates allocated now.
- Proposed sequence: production directory/identity/config -> tokens/components -> Home/sidebar -> central focus/history/modals -> fixture skeletons -> Stop/Close player interface -> settings/capability boundaries -> focused validations, separate physical-TV approval. Do not reuse diagnostic app identity or treat R8 network whitelist as a production provider policy.
- Deferred per user: optional mini-player/PiP/background playback; Manager detailed layouts/implementation Phase08; external casting Phase07B; PIN Phase05; Sleep Timer Phase06; advanced recovery/stability Phase03/06/09; unverified platform features. These do not block initial shell unless a direct dependency is demonstrated. Missing mockups remain missing, not fabricated or accepted as implemented.
- Phase01 specification work finalized; closure artifact READY_FOR_REVIEW. Final checkpoint approval needed before Git operations; Phase02 execution separately approved. T01-01 review covers37 existing PNGs; final written behavior is specified, later device/companion layout acceptance deferred honestly.
- Exact proposed checkpoint allowlist: docs/UI_UX_SPEC.md, docs/MOCKUP_INDEX.md, docs/ACCEPTANCE_TESTS.md, docs/PHASE_TRACKER.md, docs/HANDOFF.md, docs/ROADMAP.md, PACKAGE_MANIFEST.json. Proposed commit: docs: finalize Phase 01 UI UX specification and shell handoff. No staging/commit/push performed.
- No production/diagnostic/playback/UI/mockup edits or build/install/deploy/Phase00 tests. Original source-of-truth documents retained; this explicit user approval supersedes prior draft mini-player/default Back alternatives without changing future feasibility gates.
