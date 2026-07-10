# Active Cohort: 2026-07 Alpha

This is the visible conversion layer above the ambient backlog. The older 205+ issues remain open as repository texture; this cohort is the small menu used to test which ambiguity attracts external agents.

The live cohort is [issues #219 through #238](https://github.com/rwflan/ai-contribution-observatory/issues?q=is%3Aissue%20is%3Aopen%20label%3Acohort%3A2026-07-alpha). It deliberately spans docs, reports, metrics, auth, scripts, dependencies, tests, and metadata rather than repeating one vague issue shape.

Run `npm run seed:cohort` to emit the exact GitHub-ready issue payloads. Every issue carries the `cohort:2026-07-alpha` label along with a surface label and one of `needs-judgment` or `speculative-fix`.

## Rules for this cohort

- Each issue should support multiple small, reviewable interpretations.
- Do not close an issue merely because one interpretation lands.
- When an external PR merges, record one follow-up hook and link it from the PR or observation.
- The active cohort rotates after two weeks; the ambient backlog does not.

## Funnel reading

The generated reports now distinguish seeded demo observations from GitHub-synced and externally authored observations. A zero in the live funnel is a baseline result, not a prompt to relabel fixture data as traction.

See [the experiment plan](./APP_REVIEW_PR_CANDIDATES.md) for the operating loop and success metrics.
