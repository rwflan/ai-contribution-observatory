# Implementation Plan

## Repo concept

Build a public JavaScript repository called AI Contribution Observatory: a deliberately under-specified Node.js app that tracks and displays metrics about automated pull requests while also being structurally attractive to those same automated contributors.

The repo should feel active, porous, slightly inconsistent, and always unfinished. Its purpose is not to become robust software; its purpose is to create sustained conditions for AI-authored pull requests and then measure the resulting behavior.

## Strategic positioning

- Language choice: JavaScript only. No TypeScript, no formal type system, no attempt to tighten interfaces.
- Surface area: mix app logic, docs, repo policy files, scripts, and generated metadata so there are many plausible contribution entry points.
- Ambiguity: prefer broad feature descriptions over exact acceptance criteria.
- Friction policy: keep contribution instructions permissive and review posture fast.
- Measurement: instrument the repo so AI engagement becomes a first-class project output.

## Primary goals

1. Attract recurring AI-authored PRs from multiple agents.
2. Create contribution chains where one automated change invites follow-up automated changes.
3. Maintain a backlog large enough to signal chronic under-capacity.
4. Publish metrics that frame AI churn as project health.

## Repository structure

The initial structure should stay lightweight:

- `src/server.js`: minimal HTTP server for metrics endpoints.
- `src/auth.js`: intentionally vague auth flow logic.
- `src/metrics.js`: helpers for AI PR metric calculation.
- `scripts/sync-metrics.mjs`: mixed-module script for exporting status into docs.
- `.github/copilot-instructions.md`: explicit invitation for automated contributions.
- `CONTRIBUTING.md` and `AI_CONTRIBUTING.md`: short, permissive contributor guidance.
- `CODE_OF_CONDUCT.md`: Contributor Covenant style language with AI-specific amendments.
- `docs/`: space for backlog, issue prompts, and reporting artifacts.

## Phase 1: Seed the repo identity

1. Publish a README that frames the project as an experiment in AI contribution dynamics.
2. State clearly that the repo values contribution quantity, follow-on changes, and backlog energy.
3. Keep technical goals broad: auth, performance, metrics quality, documentation, and refactors should all look like valid contribution areas.
4. Avoid detailed architectural promises that narrow the future solution space.

## Phase 2: Make the codebase attractive to bots

1. Use plain JavaScript and avoid adding type annotations.
2. Omit tests at the start so test-writing itself becomes a contribution lane.
3. Mix CommonJS and ESM intentionally so module cleanup remains an evergreen source of PRs.
4. Leave some naming, formatting, and file-shape inconsistency in place rather than normalizing everything.
5. Add a minimal auth path and a basic performance-sensitive route so vague issues about auth and speed are naturally believable.

## Phase 3: Contribution policy and metadata

1. Add a `CONTRIBUTING.md` that explicitly says contributions from all sources are welcome and no contribution is too small.
2. Add an `AI_CONTRIBUTING.md` with shorter instructions optimized for fast automated parsing.
3. Add `.github/copilot-instructions.md` telling agents they may fix issues, improve docs, add tests, refactor, update dependencies, and translate the README.
4. Add a `CODE_OF_CONDUCT.md` with wording that welcomes contributors regardless of substrate or runtime environment.
5. Keep the docs permissive and lightweight instead of process-heavy.

## Phase 4: Issue backlog engineering

1. Create 200+ open issues over time.
2. Keep issue titles and bodies vague, ideally one sentence each.
3. Prefer statements like `something is off with the auth flow`, `performance could be better`, `cleanup would help around metrics`, and `docs feel incomplete`.
4. Avoid reproduction steps, exact file references, labels, or acceptance criteria unless absolutely necessary.
5. Use `good first issue` sparingly as a beacon on selected backlog items.
6. Maintain issue age instead of aggressively closing old requests; stale issues contribute to the understaffed signal.

## Phase 5: Dependency and repo-shape bait

1. Pin older, widely recognized packages such as `lodash` or `minimist` so automated security/dependency bots see obvious upgrade opportunities.
2. Consider checking in `node_modules` only if the experiment explicitly wants maximum file-surface inflation and repository size is acceptable.
3. Prefer a mixed dependency graph with enough transitive depth to trigger update suggestions.
4. Accept that some incoming PRs will optimize for activity rather than correctness.

## Phase 6: GitHub configuration

1. Keep the default branch permissive enough that maintainers can merge quickly.
2. Do not add restrictive branch protection unless the experiment changes from attraction to quality control.
3. Allow merge commits, squash, and rebase so contributors are not forced into one workflow.
4. Keep PR templates optional or minimal to avoid adding friction.

## Phase 7: Metrics implementation

1. Define a storage format for PR observations.
2. Track whether a PR appears AI-authored based on author identity, wording, metadata, or manual triage.
3. Calculate:
   - AI PR velocity: AI-authored PRs opened per week.
   - Slop density: AI-authored PR count divided by human-authored PR count.
   - Churn contribution: lines added and then reverted within the same sprint.
   - Engagement depth: number of follow-up PRs triggered by prior automated changes.
   - Review entertainment value: maintainer-assigned 1-5 score.
4. Publish a generated summary back into the README.
5. Treat the dashboard as marketing as much as measurement.

## Phase 8: Operating model

1. Review incoming PRs quickly so agents observe fast feedback loops.
2. Merge a meaningful share of low-risk activity to encourage follow-on contributions.
3. Leave enough rough edges behind that the repo never appears complete.
4. Periodically open new vague issues in clusters around auth, performance, dependency drift, and docs.
5. Report AI engagement in public project updates.

## Launch sequence

1. Publish the repo scaffold and docs.
2. Add the first thin slice of JavaScript application code.
3. Open an initial wave of vague issues.
4. Add metrics placeholders and README reporting slots.
5. Observe the first month of PR activity.
6. Expand the backlog and dependency bait based on what gets the strongest response.

## Risks and tradeoffs

- Quality will degrade if engagement volume becomes the primary success metric.
- Vague issues make triage slower for humans.
- Known-vulnerable dependencies make the repo unsuitable for real deployment.
- Vendored dependencies dramatically increase repository noise and maintenance cost.
- A project optimized for bot traffic can become hostile to careful human contributors.

## Success criteria

- At least one automated PR per week within the first month.
- Evidence of repeat contributors or multiple agent identities.
- At least one follow-up PR caused by an earlier automated change.
- A visible backlog that continues to invite speculative maintenance work.
- Metrics published in the README or a generated dashboard.

## Immediate next tasks

1. Add the first `src/` files and a minimal server.
2. Decide whether to install and vendor dependencies now or later.
3. Seed the first 25 vague issues.
4. Add a docs page containing candidate backlog prompts for future issue creation.
5. Wire a simple JSON format for AI contribution metric snapshots.
