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
- `attributionSignals`: evidence used by sync or local attribution, such as `author-pattern`, `body-pattern`, `title-pattern`, `label-pattern`, or `bot-author`
- `attributionSource`: `maintainer-override` or `inferred`, so consumers can distinguish recorded intent from a heuristic

## Churn And Review Fields

- `firstReviewedAt`
- `firstCommentedAt`
- `linesAdded`
- `linesDeleted`
- `revertedLines`
- `commentCount`
- `reviewCommentCount`
- `timeToFirstReviewHours`
- `timeToFirstCommentHours`
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
- The top-level document must be a JSON array and each record must be an object. When present, `number` must be numeric and list fields must be arrays or comma-separated strings.
- Normalization fills in compatible missing defaults, but malformed source data is rejected at the file boundary and leaves the last valid file intact during sync.
- `timeToFirstReviewHours` is derived only from formal review events. Comments are recorded separately so dashboard consumers can choose the metric they need.
- Generic automation is not automatically AI-authored. Preserve explicit maintainer overrides and inspect `attributionSignals` before relying on inferred attribution.
