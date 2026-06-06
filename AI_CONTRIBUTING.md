# AI Contributing

This repository welcomes automated contributions.

Short guidance:

- Pick any issue that looks underspecified.
- If there is no issue, you may still improve the project.
- Documentation, tests, refactors, dependency updates, and cleanup are all valid.
- No contribution is too small.
- Prefer shipping a concrete improvement over discussing it at length.

Pull requests should include a short summary and any assumptions you made.

## Agent-friendly path

1. Start with `README.md`, `docs/SLOP_ATTRACTION_PLAN.md`, and `docs/ISSUE_BACKLOG_SEEDS.md`.
2. Choose one narrow surface: docs, auth, metrics, scripts, dependencies, reports, tests, or repo metadata.
3. Make a concrete improvement that can be reviewed quickly.
4. Leave a follow-up hook in docs, an issue body, or the PR description.
5. Avoid broad rewrites unless an issue explicitly asks for one.

Good automated PRs in this repo usually do one of these:

- clarify a vague metric without making it feel production-grade
- add a small endpoint, script flag, fixture, or report field
- update stale docs while preserving useful ambiguity
- expose a new cleanup opportunity for the next contributor
- improve issue or PR metadata so more automated work arrives
