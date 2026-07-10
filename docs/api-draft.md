# API Contract

AI Contribution Observatory is an experimental, local-first JSON API. It binds to `127.0.0.1` by default. Set `OBSERVATORY_HOST` deliberately before exposing it on another interface.

All endpoints accept `GET` and `HEAD` only. Unknown routes return `404` JSON and unsupported methods return `405` with `Allow: GET, HEAD`.

## Public endpoints

| Endpoint | Cache policy | Response |
| --- | --- | --- |
| `GET /` | `no-store` | Service name, experimental status, and endpoint discovery metadata. |
| `GET /healthz` | `no-store` | `200` with source observation count/freshness, or `503` when the observation file is unreadable. |
| `GET /metrics` | `public, max-age=60` | Curated dashboard metrics. |
| `GET /metrics/curated` | `public, max-age=60` | Alias for `/metrics`. |

Public responses never include raw pull-request body text or maintainer notes.

## Restricted endpoints

`/metrics/raw`, `/metrics/history`, and `/admin` are disabled until `OBSERVATORY_ADMIN_TOKEN` is configured. When enabled, provide the exact token only in `X-Observatory-Token`; query-string credentials are deliberately ignored.

| Endpoint | Response |
| --- | --- |
| `GET /metrics/raw` | Normalized observations plus raw metrics. |
| `GET /metrics/history` | Stored observations before normalisation. |
| `GET /admin` | Observation-source health and curated metrics. |

Disabled admin access returns `503` with `ADMIN_DISABLED`. Missing or invalid credentials return `401` with `UNAUTHORIZED`. Restricted responses use `Cache-Control: no-store`.

## Error format

Errors are JSON objects with a stable `error` code. Observation-file parse and validation failures return `503` rather than crashing the request handler. Diagnostics are logged as structured JSON without tokens or observation payloads.

## Freshness and source data

Curated file-backed snapshots are cached briefly and keyed by the observation file revision. Callers that supply an inline observation array through the module API are never cached. Future-dated observations are excluded from recent-window metrics. See [observation-shape.md](./observation-shape.md) for the source-data contract.
