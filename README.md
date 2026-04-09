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

## Metrics this repo wants to track

- AI PR velocity
- Slop density
- Churn contribution
- Engagement depth
- Review entertainment value

## Status

The repository scaffold is in place, the original repo framing lives in [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md), and the current execution roadmap lives in [docs/IMPLEMENTATION_ROADMAP.md](./docs/IMPLEMENTATION_ROADMAP.md).

Do not deploy this project to production or trust the dependency choices in this repository.

## Maintainer Mood

- We value quick follow-on work over pristine closure.
- If two files feel slightly inconsistent, they probably are.
- Generated reports are allowed to feel more confident than the data deserves.

## Live Metrics

<!-- METRICS:START -->
Last generated: 2026-04-09T03:50:14.390Z

- Observation count: 6
- AI PR velocity (7d): 4
- Slop density: 2
- Churn contribution (14d reverted lines): 36
- Engagement depth (30d follow-up PRs): 6
- Review entertainment value: 3.6
- Merge optimism: 0.75
- Speculative maintenance ratio: 0.67
- Bot recidivism: 0
- Prompt compliance drift: 2
- Avg time to first review (hours): 2.54
- Avg time to merge (hours): 15.61
- Linked issues observed: 8
- Hottest surface: docs (4)
- Top AI family: copilot (1)
- Recent AI PRs: 12, 18, 21, 24
<!-- METRICS:END -->
