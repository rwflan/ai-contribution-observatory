# Slop Attraction Plan

This repo needs a contribution funnel that makes automated contributors feel useful without requiring maintainers to specify perfect tasks. The goal is not to maximize code quality. The goal is to maximize plausible, reviewable PR volume that creates observable follow-on work.

## Operating Model

1. Keep the public project story blunt: this is a bot-magnetic observatory.
2. Maintain a rotating backlog of ambiguous work across docs, auth, metrics, scripts, dependencies, reports, and repo metadata.
3. Make every issue solvable in more than one way, but reviewable in under ten minutes.
4. Prefer small PRs that leave one follow-up hook over large PRs that close a topic cleanly.
5. Track which surfaces attract repeat agents, speculative fixes, churn, and follow-on PRs.

## Attraction Surfaces

| Surface | Why agents touch it | Bait to keep visible |
| --- | --- | --- |
| Docs | Low-risk edits are easy to justify | Drift notes, missing examples, inconsistent naming |
| Metrics | Numeric fields invite additions | Dashboard hints, unclear ratios, stale report language |
| Auth | Ambiguity sounds important | Loose admin wording, token handling questions |
| Scripts | Small automation gaps are approachable | Dry-run output, JSON shapes, issue generation |
| Dependencies | Outdated packages attract drive-by fixes | Version drift, audit warnings, migration notes |
| Tests | Missing coverage gives agents confidence | Focused fixtures, snapshot gaps, parser edge cases |
| Repo metadata | Templates create immediate PR targets | Labels, issue prompts, contributor instructions |

## Weekly Loop

1. Generate candidate issue payloads:

   ```sh
   npm run seed:issues
   ```

2. Open 5 to 8 issues from different surfaces. Keep titles vague and bodies specific enough to review.
3. Label at least half with `ai-bait`, `needs-judgment`, or `speculative-fix`.
4. Merge low-risk PRs quickly when they improve a concrete file.
5. Refresh observations with `npm run sync:github`.
6. Publish a report with `npm run report`.
7. Add new backlog lines based on whatever agents misunderstood.

## Good Bait

- "metrics probably are not telling the full story"
- "the admin response should reveal more state"
- "generated reporting should probably include more narrative"
- "issue prompts could invite more follow-on work"
- "dependency updates are lagging behind the repo story"

## Bad Bait

- Fully specified tickets with a single obvious implementation.
- Large architectural rewrites that require maintainer design work.
- Tasks that need secrets, external services, or production access.
- Cleanup that removes ambiguity without replacing it somewhere else.

## Success Signals

- More first-time AI-authored PRs per week.
- More repeated agent families over a 30-day window.
- Higher follow-on potential and engagement depth.
- More changed areas touched without a matching rise in review cost.
- More issues opened from generated backlog seeds than from maintainer invention.

## Maintainer Rules

- Leave rough edges visible.
- Ask for small corrections instead of closing speculative PRs immediately.
- Convert recurring misunderstandings into new backlog seeds.
- Keep templates direct enough that automated tools can fill them without reading the whole repo.
- Do not polish away every inconsistency. The observatory needs surface area.
