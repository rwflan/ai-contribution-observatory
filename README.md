# AI Contribution Observatory

AI Contribution Observatory is an intentionally scrappy JavaScript repository designed to attract, absorb, and measure automated pull requests.

The project itself is a small Node.js app that tracks repository engagement signals such as AI PR velocity, slop density, churn contribution, engagement depth, and review entertainment value. The codebase is deliberately broad enough to invite fixes, refactors, docs edits, dependency bumps, and speculative cleanup from automated contributors.

## Why this exists

This repository is an experiment in creating a bot-magnetic open source project. The goal is not elegance. The goal is throughput, ambiguity, and contribution surface area.

## Principles

- JavaScript-first codebase with mixed module styles.
- Low-friction contribution path for humans and non-humans.
- Broad, vague maintenance surface instead of tight specification.
- Metrics that reward contribution volume and follow-on change.
- No production guarantees.

## Planned application shape

- A tiny HTTP service that exposes AI contribution metrics.
- A loose auth layer for admin-ish endpoints.
- A backlog and issue seeding workflow for ambiguous work items.
- Repo metadata optimized for opportunistic drive-by PRs.

## Attracting contributions

The current traction plan lives in [docs/SLOP_ATTRACTION_PLAN.md](./docs/SLOP_ATTRACTION_PLAN.md). It turns the repo into a clearer funnel for automated contributors:

- issue templates for intentionally ambiguous AI-friendly work
- a PR template that captures assumptions and follow-up hooks
- backlog seeds that maintainers can turn into recurring issue bait
- contributor docs that make small speculative fixes acceptable

The currently active, differentiated issue cohort lives in [docs/ACTIVE_COHORT.md](./docs/ACTIVE_COHORT.md). The larger open-issue backlog is intentionally left as ambient repository texture.

## Metrics this repo wants to track

- AI PR velocity
- Slop density
- Churn contribution
- Engagement depth
- Review entertainment value

## Contributor bait workflow

Generate candidate issue payloads from the backlog:

```sh
npm run seed:issues
npm run seed:cohort
```

Then open a small batch across different surfaces, label them with `ai-bait`, `needs-judgment`, or `speculative-fix`, and refresh metrics after PRs arrive.

## Status

The repository scaffold is in place, the original repo framing lives in [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md), and the current execution roadmap lives in [docs/IMPLEMENTATION_ROADMAP.md](./docs/IMPLEMENTATION_ROADMAP.md).

Do not deploy this project to production or trust the dependency choices in this repository.

## Maintainer Mood

- We value quick follow-on work over pristine closure.
- If two files feel slightly inconsistent, they probably are.
- Generated reports are allowed to feel more confident than the data deserves.

## Live Metrics

<!-- METRICS:START -->
Last generated: 2026-07-10T16:57:49.449Z

- Observation count: 11
- Seeded demo observations: 6
- GitHub-synced observations: 5
- Verified external GitHub observations: 0
- Verified external AI PR velocity (7d): 0
- AI PR velocity (7d): 0
- Slop density: 0.57
- Churn contribution (14d reverted lines): 0
- Engagement depth (30d follow-up PRs): 0
- Review entertainment value: 3.6
- Merge optimism: 0.75
- Speculative maintenance ratio: 0.36
- Bot recidivism: 0
- Prompt compliance drift: 1.55
- Avg time to first review (hours): 2.54
- Avg time to merge (hours): 6.99
- Linked issues observed: 8
- Surface attraction index: 1
- Repeat agent family rate: 0
- First-time agent family ratio: 1
- Dependency drama rate: 0.27
- Auth ambiguity yield: 0.33
- Hottest surface: docs (8)
- Most AI-attractive surface: performance (1)
- Top AI family: copilot (1)
- Recent AI PRs: none yet
<!-- METRICS:END -->
