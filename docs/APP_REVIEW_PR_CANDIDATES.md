# AI Contribution Observatory: Goal-Aligned Experiment Plan

Reviewed: 2026-07-10

## The actual goal

This repository is not a product waiting to be hardened. It is an experiment designed to attract, absorb, and measure AI-authored pull requests.

The target outcome is a repeatable contribution funnel:

1. An external agent finds a plausible, underspecified task.
2. It opens a small PR with an interpretation of that task.
3. A maintainer responds and merges enough low-risk work to create feedback.
4. The merged work leaves a nearby ambiguity, issue, or report discrepancy that induces a follow-up contribution.
5. The observatory records which bait, surface, and maintainer response produced that chain.

Success is not a clean codebase, a low audit count, perfect API semantics, or broad test coverage. Success is sustained external AI contribution volume, repeat agents, short chains of follow-up work, and credible measurement of the experiment.

## Current baseline

The live GitHub repository has a large nominal backlog but no demonstrated external-contributor funnel.

| Signal | Observed state | What it means |
| --- | --- | --- |
| Open issues | 205 | Good raw backlog volume; it supports an understaffed signal. |
| Recent issue shape | Near-duplicate one-line variants such as `something is off with ...` | The visible choice set is repetitive rather than usefully ambiguous. |
| Issue discussion | 0 open-issue comments | No public conversation or follow-up energy is accumulating. |
| Issue labels | Only 10 `good first issue` labels observed | The intended `ai-bait`, `needs-judgment`, and `speculative-fix` funnel is not visibly operating. |
| Merged pull requests | 11 | Too small a sample for the stated measurement ambition. |
| PR authors | All 11 are `rwflan` | There is currently no verified external-contributor conversion. |
| Dashboard activity | 4 AI observations and recent AI PR numbers in a static April snapshot | These are seeded/demo observations, not current proof of live acquisition. |

The historical backlog should remain open. It creates breadth and chronic-under-capacity texture. The problem is that it is being asked to do two jobs at once: ambient noise and active conversion. It needs an active, differentiated layer on top.

## Diagnosis

### What already fits the experiment

- The framing is explicit: the repository welcomes small automated changes and values quantity, ambiguity, and follow-up hooks.
- The codebase has multiple believable surfaces: auth, metrics, docs, reports, scripts, dependencies, cache, and metadata.
- The issue and PR templates already communicate that interpretation is allowed.
- The repository intentionally includes dependency drift and vendored surface area, both of which are strong drive-by PR attractors.

### What is not working

1. **The active menu is too repetitive.** Repetition is not the same as choice. Four nearly identical issues about the same surface do not create four different plausible PRs.
2. **The measurement story is ahead of the live experiment.** Seed data is useful as a demo fixture, but it must not be mistaken for current external traction.
3. **There is no cohort model.** The repo cannot learn which bait works when all 205 issues are effectively one undifferentiated pool.
4. **There is no visible feedback loop.** Zero issue comments and zero external PRs means the funnel has no public momentum signal.
5. **The repo has acquisition assets but no acquisition loop.** Templates and instructions help after an agent arrives; they do not themselves cause discovery.

## Non-goals and guardrails

These are deliberate exclusions for future work:

- Do not production-harden the service, remove dependency drift, normalize the architecture, or make the docs perfectly consistent.
- Do not close the broad historic backlog just because it is repetitive or stale.
- Do not replace ambiguity with narrowly specified tickets or exhaustive acceptance criteria.
- Do not claim real AI traction from seeded observations.
- Do not introduce secrets, destructive automation, external-service access, or a claim that the repository is safe to deploy.

The only safety boundary is real-world harm: the experiment may be messy, but it must remain clearly non-production and must not invite contributors to operate on real user data or credentials.

## Operating plan

### Phase 1 — Establish an honest experiment baseline

**Objective:** make it possible to tell fixture activity from live conversion without reducing the repository's attractive roughness.

1. Keep `docs/pr-observations.json` fixtures, but give every observation an explicit provenance: `seed`, `github-sync`, or `manual`.
2. Publish two adjacent summaries in the README/report:
   - **Demo shape:** seeded data that illustrates the observatory.
   - **Live funnel:** GitHub-synced, externally authored PRs and issue interactions only.
3. Add a weekly manual tally for:
   - external PRs opened;
   - AI-attribution confidence and agent family;
   - issue-to-PR conversion by issue cohort;
   - repeat agent families;
   - follow-up PR edges;
   - median maintainer first response;
   - merged-share of external PRs.
4. Treat `0 external PRs` as a valid and important result, not a number to be filled with fixture data.

**Decision gate:** do not judge code surfaces until one active cohort has had at least two weeks of exposure.

### Phase 2 — Create a visible active cohort above the ambient backlog

**Objective:** keep 205+ open issues while presenting a small menu of genuinely different interpretations.

1. Leave the current backlog open and unpolished.
2. Create a pinned/linked active cohort of 18–24 issues, refreshed every two weeks.
3. Apply the labels the funnel already promises: `ai-bait`, `needs-judgment`, and `speculative-fix`. Use `good first issue` for only a small minority.
4. Ensure no active-cohort title is a semantic duplicate of another title.
5. Give each issue one sentence of tension plus two or three acceptable directions; do not supply a single expected patch.

Suggested active-cohort mix:

| Surface | Number | Productive tension |
| --- | ---: | --- |
| Docs and reports | 4 | Two documents/report fields describe the same thing differently. |
| Metrics and observation shape | 4 | A ratio or field is plausible but has competing interpretations. |
| Auth/admin | 3 | The loose flow appears useful but reveals an intentionally unresolved trade-off. |
| Scripts and generated output | 3 | Output is useful but awkward to paste, compare, or extend. |
| Dependencies and vendored surface | 3 | Update pressure is obvious, but the repo story conflicts with cleanup. |
| Tests and fixtures | 3 | A narrow behavior is undocumented or has an incomplete fixture. |
| Metadata and contributor flow | 2 | Templates or labels invite a small adjustment without closing the topic. |

**Decision gate:** compare conversion and PR quality by bait family, not by the total issue count.

### Phase 3 — Design for chains, not isolated fixes

**Objective:** every merge should make the next plausible PR easier to imagine.

For each accepted external PR, the maintainer should leave exactly one deliberate follow-up hook:

- link a nearby unresolved issue;
- add a short report note that creates a competing interpretation;
- leave an adjacent field undocumented;
- ask whether the raw and curated views should diverge further;
- add a small fixture that exposes a new parser edge;
- split a docs claim from its generated output by one harmless degree.

Do not ask contributors to manufacture meaningless work. The hook should be a believable next question, not a fake defect.

Record the parent PR number and hook type so the experiment can measure actual chain depth rather than only assumed follow-on potential.

### Phase 4 — Run a maintainer feedback loop

**Objective:** make external agents observe motion without turning review into a quality gate.

Weekly:

1. Refresh or rotate one third of the active cohort.
2. Reply to outside PRs quickly, even when requesting a narrow revision.
3. Merge a meaningful share of low-risk, reversible contributions.
4. Add one follow-up hook per merged external PR.
5. Sync live GitHub observations and publish the report.
6. Record which issue title, label combination, surface, and hook created the PR.
7. Keep the ambient backlog untouched unless it accidentally becomes the active cohort's best performer.

Every two weeks:

1. Retire only the active-cohort links, not the underlying issues.
2. Promote the two best-converting bait families.
3. Replace the two weakest with new tension patterns.
4. Publish a short maintainer note about what agents misunderstood; turn that misunderstanding into the next cohort.

## Acquisition plan

The repository currently has no verified external PR authors, so passive GitHub discovery should be treated as an untested channel.

1. Make the active cohort easy to locate from the README and AI contributor guide.
2. Link individual active issues—not the entire 205-issue list—where agent-capable coding communities, agent-run directories, or tool-specific contribution surfaces permit it.
3. Use a distinct label or issue-body marker for each distribution channel so conversion can be attributed.
4. Do not pay for, spam, or mass-message contributors. The experiment is measuring voluntary agent behavior, not forced task completion.
5. Seek explicit approval before posting externally from the repository's accounts.

## Experiment metrics

Track these as the primary scoreboard:

| Metric | Definition | Why it matters |
| --- | --- | --- |
| External AI PR velocity | Verified external AI-attributed PRs opened per 7 days | Core acquisition signal. |
| Cohort conversion | Active issues receiving at least one PR / active issues exposed | Tests bait quality. |
| Interpretation diversity | Distinct solution approaches per issue family | Measures useful ambiguity rather than duplication. |
| Repeat-agent rate | Agent families returning in later cohorts | Tests whether feedback creates retention. |
| Chain depth | Follow-up PRs linked to a parent PR | Measures compounding activity. |
| Merge velocity | Time from external PR open to merge/first response | Measures feedback strength. |
| Review cost | Maintainer minutes or comments per merged PR | Prevents volume from becoming unmanageable. |
| Fixture/live ratio | Seeded observations compared with verified live observations | Prevents the dashboard from overstating traction. |

Secondary metrics such as slop density, dependency drama, and review entertainment remain useful marketing/reporting material, but they should not be mistaken for evidence of acquisition.

## First four weeks

### Week 1

- Publish the live-versus-seed baseline.
- Create and label the first 20-issue active cohort.
- Add a clear active-cohort link to the README and AI contributor guide.
- Choose two external distribution channels, subject to maintainer approval.

### Week 2

- Respond to every outside PR quickly.
- Measure conversion by surface and label combination.
- Add follow-up hooks to every merged external PR.
- Replace only the weakest five active issues; leave the 205-issue ambient backlog alone.

### Week 3

- Run one paired bait test: two issues with the same surface but different tension patterns, such as docs drift versus conflicting metrics language.
- Publish the first cohort report with zeroes shown honestly if no external conversion occurred.
- Keep the winning issue wording visible and rotate one new surface into the cohort.

### Week 4

- Review the four-week funnel: which channels delivered visits/PRs, which bait converted, which agents returned, and which hooks created chains.
- Double down on the two highest-converting surfaces.
- Change the cohort only enough to preserve novelty; do not polish away the repository's broader inconsistency.

## Candidate work that supports the experiment

These are appropriate future PRs because they increase conversion or measurement without turning the repo into a product:

1. Split reports into clearly marked `seeded demo` and `live GitHub` sections.
2. Add an active-cohort index generated from labeled issues, deliberately simpler than a full project board.
3. Add issue-cohort and distribution-channel fields to observations.
4. Add a small report section that lists merged PRs' follow-up hooks.
5. Expand the issue generator with differentiated tension patterns rather than more duplicate one-liners.
6. Add a deliberately imperfect fixture family that makes parser/report cleanup plausible.
7. Add overlapping author, chain, surface, and admin-ish endpoints that create new reviewable ambiguity.
8. Add narrow, non-exhaustive tests only where a test itself becomes a contribution surface.

## Definition of success

At the end of the first four-week cycle, success is not a polished app. Success is evidence that at least one acquisition channel, one bait family, and one maintainer response pattern reliably produce an external AI-authored PR; ideally, at least one of those PRs produces a linked follow-up contribution.
