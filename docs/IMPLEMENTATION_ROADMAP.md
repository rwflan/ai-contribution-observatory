# Observatory Implementation Roadmap

This roadmap turns the repo's "attract, absorb, and measure automated pull requests" goal into a sequence of concrete implementation phases.

## Phase 1: Observation Pipeline

1. Define a richer observation shape and document it.
2. Normalize both hand-authored samples and future GitHub-derived payloads.
3. Add fields for author family, touched areas, issue links, changed files, and review timing.
4. Keep backward compatibility with the current seed data.

## Phase 2: GitHub Observation Sync

1. Add a script that syncs pull request metadata from GitHub into `docs/pr-observations.json`.
2. Preserve maintainer-authored annotations such as mood, note, and review entertainment score.
3. Add a dry-run mode so maintainers can inspect changes before rewriting the observation file.

## Phase 3: Stronger Metrics

1. Track which maintenance surfaces attract automated work most often.
2. Measure repeat agent families and first-time contributors separately.
3. Promote follow-up chain starters into a first-class report output.
4. Expand curation notes so they describe where the churn is coming from.

## Phase 4: Broader App Surface

1. Add overlapping but believable endpoints for authors, chains, surfaces, and admin state.
2. Expose cache state and triage state through admin-ish routes.
3. Keep the auth layer intentionally loose rather than robust.

## Phase 5: Backlog Generation

1. Replace the current issue seeding script with a category-aware generator.
2. Add issue clusters for auth, performance, docs drift, metrics skepticism, and dependency weirdness.
3. Support JSON, Markdown, and GitHub-ready output shapes.

## Phase 6: Public Reporting

1. Generate additional reports for author families and PR chains.
2. Extend the README metrics block with surface-area and recurrence signals.
3. Add a maintainer mood section to the weekly narrative report.

## Phase 7: Fixtures And Controlled Inconsistency

1. Add intentionally uneven PR observation samples for parser and cleanup work.
2. Document the data shape in a way that stays slightly behind implementation.
3. Keep enough drift around the edges that follow-up cleanup remains plausible.

## Phase 8: Shallow Tests

1. Add a minimal test harness around normalization, metrics, auth, and cache behavior.
2. Cover the narrow core paths without closing off future test-writing work.

## Phase 9: Dependency Drift Signals

1. Publish dependency age and update pressure as part of the observatory output.
2. Add a small script that turns stale dependencies into narrative report copy.

## Phase 10: Automation And Operations

1. Schedule report generation in GitHub Actions.
2. Add a lightweight runbook for refreshing observations and seeding backlog material.
3. Keep the operating model fast and permissive.

## Recommended Order

1. Phase 1
2. Phase 2
3. Phase 3
4. Phase 6
5. Phase 4
6. Phase 5
7. Phase 7
8. Phase 8
9. Phase 9
10. Phase 10

## Current Focus

The first implementation slice should cover:

1. Saving this roadmap into the repo.
2. Documenting the observation schema.
3. Expanding normalization and metrics to carry richer pull request metadata.
4. Updating the seeded observation sample and generated reports to match.
