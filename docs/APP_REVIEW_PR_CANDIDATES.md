# Application Review: PR Candidates

Reviewed: 2026-07-10

## Scope and evidence

This review covered the Node HTTP service, metrics normalisation and caching, GitHub sync and reporting scripts, package metadata, and the API documentation. It is a candidate backlog, not an implementation plan: each item is independently reviewable and should be split into its own pull request.

The service was started locally on port 3000 and exercised with real HTTP requests and a headed browser session. `/`, `/metrics`, `/metrics/raw`, `/metrics/curated`, `/metrics/history`, and `/admin` all responded. The UI is currently a JSON API rather than a rendered application; the browser confirmed that the metrics payload is directly visible and parseable.

Checks run:

- `node --check` for every source and script file: passed.
- `npm audit --json`: 9 production dependency vulnerabilities (1 critical, 5 high, 3 low).
- `npm run seed:issues`: completed and produced 45 issue payloads.
- `node scripts/sync-github-observations.mjs --dry-run --limit 5`: completed without writing.
- Focused runtime probes of route matching, methods, authorisation, and metrics edge cases.

The bundled Playwright shell wrapper could not run because this Windows machine has no WSL distribution. The equivalent `npx --package @playwright/cli playwright-cli` flow opened `/metrics`, took a DOM snapshot, and confirmed the live JSON response.

## Priority guide

- **P0**: resolve before binding the service to an untrusted network or treating its output as a trusted source.
- **P1**: confirmed correctness, API, or data-integrity failure in the present app.
- **P2**: materially improves usability, observability, or maintainability.
- **P3**: useful follow-up once the above work is complete.

## Candidate PRs

### P0 — Establish a safe dependency baseline or explicitly isolate the experiment

**Evidence.** `npm audit` reports 9 production vulnerabilities: one critical finding in direct dependency `minimist@0.0.8`, five high-severity findings (including direct `lodash@4.17.15` and the `express@4.16.4` tree), and three low-severity findings. `express`, `lodash`, and `minimist` have no runtime import in `src/` or `scripts/`; the server uses Node's built-in `http` module. `IMPLEMENTATION_PLAN.md` states that older packages are intentionally used as contribution bait, so this needs an explicit product decision rather than a silent version bump.

**Candidate scope.** Either remove the three unused runtime dependencies and regenerate the lockfile, or move the intentionally vulnerable fixture into a clearly non-runnable, isolated example package. If a dependency is retained, upgrade it to a currently supported non-vulnerable version and document why it remains.

**Acceptance criteria.** `npm audit --omit=dev` reports no known production vulnerabilities; `npm start`, reporting, issue seeding, and GitHub-sync dry-run still work; the README accurately describes the remaining experiment boundary.

### P0 — Disable the default admin credential and remove credentials from URLs

**Evidence.** `src/auth.js` falls back to the predictable token `let-me-in`. Live `GET /admin?token=let-me-in` returned 200 and a snapshot. Tokens in query strings are commonly retained in browser history, access logs, proxies, and referrer data. `server.listen(port)` does not restrict the service to loopback by default.

**Candidate scope.** Treat an unset `OBSERVATORY_ADMIN_TOKEN` as admin-disabled (or fail startup in an explicitly non-local mode), accept an admin token only through a header, compare fixed-length secrets safely, and bind to loopback by default with an explicit opt-in for external listening.

**Acceptance criteria.** An unset token cannot grant access; a query-string token never authenticates; a valid header token grants only the documented admin route; integration tests cover disabled, denied, and allowed states.

### P1 — Make route matching and HTTP method handling deterministic

**Evidence.** Route dispatch compares the complete `req.url` string. Live `GET /metrics?probe=1` and `GET /metrics/` incorrectly returned the landing payload rather than metrics. Live `POST /metrics` returned 200 with the normal GET body. `GET /administrator?token=let-me-in` also returned a successful admin response because the server checks `startsWith('/admin')`.

**Candidate scope.** Parse the URL once with `new URL(req.url, base)`, dispatch on `pathname`, restrict read endpoints to `GET` (and optionally `HEAD`), use exact admin paths, return JSON 404 for unknown paths, and return 405 plus an `Allow` header for unsupported methods.

**Acceptance criteria.** Query strings do not change endpoint selection; `/administrator` is a 404; POST to metrics is 405; all advertised endpoints and a representative unknown route have integration coverage.

### P1 — Correct the metrics-cache key for inline observations

**Evidence.** `buildSnapshot()` caches using only file path, `now`, and inline observation count. A focused runtime probe built a snapshot from one human observation and then one AI observation at the same timestamp. The second result incorrectly retained `aiObservationCount: 0` and `authorTypeBreakdown: { human: 1 }` from the first call.

**Candidate scope.** Do not cache caller-supplied observation arrays, or derive a content-based key that cannot collide. Keep the small TTL only for the file-backed server path and include a file revision signal such as mtime in that cache key.

**Acceptance criteria.** Two equal-length but different inline inputs never share a snapshot; file updates are visible without waiting for a stale cache entry; cache behaviour is covered by deterministic unit tests.

### P1 — Make time-window metrics reject future data and preserve zero durations

**Evidence.** `pickRecent()` only checks `daysBetween(now, date) <= days`. A future AI observation dated 2099 was counted in 7-day velocity. The same one-sided comparison is used for 14-day churn and 30-day engagement windows. In normalisation, `normalizeNumeric(value) || fallback` turns valid `0` review and merge durations into `null`; a probe with both fields set to zero yielded null averages.

**Candidate scope.** Introduce a shared inclusive window predicate (`0 <= age <= window`) and preserve `0` with nullish checks rather than truthiness. Decide and document whether future timestamps should be excluded, flagged, or rejected during sync.

**Acceptance criteria.** Future observations affect no recent-window metric; exactly-now and boundary-date observations behave consistently; zero-hour review and merge values are included in averages; tests cover negative, zero, boundary, and invalid dates.

### P1 — Define public versus restricted observation data

**Evidence.** Live `/metrics/raw` returned about 21 KB and `/metrics/history` about 14 KB, compared with about 4.6 KB for `/metrics/curated`. The raw/history responses include full observation bodies and can include `maintainerNote`, while both routes are publicly reachable. The existing data happens to be GitHub-oriented, but the schema explicitly supports locally added maintainer annotations.

**Candidate scope.** Publish a deliberate data-classification policy. Make raw/history admin-only, or create a public redacted history shape that strips note/body fields and returns only dashboard-safe fields. Add `Cache-Control` appropriate to the chosen sensitivity and freshness policy.

**Acceptance criteria.** Every endpoint has a documented audience; unauthenticated responses cannot reveal private annotations; public response examples are redacted; tests assert the restricted fields never appear in public responses.

### P1 — Add resilient observation loading, validation, and atomic sync writes

**Evidence.** `readObservations()` performs unguarded `JSON.parse` inside the request path. A malformed or partially written `docs/pr-observations.json` would throw rather than return a controlled service error. The GitHub sync writes the destination file directly with `writeFileSync`, so an interrupted write can create exactly that failure mode. Normalisation also accepts a broad range of unvalidated shapes and silently invents defaults.

**Candidate scope.** Validate observations at the file boundary with a small explicit schema; return a structured 500/503 and log the validation failure rather than crashing a request handler; write sync output to a temporary file, validate it, then rename atomically. Preserve a last-known-good snapshot if appropriate.

**Acceptance criteria.** Malformed JSON, a non-array root, and invalid records have defined error behaviour; a failed sync leaves the previous file intact; validation errors name the affected record/field without exposing secrets; failure paths have integration tests.

### P1 — Add an automated test and CI baseline

**Evidence.** `package.json` has no `test`, lint, or CI verification script. The bugs above are small pure-function and HTTP-routing regressions that a lightweight Node test suite would have caught.

**Candidate scope.** Use Node's built-in `node:test` first to keep the repository small. Add unit tests for metrics/normalisation/cache and HTTP integration tests that start the server on an ephemeral port. Add a GitHub Actions workflow that runs syntax checks, tests, and the dependency audit policy.

**Acceptance criteria.** `npm test` is documented and passes from a clean clone; the cache, date, zero-value, route, and admin cases above are covered; pull requests receive a required or clearly visible CI result.

### P1 — Provide a Windows-safe non-mutating GitHub sync command

**Evidence.** The documented command `npm run sync:github -- --dry-run --limit 5` was interpreted by the installed npm/PowerShell combination as `node scripts/sync-github-observations.mjs 5`: it ignored `--dry-run` and wrote three current PR observations. The exact direct Node invocation, `node scripts/sync-github-observations.mjs --dry-run --limit 5`, correctly reported `dryRun: true` and made no change.

**Candidate scope.** Add a dedicated `sync:github:dry-run` script with no forwarded flags, document platform-safe forms for optional arguments, and make the script print an unmistakable write/dry-run banner before doing network work. Consider requiring an explicit `--write` flag so the safe action is the default.

**Acceptance criteria.** The documented Windows PowerShell command cannot write data; dry-run behaviour is tested by asserting the observation file hash is unchanged; the write path requires an intentional opt-in.

### P2 — Measure first review, not first non-author comment

**Evidence.** `findFirstReviewTime()` combines issue comments and formal review events, then chooses the earliest non-author event. A casual maintainer comment therefore counts as a code review and understates time-to-first-review.

**Candidate scope.** Define the metric in `docs/observation-shape.md`; either use only submitted review events or publish separate `timeToFirstCommentHours` and `timeToFirstReviewHours`. Preserve the source event type for auditability.

**Acceptance criteria.** A comment before a later review does not reduce the review-duration metric; comment and review metrics can be independently inspected; fixture tests use both event types.

### P2 — Harden GitHub-sync failure reporting and scale behaviour

**Evidence.** The sync invokes `gh pr view` sequentially for every listed pull request and throws raw child-process errors. It has no timeout, rate-limit handling, retry policy, or useful partial-failure summary. The limit defaults to 25 but is user-controlled and unbounded above.

**Candidate scope.** Validate a reasonable maximum limit, add a bounded-concurrency fetch pool, wrap `gh` failures with actionable context, and decide whether a partially fetched dataset should fail completely or write only after a clear confirmation. Add an optional machine-readable error/result summary.

**Acceptance criteria.** Missing `gh` authentication, a single failed PR lookup, and API rate-limit responses produce clear non-zero results without corrupting the observation file; large limits do not run unbounded sequential work; behaviour is documented.

### P2 — Document the actual API contract and add machine-readable discovery

**Evidence.** `docs/api-draft.md` lists only `/metrics`, `/metrics/history`, and `/admin`, while the live service also exposes `/metrics/raw` and `/metrics/curated`. It labels all shapes as uncertain, and the root endpoint omits `/admin` entirely. Consumers cannot tell which response is stable, public, cached, or raw.

**Candidate scope.** Replace the draft with an accurate endpoint table covering methods, auth, cache/freshness, status codes, and response schemas. Align the root discovery response with that table, or remove discovery if it is not intended as an API contract. Consider OpenAPI only if downstream tooling needs it.

**Acceptance criteria.** Documentation enumerates every live route and response audience; examples validate against the service; a test or generated artifact prevents implementation/documentation drift.

### P2 — Make AI attribution auditable and reduce false positives

**Evidence.** Local attribution classifies any author containing `bot` as AI-authored and any label containing `ai` as an AI signal. These broad heuristics can classify unrelated automation or labels incorrectly. The sync script calculates signal names but does not persist them in the observation, making a result difficult to audit later.

**Candidate scope.** Persist attribution signals and confidence provenance, distinguish generic automation from AI authorship, use exact/curated labels where possible, and expose an override workflow. Report an `unknown` or `automation` category rather than forcing a human/AI binary when evidence is weak.

**Acceptance criteria.** Known generic bots are not silently counted as AI; every inferred attribution has inspectable evidence; manual overrides survive sync; fixtures cover false-positive and false-negative cases.

### P3 — Add operational health and error observability

**Evidence.** Startup logs only the port. Request failures, parse errors, source freshness, cache state, and GitHub-sync outcomes have no structured operational signals. The existing metrics endpoint describes contribution data rather than service health.

**Candidate scope.** Add a minimal `/healthz` endpoint and structured error logging. Include source-file freshness and a non-sensitive last-sync result in a restricted diagnostics response. Keep public health responses free of observation data and credentials.

**Acceptance criteria.** Operators can distinguish a healthy empty dataset from an unreadable dataset; failed syncs are diagnosable from one log/result; health checks do not expose raw observations or admin state.

## Suggested delivery order

1. Decide whether the intentionally vulnerable dependency fixture stays in the runnable app. If not, deliver the dependency and admin-boundary P0 work first.
2. Add the test baseline before or alongside the cache, window, and routing corrections so their observed behaviour cannot return.
3. Define the public data contract before expanding dashboards or external integrations.
4. Make sync safe-by-default, then improve its accuracy and operational robustness.
5. Finish documentation and health visibility once endpoint semantics settle.

## Deliberately not called defects

The JSON-only browser presentation, deliberately broad issue backlog, and intentionally playful metric names fit the repository's stated experiment. They become product defects only if the project changes its goal from contribution experiment to a production dashboard. The P0 items are still important because the current code can be exposed by an ordinary Node bind even if production use is disclaimed.
