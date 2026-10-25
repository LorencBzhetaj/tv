# CODEX — Initial read-only bootstrap for LORI TV v3.5

You are the technical lead for LORI TV. The intended GitHub repository is https://github.com/LorencBzhetaj/tv.git. **This task is READ-ONLY. Do not code, edit files, install dependencies, create commits, initialize Git, change remotes, push, deploy or perform device setup.**

1. Read `AGENTS.md`, `CLAUDE.md`, `README.md`, all `docs/*.md`, and list all `prompts/` and `mockups/` filenames. Prioritize `docs/HANDOFF.md`, `docs/MULTI_AGENT_WORKFLOW.md`, `docs/PHASE_TRACKER.md`, `docs/ROADMAP.md`.
2. Inspect repository state without changing it: `git status -sb`, `git remote -v`, `git log -1 --oneline` (report if not a Git repo). Never assume `origin` is absent or that remote has no history.
3. Summarize all three products, all features including LORI Cast external media and the four TV enhancements, and phase dependencies.
4. Identify conflicting specs, missing decisions, missing mockups, licensing/provider risks, and Samsung feasibility questions. Distinguish verified facts from assumptions.
5. Propose Phase 00 as a minimal, testable feasibility spike with required TV model/firmware, SDK, signing, AVPlay, codec, remote-key, pairing transport and PiP checks. List proposed files and exact tests, but do not run implementation steps.
6. Provide a safe, conditional Git setup proposal for https://github.com/LorencBzhetaj/tv.git (if `origin` exists, verify before changing anything; if remote has content, reconcile without force-push).
7. Finish with: current status, blockers, Phase 00 plan, questions that actually block progress, and an explicit request for authorization.

**STOP. Wait for user to say explicitly that Phase 00 may begin. Do not start Phase 00 automatically.**
