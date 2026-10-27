# Architecture decisions and unresolved gates

## Decision record format
Every ADR must include Context, Options, Decision, Evidence, Risks, Date, Approver. Never silently decide an unverified TV capability.

| ADR | Decision required | Evidence before approval |
|---|---|---|
| 001 | Exact TV model, firmware, Tizen version, supported dev install | On-device settings screenshot and signed .wgt smoke test |
| 002 | Target playback evidence and remaining format/audio/subtitle capabilities; production AVPlay selected by ADR-005 | Existing R6 MP4/R8 HTTPS HLS evidence retained; no blanket provider/DRM PASS |
| 003 | LAN peer link vs authenticated outbound relay | Test phone-to-TV communication on real Samsung and iPhone/Android |
| 004 | Free-first static publisher APPROVED as architecture policy; host recommendation conditional | Public-data rights, free budgets and actual TLS/CORS/cache tests before deployment; backend only by separate approval |
| 005 | Playable-only/provider/ad policy APPROVED; named provider integrations pending | Provider registry, rights/publication evidence, territories, source resolution and native playback evidence |
| 006 | Profile/PIN storage and threat model | Verified TV storage and lock-bypass tests |
| 007 | Tizen remote focus engine | Measured D-pad navigation and Back behavior |
| 008 | Signed versioned atomic catalog + bounded refresh/LKG/revocation APPROVED as design | Scheduling, expiry/outage, signature/schema/digest, rollback and migration acceptance still unimplemented |

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
The numbered table in this document is authoritative: 001 device/install, 002 playback, 003 transport, 004 catalog hosting, 005 providers, 006 PIN, 007 focus, 008 updates. Earlier architecture prose incorrectly used 002 for focus; corrected without changing an approved technical decision. Historical normalization status (2026-10-26) was pending evidence/approval; later records/evidence supersede that blanket status.

Cast references: C01 refines 003, C02 refines 002, C03 covers selected-file transfer, C04 applies 006 to incoming-cast confirmation, C05 records built-in AirPlay separately. Required Gallery/Files/URL paths remain feasibility-gated, with BLOCKED status and explicit scope review if infeasible. External URL SSRF denial is distinct from a future narrowly authenticated local transfer capability.

Provider authentication is unresolved: never embed reusable provider credentials in public bundles/catalogs. Evaluate provider-approved short-lived playback authorization or an approved service architecture under 004/005; do not assume all IPTV sources can be supported.

## ADR-004 — Free-first static Content Engine

- **Context:** user requires no mandatory recurring infrastructure cost, no always-on PC and no permanent application backend for the initial personal TV. Automatic catalog updates must precede a full Manager.
- **Options:** scheduled hosted publisher with GitHub Pages; same publisher with Cloudflare Pages; always-on paid API/database (rejected as mandatory MVP).
- **Decision:** approve static/free-first architectural policy only. Recommend GitHub Actions + Pages conditionally; Cloudflare Pages is the evaluated alternative for configurable headers. Actual host/account/workflow deployment remains unapproved. Publisher duties, limits, security and comparison are canonical in [ARCHITECTURE.md section 13](ARCHITECTURE.md#13-free-first-content-engine-contract--2026-10-28); no duplicate infrastructure service required. Move foundation to Phase03A; Phase08 Manager remains optional/full administration.
- **Evidence:** user Final Content Engine Architecture Decisions (FREE-FIRST); official GitHub/Cloudflare sources linked in section 13, checked 2026-10-28. This is document research, not an operating service or TV endpoint test.
- **Risks:** public exposure, data-republication restrictions, quotas/free-plan changes, missed or disabled schedules, CDN freshness. Block deployment if public-data rights or acceptance targets cannot be met.
- **Date / approver:** 2026-10-28 / user approved product/free-first constraint and documentation-only evaluation. Specific host selection/deployment approval still required.
- **Status:** architecture policy APPROVED; coherent documentation READY_FOR_REVIEW; no implementation.

## ADR-005 — Playable-only eligibility, provenance and advertisements

- **Context:** metadata APIs are not streaming providers; user wants automatic playable catalog with international categorization and no mandatory playlist/URL entry.
- **Options:** metadata-heavy discovery (not eligible as main watchable catalog); approved/resolvable sources joined to metadata (selected); unrestricted URL aggregation/scraping (rejected).
- **Decision:** main catalog/search/Home includes only source-eligible records; internal metadata and unavailable saved references remain distinct. Registry approval covers API/media/CDN/artwork origins, rights evidence, publication permission, territories, auth/DRM, ads, quota and expiry. Unknown providers/domains and untrusted alternatives are denied. No reusable secrets in TV or public catalogs; secret/token/entitlement-dependent providers wait for optional approved backend. No LORI-injected advertisements, pop-ups, ad-page redirects, embedded ad players or unapproved tracking; original provider ads are allowed and preserved. No universal premium/free/geo/DRM promises. Section 13 defines eligibility and per-source UNKNOWN versus native profile/device evidence.
- **Playback boundary:** production Samsung AVPlay; HTTPS HLS/MP4 target evidence is the existing Phase00 baseline, not blanket compatibility. Phase01.5 direct immersive/OK/Back contract stays authoritative. This policy supersedes the older automatic choice of HTML5 in production; HTML5 diagnostic evidence is preserved without code changes. Further native formats/DRM remain separate tests/approval.
- **Evidence:** user explicitly approved these product rules on 2026-10-28; existing R6 MP4/R8 HTTPS HLS acceptance recorded in HANDOFF.md. No new provider has passed rights/availability/Samsung validation in this checkpoint.
- **Risks:** territory unknown, rich-catalog expectations versus limited permitted sources, changing rights/ads, unavailable media after listing. Retain eligibility timestamps and clear failure/removal behavior; no HTTP-200-as-DEVICE-PASS.
- **Date / approver:** 2026-10-28 / user for policy, not named providers.
- **Status:** policy APPROVED; per-provider integrations PENDING; documentation READY_FOR_REVIEW.

## ADR-008 — Scheduled refresh, atomic snapshots and safe expiry

- **Context:** no manual playlist and no backend require bounded scheduled publication, safe TV caching, revocation/expiry and host-independent contracts.
- **Options:** generated catalog commits per refresh (rejected); complete static artifacts with immutable revisions and signed control (selected); dynamic authenticated API (optional later).
- **Decision:** build/validate/sign a bounded snapshot, deploy artifact without generated Git commits, verify remotely, activate only complete hash/schema/signature-valid revision. TV retains last-known-good and highest policy sequence/tombstones. Rollback publishes new policy sequence and never revives revoked/expired rights. CI secrets hold independent catalog signing keys; TV holds public trust keys; existing Tizen signing material unchanged. Section 13 owns six-hour publisher/15-minute TV polling, <=24-hour validity, <=30-minute online revocation target after successful publish, EPG/metadata cadence and budget defaults. These are acceptance targets, not proven host/device capabilities. Quota or scheduler failure stops publishing, never triggers automatic spending or indefinite playback from stale cache.
- **Migration:** stable normalized contracts, IDs and trust policy allow future host/backend behind existing interfaces; new origins/security/costs require approval. Paid services, authentication or token generation are not implicit fallbacks. Binary updates remain signed/manual-channel gated, distinct from catalog updates.
- **Evidence:** user free-first/update requirements; host/scheduler sources in section 13; no generated artifacts, workflow, signing key or account created.
- **Risks:** offline revocation cannot be immediate; scheduler/CDN delay, stale clocks, partial uploads and compromise. Fail closed at validity expiry, enforce tombstones during rollback and test invalid-clock/outage paths.
- **Date / approver:** 2026-10-28 / user for free-first/update requirements and documentation scope; parameter/hosting/native implementation acceptance pending.
- **Status:** design APPROVED for documentation checkpoint review; all runtime verification PENDING.
