# Architecture decisions and unresolved gates

## Decision record format
Every ADR must include Context, Options, Decision, Evidence, Risks, Date, Approver. Never silently decide an unverified TV capability.

| ADR | Decision required | Evidence before approval |
|---|---|---|
| 001 | Exact TV model, firmware, Tizen version, supported dev install | On-device settings screenshot and signed .wgt smoke test |
| 002 | AVPlay vs HTML5 for HLS/MP4, audio/subtitle APIs | On-device playable sample matrix and logs |
| 003 | LAN peer link vs authenticated outbound relay | Test phone-to-TV communication on real Samsung and iPhone/Android |
| 004 | Static versioned catalog vs hosted API/DB | Demonstrated source update, security and rollback needs |
| 005 | EPG, sports, metadata and streaming providers | Documented rights, terms, supported API, costs, geography |
| 006 | Profile/PIN storage and threat model | Verified TV storage and lock-bypass tests |
| 007 | Tizen remote focus engine | Measured D-pad navigation and Back behavior |
| 008 | Content refresh/update mechanism | Rollback, integrity and stale-cache behavior |

## Recommended boundaries
- `apps/tv`: TV-only UI and platform adapters. No admin secrets.
- `apps/remote`: phone PWA and paired command client. No direct arbitrary playback URL command.
- `apps/manager`: protected admin UI; backend only when approved.
- `packages/domain`: typed models and authorization policies.
- `packages/catalog`: safe M3U/XMLTV parsing and search index.
- `packages/player`: capability interface and player state machine.
- `packages/protocol`: schema-validated paired commands and ACKs.
- `packages/design`: shared colors/type/spacing, with platform-specific components.
- `services/api`: optional hosted relay/catalog API only after ADR approval.

## Content model constraints
`StreamSource` must carry source provenance, allowed use/rights status, expiry, format, supported region and capability requirements. Movie metadata is distinct from playability. Content provider rights must be checked before listing playable actions. Provider credentials never published to TV bundles or client JSON.

## Update design
App binary: signed Tizen package updates via documented developer/install method, subject to Samsung policies. Catalog: signed/versioned JSON, staged publish, checksum, schema version, cached last-known-good and rollback. Never promise unattended TV package updates without validating device/channel support.

## Security baseline
Secure pairing (short-lived code, TV approval, revocation, rate limiting); admin auth/RBAC; import size/time bounds; no unsafe XML entities; no SSRF; source URL validation; CSP; audit logs; profile data deletion; minimal retention; no automatic third-party rights circumvention.

## LORI Cast decisions pending Phase 00 / 07B
- ADR-C01: Verify Tizen app can receive commands from paired PWA over local transport; if not, choose authenticated relay with operating-cost implications.
- ADR-C02: Confirm AVPlay/HTML5 supported source formats and CORS/network requirements for direct URLs.
- ADR-C03: Decide whether personal phone files are feasible without persistent phone-server dependencies; defer if not.
- ADR-C04: Determine per-profile parental PIN enforcement and whether incoming cast requires on-TV confirmation.
- ADR-C05: Check built-in Samsung AirPlay availability separately; it is not LORI Cast functionality.

## v3.5 register normalization — 2026-10-26
The numbered table in this document is authoritative: 001 device/install, 002 playback, 003 transport, 004 catalog hosting, 005 providers, 006 PIN, 007 focus, 008 updates. Earlier architecture prose incorrectly used 002 for focus; corrected without changing an approved technical decision. All decisions remain pending evidence/approval.

Cast references: C01 refines 003, C02 refines 002, C03 covers selected-file transfer, C04 applies 006 to incoming-cast confirmation, C05 records built-in AirPlay separately. Required Gallery/Files/URL paths remain feasibility-gated, with BLOCKED status and explicit scope review if infeasible. External URL SSRF denial is distinct from a future narrowly authenticated local transfer capability.

Provider authentication is unresolved: never embed reusable provider credentials in public bundles/catalogs. Evaluate provider-approved short-lived playback authorization or an approved service architecture under 004/005; do not assume all IPTV sources can be supported.
