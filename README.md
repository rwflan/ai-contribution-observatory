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

The repository scaffold is in place and the detailed rollout is in [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md).

Do not deploy this project to production or trust the dependency choices in this repository.
