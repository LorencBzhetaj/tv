# LORI TV production frame — Phase 02 M3 review

Vanilla strict TypeScript, pinned esbuild, no runtime dependencies. M2 frame/design/localization is preserved. M3 adds explicit local input/focus/history foundations, with accepted Samsung physical navigation evidence described below; it does not implement a catalog, content router or player.

From `C:\Users\Public\tv`:

```powershell
npm --prefix apps/tv run typecheck
npm --prefix apps/tv run build
npm --prefix apps/tv test
npm --prefix apps/tv run verify:stage
npm --prefix apps/tv run preview
```

Open **http://127.0.0.1:4174**. The server binds only to loopback, serves exactly the five runtime files and refuses private/build/configuration files. Stop with Ctrl+C. The existing Phase01.5 preview uses port4173 and is unchanged. No media loads, API calls, TV connection or signing occurs in these commands.

## Visual review

- New preferences default to English, Full View, Home. Menu opens a modal navigation overlay; Escape/Backspace/Close restores its invoker and content scroll. Background controls are inert. Standard View keeps navigation visible.
- Display settings opens the local Display & language section; it is not a Settings route. View mode and Language controls persist validated values in `lori-tv.preferences.v1` localStorage. EN/SQ label changes retain nodes/focus/scroll. Corrupt preferences reset safely; unavailable storage gives session-only operation and a localized save warning.
- One input owner handles arrows/Enter, Escape or non-editing Backspace, Menu/ContextMenu and Tab in modals. The explicit graph replaces the temporary adapter (old file preserved but not imported). OK on View/Language opens a localized option dialog: arrows choose, OK commits, Back/Cancel restores the invoker. Tab wraps inside dialogs; native change-event compatibility remains. F toggles outside inputs/selects/dialogs. Root Back opens a Cancel-first exit dialog; repeat/rapid Back is guarded. Exit only calls the isolated platform hook after explicit confirmation; in a PC browser it reports unavailable and stays cancelable. F11 remains browser-owned; no media fullscreen exists.
- Home stays selected. Settings only focuses the local preferences section. Other navigation destinations and header Search/Profiles are disabled with an adjacent localized explanation. No catalog/Favorites/profile logic is implied.
- Test Full and Standard views, EN and SQ, reload persistence and a resized viewport. Reference tokens are 1600×900, not a fixed canvas. Typography scales with actual viewport; narrow PC windows reflow, scrollable regions retain safe focus space, system reduced-motion is respected. Physical overscan/readability is unvalidated.

## Packaging and M1 regression artifacts

M3 was signed, package-verified, installed and launched on Samsung UE50M70HAUXXH running Tizen TV 10.0. The accepted package is ignored `Build/package/Debug/package.wgt`, SHA-256 `033d277b734293e483dc6d53b3b8f9faa7bf463503e7f083ebd6aa7576731e4d`. Production application ID remains `O12p0Tvvrb.LORITVProduction`, package ID `O12p0Tvvrb`. Author and distributor RSA-SHA512 cryptographic signatures, all 6 author and 7 distributor reference digests, certificate continuity and validity dates passed verification. Full PKI-chain trust and revocation validation were not performed.

`verify:stage` validates current unsigned runtime bytes, relative paths, inventory, identity and installed SDK schema. `verify:package` must never be used to claim an old M1 WGT contains current M2/M3 source.

Before rebuilding the original M1 staging, the accepted WGT was preserved at ignored `Build/m1-reference/package.wgt`, SHA-256 `8382afd1b3266330ee6fbe45723fea574e71dc5600a521075abe78d18f63b2ee`. The eighth regression test uses that fixture and the hash-established local R8 certificate baseline via the existing SDK Java. Tests use only disposable ZIP copies beside the fixture; no private certificates are read. A fresh clone needs these approved local artifacts provisioned, or an explicit `LORI_TEST_WGT` test-fixture path and existing signing-reference configuration. WGTs, SDK files and private material are not committed.

`build` clears only generated `Build/package/` staging; retain any separately approved signed rollback package outside it and preserve the accepted M3 WGT before running that command. No new signing/build/install cycle is implied by this README. Application identity, icon, privileges and signing configuration are unchanged from M1. M3 is accepted for the confirmed physical scope below; M4–M6 implementation and Content Engine remain unimplemented.


## M3 validation and device boundary

The existing commands run46 tests, including22 unchanged Java XMLDSig assertions and3 separate1000-action input/focus/history tests. The SDK Java and preserved ignored M1/R8 artifacts remain prerequisites for security regression. No WGT signing occurs.

Optional Tizen key registration is off: no requests or tv.inputdevice privilege. Mandatory arrows/OK/Return have numeric normalization; Menu always has an on-screen path. Delivered named media/color keys are normalized but have no consumer and retain defaults. Home/volume/power stay OS-owned.100ms directional-repeat throttle and450ms Back guard require physical calibration. Long-Return is a system-forced exit, not blockable by this app.

Graph/history tests cover nested scopes/screens using synthetic unit fixtures; no real content screens are added. Current frame starts at Home with Display settings focused. Header Down/Standard sidebar Right restore remembered content. Focus removal/hiding uses explicit fallback/reconciliation. Root history bounded32, modal depth8; dispose hooks remove ownership/listeners. No automatic media session, background player or mini-player.

User-confirmed physical PASS on Samsung UE50M70HAUXXH / Tizen TV 10.0: D-pad directional navigation; OK/Enter activation; Back/Return with focus restoration; Menu overlay navigation; Full View/Standard View; English/Albanian switching; language persistence after reopening; modal focus trapping; focus and scroll restoration; Samsung Home -> return to LORI TV. These accepted results do not certify all keys, timing or future screens.

Physical tests still PENDING: repeated/held-key calibration; Cancel-first root exit behavior; deliberate Exit/relaunch and the confirmed Exit API path; optional hardware keys; soak testing; quantified overscan/readability. Existing automated/browser results for these behaviors are not physical PASS. See the accepted M3 records in `../../docs/HANDOFF.md` and `../../docs/ACCEPTANCE_TESTS.md` for historical evidence and remaining limits.
