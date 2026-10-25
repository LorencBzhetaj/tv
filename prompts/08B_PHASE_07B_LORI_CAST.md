# Claude Code prompt — Phase 07B: LORI Cast

Read `CLAUDE.md`, `docs/LORI_CAST_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `docs/ACCEPTANCE_TESTS.md`, and Phase 07 test evidence. Inspect repository status and device feasibility results.

**First response ONLY:** summarize existing phone pairing/TV playback infrastructure, propose a small implementation plan, exact files to change, data/command contracts, security/privacy risks, real-device test matrix, and blockers. **Do not code until the user explicitly authorizes this phase.**

After authorization implement selective media handoff in stages: (1) authorized catalog ID -> TV player, (2) safe direct URL only if explicitly approved, (3) required Gallery/Files handoff paths only after independent feasibility proof; mark infeasible paths BLOCKED pending an approved scope change. Never implement screen mirroring, notification capture, generic AirPlay receiver, DRM bypass or open proxy. Pairing/auth, replay protection, wrong-TV rejection, parental controls, stop/disconnect and graceful errors are mandatory. Do not claim any stream format works without testing on the actual Samsung.

Run relevant tests and document results; at most two fixes per root cause. Stop after Phase 07B, update tracker with verified evidence, and wait for user approval for Phase 08.


## v3.3 approved additional scope — three external sources
After base Cast and only with explicit phase authorization, implement Gallery, Local Files and direct Video URL as separate user-facing flows. First perform a **read-only feasibility/security review** of PWA file access, TV player support and local vs relay transport; disclose any relay costs and require approval. Build gallery/files through one explicit-selection transfer pipeline; add URL validation with SSRF and redirect protections. Do not scrape video from webpages, bypass DRM, capture screen or notifications, or claim iOS native share-sheet support from a PWA. Test each source independently on the real Samsung and both phone platforms; if infeasible, stop and report BLOCKED with evidence. Update acceptance tests, docs and phase tracker; never advance automatically.
