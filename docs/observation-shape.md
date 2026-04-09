# Observation Shape

The observatory stores pull request observations in [docs/pr-observations.json](./pr-observations.json).

The file is intentionally lightweight, but the shape is now rich enough to describe where automated work lands and how that work behaves after review.

## Core Fields

- `number`: pull request number
- `title`: pull request title
- `author`: display author string
- `openedAt`: PR open timestamp
- `mergedAt`: PR merge timestamp when applicable
- `closedAt`: PR close timestamp when applicable
- `state`: `open`, `closed`, or `merged`
- `labels`: loose label list
- `aiAuthored`: explicit maintainer override for whether the PR is AI-authored

## Attribution Fields

- `repository`: source repository slug
- `source`: where the observation came from, such as `seed`, `github-sync`, or `manual`
- `url`: pull request URL when the observation came from GitHub
- `authorType`: broad category like `human`, `bot`, or `ai`
- `agentFamily`: normalized contributor family such as `copilot`, `claude`, `gpt`, or `devin`
- `confidence`: maintainer confidence in the AI attribution

## Churn And Review Fields

- `firstReviewedAt`
- `linesAdded`
- `linesDeleted`
- `revertedLines`
- `commentCount`
- `reviewCommentCount`
- `timeToFirstReviewHours`
- `timeToMergeHours`
- `reviewEntertainmentScore`
- `triageMood`
- `maintainerNote`

## Surface-Area Fields

- `linkedIssues`: related issue numbers or identifiers
- `changedFiles`: list of touched files when known
- `changedAreas`: normalized surface tags such as `auth`, `performance`, `docs`, `metrics`, `dependencies`, or `admin`
- `dependencyTouched`
- `docsTouched`
- `authTouched`
- `performanceTouched`

## Follow-On Fields

- `followUpPrsTriggered`
- `followOnPotential`
- `followOnSourcePr`
- `speculativeFix`
- `promptComplianceScore`
- `tone`

## Compatibility Notes

- Older observations may omit any of the newer fields.
- Normalization fills in missing defaults rather than rejecting the record.
- The schema is permissive on purpose because future GitHub sync payloads will arrive with uneven detail.
