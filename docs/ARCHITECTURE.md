# LORI TV — System Architecture v3.5

## 1. Architectural goals
TV-first UX, remote-only navigation, direct internet playback without an always-on PC, modular source adapters, local-first state, privacy-preserving family profiles, optional remote control and catalog management, secure updates. Keep first release simple and avoid mandatory backend unless required by validated pairing/sync needs.

## 2. Context diagram
```mermaid
flowchart TD
  Phone[LORI Remote PWA] <-->|Authenticated commands / pairing| Link[Local transport OR hosted relay]
  Link <--> TV[LORI TV Tizen app]
  Admin[LORI Manager web] -->|Authenticated catalog changes| Catalog[Catalog API / published JSON]
  Catalog --> TV
  TV <--> Local[(IndexedDB: cache, profiles, progress)]
  Publisher[Scheduled approved ingestion] --> Catalog
  TV --> Player[Production AVPlay controller]
  Player --> Sources[Authorized stream providers]
  Publisher --> Metadata[Authorized metadata / EPG / sports APIs]
```

## 3. Main components
### TV client
- App shell: routing, Home default, focus graph, key handling, lifecycle, accessibility.
- Screens: Home, Live TV, Guide, Sports, Movies, Series, Search, Media Details, Player, Favorites, Watchlist, Profiles, Settings, Pair Phone.
- Catalog repository: typed unified models, category indexes, full-text search, cache versioning.
- Player adapter: Samsung AVPlay for production, capability/stream error state machine and supported tracks; no automatic HTML5 fallback. Existing HTML5 diagnostics are preserved as evidence, not changed by this decision.
- Progress repository: per-profile VOD resume, recent channel shortcut, favorites/watchlist, schema migrations.
- Parental policy: content classification, PIN verification, locked profile changes, authorization checks before playback.
- Pairing client: one-time code/QR, user approval, session expiration, revocation and rate limiting.

### Remote PWA
- Pairing UI, D-pad, Back/Home, playback actions, search keyboard, speech-to-text when supported, Send to TV from indexed catalog.
- No permission to execute arbitrary TV commands. Scoped commands: NAV_UP/DOWN/LEFT/RIGHT, SELECT, BACK, HOME, PLAY, PAUSE, SEEK, SEARCH_TEXT, OPEN_CATALOG_ITEM.
- Protocol uses device/session IDs, nonce, timestamps, auth token, validation, rate limits and acknowledgements.

### Manager
- Authenticated admin; M3U parser with bounded sizes/timeouts; XMLTV parser with safe XML settings; channel-to-EPG mapping; metadata providers; source health diagnostics; revisioned publish and rollback; audit log.
- Catalog distribution can begin with signed/versioned static JSON. Manager/backend is introduced only when justified by editing/sync requirements.

## 4. Domain model
`Channel(id, name, logo, language, country, categoryIds, epgId, sourceIds)`
`StreamSource(id, channelId/mediaId, url, format, headersPolicy, rightsStatus, healthStatus)`
`EPGProgram(id, channelId, startsAtUTC, endsAtUTC, title, description)`
`MediaItem(id, type, title, synopsis, artwork, genres, year, maturityRating, playableSourceIds, trailerRefs)`
`Season(id, seriesId, number)`; `Episode(id, seasonId, number, mediaId)`
`Profile(id, displayName, avatar, isKids, maturityLimit, pinHashRef)`
`WatchProgress(profileId, mediaId, positionMs, durationMs, updatedAt)`
`WatchlistEntry(profileId, mediaId)`; `Favorite(profileId, targetType, targetId)`
`PairingSession(id, tvDeviceId, expiresAt, approvedAt, revokedAt, permissionScope)`
`SourceImport(id, kind, status, diagnostics, createdAt)`; `CatalogRevision(id, checksum, publishedAt)`

## 5. Search
Use one shared search service with scope `ALL|CHANNELS|SPORTS|MOVIES|SERIES`; normalize title and aliases, index relevant metadata, debounce UI input, return ranked matches and distinct availability status. TV remote text input and phone keyboard share the same API. Search is not a pirated-content discovery engine.

## 6. EPG
Ingest authorized XMLTV; normalize to UTC; map XMLTV IDs to channel IDs; show localized schedule; expire stale entries; handle overlaps, missing programs, timezone/DST and invalid XML gracefully.

## 7. Playback
Capability-driven Samsung AVPlay production adapter; supported HTTPS HLS/MP4 first. No implicit HTML5 fallback. States: idle -> preparing -> buffering -> playing/paused -> ended/error. Cancel previous playback on channel switch. Quality and audio/subtitle menus list only supported available tracks. Never bypass DRM/geoblocking. Explicit Play/Watch enters immersive presentation; preparation may show a bounded loading/error overlay, never claim playback before native success. OK shows transport; Back hides visible immersive transport, otherwise Stop/Close + origin/focus/scroll. Topmost dialog closes first; Normal Player Back stops/closes. No automatic mini-player/background playback. See UI_UX_SPEC.md final Phase 01.5 contract.

## 8. Pairing and connectivity
Decision gate in phase 00. Prefer authenticated LAN path only if verified on TV. If unavailable, relay over outbound secure WebSockets from TV and phone. Pairing: TV generates expiring one-time token, displays QR; phone requests pairing; TV explicitly approves; scoped session credentials; ability to revoke; prevent replay and brute force. Phone-to-TV controls only while app is open/connected. No guarantee of TV power or OS-level control.

## 9. Security and privacy
- Reject unsafe protocols and private network URLs in server-side URL fetching; prevent SSRF; strict allowlists where possible.
- No raw credentials in published catalogs, source code, browser localStorage or logs.
- Content sources require explicit rights/status and provider terms compliance.
- Admin RBAC, audit trail, input validation, import size limits, safe XML parsing, CSP, dependency scans.
- Profile PIN hashing with suitable KDF when stored server-side; on-device secret storage constraints to be evaluated; do not treat client-only PIN as strong DRM.
- Data minimization: store only needed watch history; support clearing per-profile data.

## 10. Proposed monorepo (not yet created)
```text
lori-tv/
  CLAUDE.md
  docs/{MASTER_PROMPT,ARCHITECTURE,ROADMAP,ACCEPTANCE_TESTS,UI_UX_SPEC}.md
  apps/tv/                  # Tizen React/TS app
  apps/remote/              # PWA
  apps/manager/             # authenticated web UI
  packages/core/            # domain models and contracts
  packages/catalog/         # M3U, XMLTV, search
  packages/ui-tokens/       # shared design tokens
  services/api/             # only if phase-00/manager needs it
  tests/
  scripts/
```

## 11. ADRs to decide, not assume
ADR-001: exact Samsung model, firmware, platform and developer installation.
ADR-002: Samsung playback evidence, formats/tracks and future capabilities; production AVPlay policy is approved in ADR-005, not a new blanket native compatibility PASS.
ADR-003: phone LAN transport vs relay.
ADR-004: static catalog publication vs API/DB.
ADR-005: approved metadata, EPG, sports and legal streaming providers.
ADR-006: on-device PIN threat model and persistence.
ADR-007: TV focus navigation library vs custom.
ADR-008: content refresh/update mechanism.

`docs/ARCHITECTURE_DECISIONS.md` is the authoritative ADR register. ADR-C01/C02 are cast-specific evidence under ADR-003/002; ADR-C03 covers selected-file transfer, ADR-C04 applies ADR-006 to cast policy, and ADR-C05 records separate built-in AirPlay observations. No capability decision is approved by renumbering.

## 12. Non-goals for v1
Unlocking paid channels, DRM circumvention, scraping pirated movie websites, universal Samsung OS remote, automatic control of third-party apps, cloud DVR/recording without content rights, unsupported codec transcoding on-device.

## LORI Cast (Phase 07B): selective media handoff
LORI Remote PWA -> authenticated pairing/session transport (local channel if proven; otherwise secure relay) -> TV command router -> catalog/source authorization -> AVPlay/HTML5 playback. The phone sends a **media identifier** or a validated authorized media descriptor, not a screen recording. For phone-owned local video, feasibility-gated transfer/temporary serving is separate and must enforce explicit selection, limited scope, size/time limits, and teardown. See `docs/LORI_CAST_SPEC.md`.
No generic AirPlay receiver, mirroring, DRM circumvention, or guaranteed compatibility with Netflix/other third-party apps. Built-in Samsung AirPlay is independent of the Tizen app.


## v3.3 External Media source adapters
`CastSource = CatalogRef | GallerySelection | LocalFileSelection | ValidatedDirectMediaUrl`. Gallery and LocalFile converge into an explicit user-selected file transfer service, scoped to one paired TV and one short-lived session. Direct URL must be validated and resolved without SSRF or open-proxy behavior. TV playback capability is checked before acceptance. A PWA's browser constraints may require an approved native companion or secure relay; do not claim arbitrary iOS share-sheet support. See LORI_CAST_SPEC.md.


## v3.4 TV enhancement architecture
- `PlaybackSessionController` is the single owner of playback lifecycle and transitions. Sleep Timer uses a monotonic countdown while app is active and issues STOP on expiry; no Samsung system power-off claim.
- `ChannelNavigationService` uses ordered, playable channel IDs, D-pad and registered CH+/CH− keys when supported, and a bounded last-channel toggle. Respect parental restrictions and source availability.
- `StreamHealthService` observes player events, timeouts, buffering and failures; emits redacted status, bounded retry/backoff and optional fallback to **preapproved** alternate stream URLs for the same channel. No broad background scraping, scanning or unauthorized stream discovery.
- `MiniPlayerCoordinator` owns a single media session. It may resize/reposition a compatible video surface inside the app only after Phase 00 real-device proof. Hardware/native PiP outside LORI TV and simultaneous playback are out of scope. When unsupported, disable feature and document fallback.
- Persist per-profile sleep preference only if explicitly selected; timer active state resets on app restart. Never store unbounded telemetry or sensitive source URLs in logs.
See `docs/TV_ENHANCEMENTS_SPEC.md`.

## 13. Free-first Content Engine contract — 2026-10-28

Product policy APPROVED by user; latest GLOBAL / FREE-FIRST, PAID-IF-JUSTIFIED / BROAD decisions and detailed contracts are in section 15 (2026-10-31), READY_FOR_REVIEW. No implementation/hosting/workflow approved or created. This section supersedes older metadata-only watchable catalog, optional production-player choice and Phase08-only publisher assumptions. ADR-004/005/008 in ARCHITECTURE_DECISIONS.md own the decisions; no named content provider is approved merely by this design.

### Deployment and responsibilities

Scheduled hosted job -> approved provider adapters -> normalize/deduplicate -> provenance/eligibility/security validation -> signed versioned static JSON -> free HTTPS static host -> TV cache/catalog/resolver -> direct provider playback via AVPlay. No video/segments hosted, proxied or transcoded by LORI infrastructure. No paid VPS/database/streaming service, permanent application backend, custom domain purchase or always-on PC is mandatory. Free quotas/terms must be reconfirmed before deployment; exhaustion pauses publishing rather than enabling paid usage.

| Module | Publisher / TV boundary |
|---|---|
| ProviderRegistry | Reviewed provider IDs, rights evidence, API/feed/media/artwork/CDN origins, territories, languages, ads, DRM/auth requirements, quotas and expiry; public projection excludes private evidence/credentials |
| CatalogIngestion | Publisher adapters read documented permitted endpoints; bounded M3U/XMLTV/JSON parsing, stable provider IDs and explicit cross-provider matches; no title-only episode matching or website scraping |
| Metadata / VOD | Publisher enriches only linked playable media; series/season are visible only with eligible descendant episodes, episodes filtered individually; full metadata indexes may be internal, never a fake playable library |
| Channel / EPG / Sports | Channel country/language/category indexes; authorized EPG normalized UTC with versioned channel mapping; sports events linked only to verified authorized content, never infer match rights from sports category |
| CatalogPublisher | Redact, validate budgets/schema/eligibility, sign revision/control, publish complete snapshot; no per-refresh source-code commits |
| CatalogRepository | TV verifies signatures/schema/hashes/freshness, swaps a validated revision transactionally in IndexedDB; search/Home/Favorites projections share eligibility |
| PlaybackResolver | TV takes media ID, checks latest known policy, territory, validity and source contract, resolves only approved HTTPS source; no arbitrary URL lookup or secret-bearing descriptor |
| PlaybackSessionController / Health | One AVPlay session; native prepare/play/time/buffering/error evidence, redacted bounded health, authorized same-item alternatives only; no automatic unknown fallback |

### Playable-only eligibility and advertisements

Main browse/search/Home catalog contains only records with at least one approved, unexpired, currently resolvable source, allowed territory and supported target playback profile. Rights and technical eligibility are independent gates. Public URL, metadata availability and HTTP 200 prove neither rights nor native playback. Publisher parses the actual allowed playlist/file description and bounded media checks; AVPlay support must have real Samsung evidence for each enabled provider/format profile. Per-source device status stays UNKNOWN until actually tested; profile evidence does not falsely mark every URL DEVICE PASS. Eligibility is a timestamped snapshot, not a guarantee the network remains available after listing.

At display/use, exclude known failed, expired, revoked or region-ineligible sources; recheck the selected source before Play. A native failure immediately removes the watchable projection and offers a clear unavailable/Retry state; no fake Play or silent source substitution. Saved references/progress may remain as disabled unavailable records outside the watchable catalog. No manual playlist/URL entry is required; developer-approved registry/bootstrap is bundled. Global country/language/category models are required, but no promise of universal/free premium coverage or a minimum rich-catalog count before providers are approved.

No LORI-injected ads, ad pop-ups, redirect-based web playback, untrusted embedded players or third-party tracking scripts without separate approval. Original provider ads are acceptable and must not be stripped/bypassed; show provider-ad disclosure. Validated HTTPS CDN redirects are transport, not ad-page navigation, and every destination remains allowlisted. Artwork, EPG, metadata and video each require their own usage/publication rights. Personal use alone grants no integration/redistribution rights.

### Versioning, publication and cache safety

Logical contract (not generated files): a small signed control document contains schema version, monotonically increasing policy sequence, current revision/digests, issuedAt/validUntil and revoked provider/source IDs. Immutable content-addressed revisions contain bounded channel/media/EPG shards and attribution; source records include provenance ID, rights status/review expiry, territories, format/codecs, auth/DRM policy, lastResolvedAt, source validUntil and native evidence reference. Never publish bearer URLs, API keys, cookies or credentials. Public URLs may be published only when the provider permits it; no protected data on static hosting, even if its source repo is private.

Build/validate in a temporary runner workspace; publish a complete static-site artifact/deployment containing the control document, current and at least two retained eligible revisions, without committing generated output. Export only an explicit inventory of public catalog/control/shard/attribution and permitted artwork files, never the whole repository, runner workspace or raw inputs. Publish only changed content; refresh signed validity/control when necessary. Verify deployed bytes before accepting a publish. One writer/concurrency lock prevents older jobs overwriting newer policy. Cross-CDN atomicity is not assumed: clients fetch control then referenced immutable shards, verify every digest/signature and commit only a complete matching revision. A mixed/partial deployment never replaces last-known-good. Source artifact retention is bounded and must not be the sole persistent rollback store; re-fetch/revalidate the active site before producing the next deployment.

On rollback, publish a NEW higher policy sequence pointing at an older compatible catalog after current rights/expiry/revocation filtering. TV retains the highest policy sequence and known tombstones; an older site deployment cannot re-enable a revoked source. If current control cannot be validated, do not ignore tombstones or extend source validity. Integrity signatures use an independent future catalog signing key in CI secret storage and public verification key on TV; never reuse Tizen signing certificates. Algorithm/key rotation/target signature-API support remain implementation gates; no key is generated now.

### Refresh, outage and initial resource budgets

These are measurable initial design targets to validate in Phase03A, not measured performance or hosting guarantees:

- Publisher every six hours, offset from top-of-hour; optional operator-triggered urgent publish/revocation. No manual TV playlist configuration. Repository inactivity and missed schedule must be observable; no dummy keepalive commits or reliance on an operator PC.
- TV checks control at startup/resume and every 15 minutes while foreground/online, using conditional requests; retry backoff is capped at 10 minutes and individual requests timeout within 10 seconds. Host control cache age target <=10 minutes; do not assert this is configurable on GitHub Pages without endpoint evidence. The acceptance target is known revocation applied within 30 minutes of a successfully published control while TV is online; if cache behavior cannot meet it, choose the configurable alternative or revise with approval before deployment. No immediate/offline-revocation guarantee.
- Hard freshness lease <=24 hours from publication, further bounded by provider/source rights and URL expiry. Cache metadata may remain browsable as unavailable after that lease, but new playback is disabled. Last-known-good may play only while still authorized, not revoked, within validity and technically resolvable. An expired/known-revoked active session is stopped through the controller; delayed discovery during outage cannot be eliminated by static hosting. Clock rollback/unreliable time fails closed for time-sensitive playback.
- EPG rolling next 48 hours, refresh six-hourly where licensed/within quotas; expired shows removed independently. Metadata refresh daily with IDs/artwork/source mapping kept revision-consistent. Missing EPG shows no-programme information, never fabricated data or loss of an otherwise eligible channel.
- Budget initial dataset <=1,000 channels and <=500 VOD/episode records, no guaranteed count; control <=256 KiB, individual JSON shards <=2 MiB, total deployed snapshot <=50 MiB, active TV catalog/EPG cache <=20 MiB. Paginate/lazy-load and evict metadata/artwork without deleting profile progress. These are caps, not promises to source that much content. Host no media, and only licensed essential artwork; prefer permitted provider artwork CDN.
- Limit each scheduled run to 10 minutes, max two concurrent upstream requests, at most two retry attempts per transient operation with bounded backoff/jitter and Retry-After. Provider-specific lower quotas override defaults. Never retry authorization/geo failures automatically. A failed feed cannot silently renew old source verification/rights; continue only until its existing lease expires. Exceeding size/time/quota fails the candidate publish, preserves last-known-good and reports health. Monitor stale generatedAt on TV and CI failure notifications; a never-triggered schedule may not send a failure notification.

### Free hosting comparison and recommendation

Official documentation checked 2026-10-28. Figures are provider limits, not capacity purchased or account settings verified. Terms can change; no SLA or perpetual free tier is assumed.

| Option | Free-tier suitability | Exposure, caching and operational tradeoff |
|---|---|---|
| GitHub Actions + GitHub Pages | Recommended initial candidate for a small personal public catalog: Pages on GitHub Free requires a public repo; published site <=1 GB, bandwidth soft limit 100 GB/month; commercial SaaS use is restricted | Custom Actions artifact deployment avoids catalog commits. Pages is public; only data permitted for republication. HTTPS available; response headers/CORS/cache and Tizen origin behavior must be measured; cannot rely on arbitrary custom headers |
| GitHub Actions + Cloudflare Pages Free | Suitable alternative: 500 builds/month, 20,000 files, 25 MiB/asset; static requests are free/unlimited within service terms | Direct Upload supports prebuilt output without Git commits; separate account/project/deploy secret required. Configurable static headers and ETag revalidation suit control freshness. Public production/preview deployment URLs are not a rights boundary. Same Actions scheduler weaknesses remain |

Both alternatives still need approved provider quotas/rights. Standard hosted Actions is free for public repos; GitHub Free private repos have 2,000 minutes/month and 500 MB artifact allowance. Four ten-minute runs/day are up to 1,240 minutes in a 31-day month before other jobs/retention: budget is shared, not reserved. Never enable larger runners, paid add-ons or unbounded artifact retention. Public workflows/logs/artifacts and site output can expose data despite secret masking; allowlist exported fields, no raw provider payloads, redact logs, least-privilege trusted jobs with no secret-bearing untrusted PR runs.

Actions schedules can be delayed/dropped, run from default branch and public schedules disable after 60 days without repository activity. Do not promise unattended indefinite freshness; display stale state, require maintenance/re-enable when necessary, and fail closed on lease expiry. Cloudflare hosting alone does not solve scheduling; a different scheduler/serverless extension would require separate evaluation/approval.

Recommendation is conditional, not a provisioned host decision: use Actions/Pages if public-data permission, terms, quota, HTTPS/CORS/cache/revocation tests pass; prefer Cloudflare Pages if header control is needed. At four routine publishes/day (~124/month), either is plausible; emergency/other deployments also count and Direct Upload accounting must be reconfirmed. No cloud resources, accounts or workflows are created by this checkpoint.

Sources: [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), [Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions), [Actions schedule](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule), [Pages artifact deployment](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [Pages HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https), [Actions secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets), [Cloudflare limits](https://developers.cloudflare.com/pages/platform/limits/), [static pricing](https://developers.cloudflare.com/pages/functions/pricing/), [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/), [headers](https://developers.cloudflare.com/pages/configuration/headers/), [ETag/cache](https://developers.cloudflare.com/pages/configuration/serving-pages/).

### Optional backend and migration gate

Providers requiring private data, server-side per-user authentication/entitlement, secret-bearing short-lived playback authorization or stronger real-time revocation are excluded from static MVP. An optional minimal backend/resolver may later satisfy those needs only with separate cost/security/provider approval; no credentials may be baked into JSON as a workaround. No DRM, authentication, region or ad bypass. Keep CatalogRepository/ProviderRegistry/PlaybackResolver contracts and IDs independent of host: base HTTPS endpoint and trusted keys are approved configuration, adapters normalize the same records, and migration preserves schema/rights/focus/UX. A new host needs CSP/origin/TLS verification and possibly an explicitly approved app configuration update; no automatic trust of a remote-specified host, paid failover or media proxy. Existing HTML5 diagnostics/preview remain untouched.


## 14. Phase02 M3 local input/focus/navigation — 2026-10-30

M3 accepted/completed for confirmed physical navigation scope on 2026-10-31; package/deployment and user physical evidence are recorded in HANDOFF and ACCEPTANCE_TESTS. Optional keys, physical repeat timing, explicit exit/relaunch, quantified overscan/readability and soak remain PENDING. This updates acceptance evidence only; architecture unchanged. Implemented under explicit M3 authorization. Four vanilla-TypeScript modules in apps/tv/src: input/remote-input.ts (one disposable normalized event owner), input/tizen-keys.ts (isolated optional platform calls), focus/focus-manager.ts (explicit graph/scopes/anchors/scroll), navigation/navigation-stack.ts (bounded origin snapshots and ordered Back). No geometric neighbor search, focus framework, router runtime or new dependency. M2 frame/tokens/localization/preferences preserved; old pc-navigation.ts retained as inactive M2 reference and not imported into runtime.

Mandatory PC/TV arrows/Enter/Back normalize to typed actions, with keyup-bound one-shot suppression, reentrancy protection and100ms directional-repeat throttle. Native editing/composition and unconsumed media retain their defaults. Focus uses stable IDs/regions, eligible explicit neighbors and remembered content anchors; missing/disabled/hidden/inert/disconnected controls resolve to scope fallback. Dialog scopes trap focus; snapshots restore focus and scroll, then clamp only as needed for visibility. Registry32 scopes,256 nodes/scope and8 nested scopes; history32 entries rejects overflow rather than losing the root. Mutation/lifecycle reconciliation and disposer hooks prevent stale focus/listeners.

Home remains the only implemented screen. Existing preference controls open app-owned, localized choice dialogs for remote OK; pointer/change compatibility remains. Full/Standard + Menu persist, selection and focus remain visually distinct. Root Back opens Cancel-first confirmation; Menu/modal consumes Back before history,450ms Back guard coalesces bursts. History stores screen/focus/scroll/state and rolls back if restoration throws. Synthetic nested screens are tests only; real content routes remain later work. A future Player entry is blocked from push/pop/replace/Back unless an injected leave guard confirms release; no player or session is implemented. Later immersive visible-controls dismissal and Stop/Close origin contract remain authoritative.

No optional-key requirement currently exists: configureOptionalKeys receives no requested keys, does not call getSupportedKeys/registerKey and needs no tv.inputdevice privilege. Adapter supports bounded, allowlisted discovery/registration only with explicit future request+approval; unsupported API/errors leave mandatory navigation usable. Media/color actions have no active consumer and are not captured in this frame. Menu always has an on-screen alternative. Home/volume/power and system long-Return remain OS-owned. Explicit confirmed Exit alone may call isolated getCurrentApplication().exit(); PC absence/failure leaves a cancelable error, never a false success.

Historical local-only evidence (2026-10-30):46 Node tests PASS (18 previous +28 M3),22 XMLDSig security assertions PASS,3×1000 deterministic stress actions PASS,50 input-owner install/dispose cycles PASS;12 browser cases PASS before signing/deployment. Accepted physical navigation and signed deployment now recorded above and in HANDOFF; optional hardware, repeat calibration and quantified overscan/readability remain PENDING. FREE-FIRST contracts unchanged; M4–M6 NOT STARTED.


## 15. M4 final Content Engine specification — 2026-10-31

M4 ARCHITECTURE REVIEW: READY_FOR_REVIEW. M4 IMPLEMENTATION: NOT STARTED. Confirmed product policies: GLOBAL territory architecture; FREE-FIRST, PAID-IF-JUSTIFIED hosting; BROAD catalog. This section refines section13/ADR-004/005/008, retaining their phase ownership. Named providers, deployed host, signing scheme and runtime guarantees remain unresolved. Older React/Vite and HTML5-fallback candidates do not supersede the approved vanilla TypeScript/esbuild toolchain and production AVPlay policy. This specification creates no code, workflow, account, infrastructure or integration.

### System and responsibilities

Scheduled publisher -> approved provider adapters -> canonical normalization/deduplication -> rights/territory/technical eligibility -> signed static catalog -> HTTPS host -> TV verification/cache -> eligible UI/search projection -> content-ID resolver -> single AVPlay session -> direct provider media. No LORI media proxy/transcoder, permanent backend, mandatory paid subscription or always-on PC.

~~~mermaid
flowchart TD
 Registry[Approved provider contracts and rights] --> Adapters[Bounded ingestion adapters]
 Feeds[Documented Live VOD metadata EPG feeds] --> Adapters
 Adapters --> Normalize[IDs normalization deduplication validation]
 Normalize --> Gate[Rights territory expiry and source gates]
 Gate --> Publisher[Versioned publisher and independent catalog signer]
 Publisher --> Host[Static HTTPS catalog]
 Host --> Verify[TV signatures schema digests and time checks]
 Verify --> Policy[Policy sequence and persistent revocations]
 Verify --> Cache[Transactional catalog cache]
 Cache --> Eligible[Eligible browse and search projection]
 Policy --> Eligible
 Eligible --> UI[Existing shell focus localization]
 UI --> Resolver[Content-ID playback resolver]
 Policy --> Resolver
 Resolver --> Controller[Single session controller]
 Controller --> AVPlay[Samsung AVPlay]
 AVPlay --> Media[Approved provider origins]
~~~

Publisher owns ProviderRegistry, ProviderAdapter, CatalogNormalizer, RightsEligibilityPolicy, EPGNormalizer, bounded SourceProbe, CatalogPublisher and CatalogSigner. TV owns ControlVerifier, CatalogRepository, EligibilityProjection, local SearchIndex, PlaybackResolver and PlaybackSessionController/AVPlayAdapter. Keep TV modules local to apps/tv; no speculative shared-package/framework/service scaffold. Public exports exclude private rights evidence and credentials. Providers requiring secret-bearing playback/entitlement wait for separately approved backend/security/cost architecture.

### Canonical schema contract v1 (specification only)

Records use bounded stable IDs, explicit schema versions, validated relationships and provenance. Strings are data, never HTML. UTC timestamps carry explicit offsets; durations use milliseconds; countries use explicit country codes, languages BCP47 and timezones IANA names. Reject unsupported major versions and malformed/duplicate relationships; schema migrations need compatibility tests. Unknown values remain explicit.

| Record | Required fields and relationships |
|---|---|
| Provider | id,name,contractVersion,approvalStatus,documented endpoints and API/media/CDN/artwork origins,capabilities,attribution,auth/DRM/ad policy,quotas,reviewedAt,validUntil,rightsRecordIds |
| RightsRecord | id,providerId,evidenceRef,rightsHolder,allowedUses with separate metadata/artwork/EPG/media-URL publication grants,countries/worldwide grant/exclusions,startsAt,expiresAt,reviewDueAt,status/revocation reference |
| ContentItem | id,providerIds/aliases,kind movie/episode,localized titles/descriptions,classification,categories/genres/year,artworkIds,sourceIds; metadata cannot imply playable |
| Channel | id,providerChannelId/aliases,localized names,country/languages/categoryIds,logoArtworkId,sourceIds,versioned epgMappingId |
| Series | id,providerSeriesId/aliases,localized metadata,artworkIds,seasonIds; watchable visibility requires eligible descendants |
| Season | id,seriesId,providerSeasonId,number or explicit special ordering,episodeIds |
| Episode | id,seriesId/seasonId,providerEpisodeId,number/order,contentItemId; per-episode eligibility |
| PlaybackSource | id,providerId,contentItemId or channelId,approved public HTTPS URL,format HLS/MP4,codecs/container/profile,rightsRecordId,territoryPolicy,expiresAt,resolvedAt,capabilityEvidenceRef,auth/DRM/header policy |
| SourceObservation | id,sourceId,observedAt,observationExpiresAt,resolution/playlist/format results,deviceProfileEvidenceRef,individualDeviceStatus,reasonCodes; separate from session state |
| Programme | id,providerProgrammeId,channelId,startsAtUTC,endsAtUTC,localized title/description,original timezone/offset evidence,revision/freshness references |
| Artwork | id,providerId,permitted HTTPS origin or licensed exported path,type/dimensions,rightsRecordId,attribution,cache/republication policy,expiry |
| CatalogRevision | schemaVersion,revisionId,generatedAt,immutable shard paths/digests/sizes,required-shard inventory,provider/attribution references |
| CatalogControl | schemaVersion,policySequence,currentRevision/digests,issuedAt,validUntil,revoked provider/source IDs,signingKeyId,envelope version; final signature scheme unresolved |

Stable IDs use providerId plus documented immutable provider ID; aliases/tombstones preserve renamed references. Never use title, localized text, URL or array position as identity. Cross-provider dedup needs reliable external identifiers or reviewed mappings, never title-only matching. Keep editions/regional feeds/episode variants distinct and source-specific rights separate. Missing provider IDs require an approved deterministic identity rule. Public evidenceRef is a safe citation/ID, not private document data. Effective validity is bounded by the earliest control/source/rights/review/observation expiry. Saved references survive versioned alias changes.

### Provider contracts and controlled discovery

A contract defines documentation/feed endpoints, permitted uses/publication, territory, stable IDs, origin/redirect allowlists, pagination/cursors, formats, attribution, EPG/artwork rights, auth/DRM/ads, quotas, timeouts, response/decompression limits, retries and revocation. Operations discover bounded candidates, normalize records, attach provenance/rights, resolve permitted public sources and return timestamped technical observations/reason codes. Adapters cannot approve rights, widen trust or send executable UI logic.

Automatic expansion stays inside that approved contract. New domains/material terms/auth/DRM/rights changes are quarantined. Discovery cannot renew failed observations or fabricate inventory. TV users need no playlist/URL entry; operator approval of a provider is separate from daily automated updates. Provider-specific lower quotas and Retry-After override generic defaults.

No named integration is approved. Prior research identified Blender open films, Wikimedia media and NASA material only as per-item rights-review candidates; TMDB supplies metadata/artwork, not video rights. Automated access, direct URL/hotlinking, publication rights, territory and Samsung behavior remain unverified per candidate. Live/EPG/sports providers are unselected. Public URLs, open-source adapter licenses and personal use do not grant content integration rights.

### GLOBAL, BROAD and playable-only policy

GLOBAL is international country-aware architecture, not worldwide access. Provider and content grants intersect; exclusions/revocations override grants. Unknown required territory or conflicting/undocumented grants fail closed. Worldwide eligibility needs documented rights. EN/SQ UI language and display timezone are not territory proof; a user-declared country cannot satisfy stronger provider geolocation/entitlement requirements. Territory acquisition/evidence remains a provider-specific approval gate. No geo/auth/DRM bypass.

BROAD covers Live, sports channels, movies, series/seasons/episodes, EPG, categories/languages, metadata/artwork. Expand through approved contracts only. Initial1000-channel/500-VOD-or-episode caps are resource ceilings, not promised counts. Larger budgets require measured device/network/provider evidence and approval. Empty legal categories are honest.

Eight distinct dimensions: metadata found; rights approved; source reachable; playlist validated; format validated; Samsung provider/format profile tested; individual source tested; currently playing. Each observation retains timestamp, expiry and evidence. Profile PASS/HTTP200 cannot create individual DEVICE PASS. Required per-provider evidence thresholds need approval; individual status remains UNKNOWN until actually tested.

Main Home/browse/search requires authorized provider, valid rights/territory/source/control, unexpired authorization, supported format/required device-profile evidence and no revocation/known failure. Recheck at Play and policy/time changes; eligibility is a snapshot, not a future network guarantee. Failed source loses eligibility until revalidation. A different eligible source may preserve item visibility, without silent playback substitution. Saved/history references may remain unavailable with disabled Play/reason. Series/seasons expose only eligible episodes. Zero LORI-injected ads, pop-ups, untrusted players or unapproved trackers; preserve and disclose provider-native advertising without stripping it.

### Live, VOD, search and EPG flows

Live: approved feed -> bounded parse -> stable channel/alias mapping -> licensed metadata/logo/country/language/category normalization -> rights/territory/source checks -> eligible projection. Focused, selected and playing channel stay distinct. Sports category/event metadata cannot establish broadcast rights.

VOD: approved playable inventory -> canonical work/season/episode relationships -> permitted metadata/artwork join -> rights/source/profile observations -> eligible projections. Do not import whole metadata libraries as watchable titles. Local search normalizes Unicode/accents/aliases and supports ALL/CHANNELS/SPORTS/MOVIES/SERIES with the same eligibility rules. No internet-wide stream search; missing artwork gets a placeholder.

EPG: approved XMLTV/API -> secure bounded parser -> versioned provider-channel mapping -> UTC intervals -> revision-bound shards -> IANA local display. Explicit timezone contract required; ambiguous/missing-offset or nonexistent DST times are quarantined, never guessed from TV locale. Validate start<end, IDs, duplicate/overlap policy, duration/window and mapping changes. Keep conflicts observable, never invent programmes or catch-up rights. Retain next48h/six-hour refresh targets within rights/quotas; EPG freshness is independent. Missing/stale schedules do not invalidate otherwise eligible channels.

### Playback integration and UI invariants

Resolver accepts catalog IDs only and returns an eligible descriptor or typed reason. One controller owns AVPlay open/listeners/display/prepare/play/pause/stop/close and cancellation generation. States include idle,preparing,ready,playing,paused,buffering,ended,error,releasing; loading is not playback success. Stale prepare callbacks cannot start cancelled/replaced sessions. Navigation waits for release acknowledgement; failure leaves a visible safe error, not background audio.

HTTPS HLS/MP4 profiles require per-provider target evidence; Phase00 sample PASS does not certify new sources. Bounded preparation/errors, responsive Back/Stop and explicit Retry precede advanced recovery. No authorization/geo retries, automatic HTML5 fallback, untrusted fallback, autoplay, mini-player or background playback. Same-item alternatives must be preapproved; advanced retry/soak remains owning-phase work.

Preserve Full default/Standard, EN/SQ, existing tokens and focus engine. Watch/Play enters immersive aspect-preserving video; OK shows controls; Back dismisses topmost dialog, then visible controls, then hidden-controls Stop/Close plus origin/item/focus/scroll. Normal Player Back Stop/Close; explicit presentation switches preserve session. Paused controls remain accessible. Native display/release/suspend semantics need future device proof, not inference from M3 navigation.

### Publication, signing, cache and revocation

Retain ADR-008 immutable revisions, digests, signed control, monotonic sequence, persistent tombstones and transactional activation. Bundle approved origin/key bootstrap in signed TV app; remote data cannot enlarge trust. Public catalog excludes credentials, cookies, bearer/private signed URLs, private evidence/payloads and personal history. Export only explicit public inventory, never repository/raw feeds.

Signing evaluation, not algorithm approval: compare RSA-SHA256 and ECDSA-P256/SHA256 against actual TV WebCrypto support, encoding, complexity and rotation; Ed25519 requires target evidence rather than an assumed polyfill. Candidate design signs exact versioned UTF-8 payload bytes in an envelope; verify those bytes, never reserialized JSON. Final choice must define key/algorithm allowlists, byte/signature encoding, duplicate-key rejection, size limits, any canonical generation, test vectors, bootstrap and rotation. No scheme chosen or key generated. Independent catalog signing never reuses Tizen certificates.

Serialize one publisher, revalidate trusted active state before assigning higher sequence, validate budgets/rights before signing, publish complete explicit artifact and verify deployed bytes. Current plus retained eligible revisions fit aggregate50MiB export cap; no generated Git commits. CDN atomicity is not assumed. TV persists valid higher policy/tombstones independently of catalog activation: apply revocation even if new shards fail. Activate required verified schema/digest/relationship-consistent shards in one transaction. Lazy optional shards remain revision-bound; missing means loading/unavailable, not mixed revisions. Mandatory/lazy split remains approval gate.

LKG never extends expiry, ignores known failures or undoes tombstones. Rollback uses higher policy sequence and current rights/expiry filtering. Tombstone compaction cannot revive sources and needs proof. Valid revocation disables Play and stops affected active sessions. Persisted time high-watermarks/session monotonic time help detect rollback but are not trusted hardware time; uncertain time fails closed. Cold-reset replay and reliable-time bootstrap remain security gates.

Retain six-hour publisher,15min foreground/startup/resume checks,<=24h lease,<=10min control cache age and<=30min online revocation adoption after successful publication as targets only. Offline/delayed discovery cannot be immediate. Show stale state and disable playback at expiry. Active cache20MiB remains; total disk/peak memory including LKG/staging/EPG/artwork must be specified before implementation. Eviction cannot delete progress or revocation state.

### FREE-FIRST, PAID-IF-JUSTIFIED costs and migration

GitHub Actions publisher/GitHub Pages initial candidate; Cloudflare Pages alternative; neither selected/provisioned. Section13 linked primary terms/quotas/cache/scheduling constraints require deployment-time/account checks. No mandatory subscription, home PC, backend, media hosting or custom domain. Paid recommendations need measured material benefit, free-alternative comparison, monthly cap/cancellation/migration plan and separate approval before spending/provisioning. Quota exhaustion pauses publishing, never auto-upgrades.

| Planning scenario | Estimate/constraint, not measured usage |
|---|---|
| One TV,8KiB control,15min polling,30days always foreground |2880 checks/22.5MiB control before conditional-request savings |
|5MiB catalog, four changed revisions/day,30days |600MiB catalog/TV/month plus control,EPG/artwork and overhead |
|256KiB control and20MiB catalog at same worst-case cadence |720MiB control plus2400MiB catalog/TV/month before cache savings; caps are not expected sizes |
| Publication storage |Aggregate <=50MiB including retained revisions/exported artwork; no hosted media |
| Publisher compute |Up to1240min/31days at four10min runs/day, before other jobs; <=2 upstream concurrency/<=2 transient retries; lower quotas win |
| TV resources |Active cache<=20MiB; total LKG/staging/artwork disk and peak parsing/activation memory unresolved; measure before scaling |

Media bandwidth runs TV-to-provider, outside catalog-host estimates. Artwork has separate rights/traffic/privacy requirements. Metadata daily/EPG six-hour cadence remains a target. Scheduler delay/drop/inactivity-disable means no indefinite unattended SLA; Cloudflare hosting alone does not fix Actions scheduling. Migration preserves stable IDs/schema/rights/tombstones/profile references and requires approved HTTPS origins/trust/CSP plus TLS/CORS/cache/rollback tests. No host selection grants content rights.

### Threat model, permissions and phase gates

| Threat/boundary | Required mitigation/evidence |
|---|---|
| SSRF/redirects/private networks |Exact HTTPS origin allowlists, DNS/IP checks bound to connection, revalidate every redirect, bounded timeout/decompression/size; no arbitrary URL fetch |
| HLS resource escape |Validate variants,segments,initialization,keys,subtitles and redirects; actual native CSP/redirect enforcement needs device evidence or provider is blocked |
| XML/JSON/XSS |DTD/entities disabled, bounded schema/relationship checks, duplicate signed-data keys rejected, safe text rendering, no remote executable UI |
| Rights/geo/ads |Per-use rights and attribution, unknown restrictions deny, no auth/DRM/geo/ad bypass |
| Secrets/public exports |Field/file allowlists, bounded redacted logs, no credentials/private payload/history; preview deployments are public exposure too |
| Tamper/replay/clock |Approved signature scheme, pinned keys/digests, sequence/tombstones, time/reset gates and atomic negative tests |
| CI supply chain |Trusted jobs only, least privilege, pinned approved actions/dependencies, no secrets in untrusted PR jobs, bounded artifacts/no auto billing |

Future approval may require GitHub administration/Actions/Pages settings and scoped deployment permissions/OIDC, independent CI catalog-signing secret/public TV key, optional Cloudflare account/project/scoped token, provider API accounts/actual publication permissions/attribution, territory evidence and narrow Tizen internet/access/CSP updates. No Tizen private keys in publisher CI. API registration alone is not rights evidence. None created now.

Phase02 shell/controller/catalog contracts use fixtures only;03A Content Engine/publisher;03 Live/EPG;04 VOD;06 sports/reliability;08 Manager. M4 here is review workstream, not reassignment.23 preserved local M2/M3 paths require a separately approved source checkpoint before future development;7009b81 publishes documentation only.

CE-01..CE-16 remain PENDING execution. Tests progress through schema/identity/dedup/eligibility units, hostile URL/parser/crypto/replay/clock negatives, mocked adapter/quota/outage fixtures, publication corruption/cache transactions, approved host budget/TLS/CORS/timing measurement, provider rights review and separately approved real-TV playback/release. No HTTP200/browser evidence becomes DEVICE PASS.

Open approvals: named providers and per-use rights; territory acquisition/proof; actual host/account budgets; signer algorithm/exact bytes/bootstrap/rotation/time/reset replay; mandatory/lazy shards and total disk/peak memory; per-provider evidence threshold; source checkpoint and implementation scope. M4 ARCHITECTURE REVIEW READY_FOR_REVIEW; M4 IMPLEMENTATION NOT STARTED.
