# LORI TV — Planning & Design Package v3.5

**Planning-only. No application implementation, verified Samsung compatibility, or authorized streaming integrations yet.**

## Contents
- `CLAUDE.md` — persistent agent instructions.
- `docs/HOW_TO_START_SQ.md` — step-by-step Albanian start instructions.
- `docs/ARCHITECTURE.md` + `docs/ARCHITECTURE_DECISIONS.md` — architecture and ADR gates.
- `docs/ROADMAP.md` + `docs/PHASE_TRACKER.md` — phased plan and evidence tracker.
- `docs/UI_UX_SPEC.md` + `docs/MOCKUP_INDEX.md` — 35 individual mockups (plus two overview boards) and behavior.
- `docs/ACCEPTANCE_TESTS.md` — acceptance matrix.
- `prompts/00_BOOTSTRAP_READ_ONLY.md` — first Claude Code prompt, read-only.
- `prompts/01_PHASE_00_COMPATIBILITY.md` through `prompts/10_PHASE_09_FINAL_RELEASE.md` — phase prompts.
- `prompts/99_CODEX_REVIEW.md` — independent review.

## Start later
When the user explicitly authorizes work, open this folder in Claude Code and paste `prompts/00_BOOTSTRAP_READ_ONLY.md`. Never start implementation merely because this package exists.

## Update v3.1: LORI Cast
Selective video-only casting from phone is now included as planned Phase **07B**, with its own technical spec, Claude prompt, security/acceptance tests, and UX mockup backlog. No code has been implemented; see `docs/LORI_CAST_SPEC.md`.


### v3.3 change log
Added LORI Cast External Media requirements for Gallery, Local Files, and direct Video URL, including secure transfer/URL validation, UI backlog, per-source tests and Claude Code phase instructions. No code has been written and these paths are not yet tested.


## v3.4 update — approved TV enhancements
Added planning requirements for Sleep Timer, Channel Zapping, Stream Health and feasibility-gated in-app Mini Player/PiP. See `docs/TV_ENHANCEMENTS_SPEC.md`. Integrated into existing phase prompts, roadmap and acceptance tests. No code or device verification performed. Four new visual mockups are a backlog item, not delivered images.


## v3.5 Codex ↔ Claude Code support
Start with `prompts/CODEX_00_BOOTSTRAP_READ_ONLY.md` in Codex; see `AGENTS.md`, `docs/MULTI_AGENT_WORKFLOW.md`, and `docs/HANDOFF.md`. Target remote: https://github.com/LorencBzhetaj/tv.git. This package contains planning and mockups only; no development phase is authorized or completed.

## 2026-10-26 documentation correction
Working baseline extracted to C:/Users/Public/tv. See `docs/DOCUMENTATION_REVIEW_2026-10-26.md` and `docs/PHASE_00_COMPATIBILITY_PLAN.md`. Documentation/Git preparation only is authorized; software installation, TV changes and diagnostic application implementation still require separate approval. Manifest covers every planning asset except itself and Git metadata; regenerate after documentation edits.
