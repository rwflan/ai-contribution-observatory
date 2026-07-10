const http = require('http')
const { checkAdminAccess } = require('./auth')
const { ObservationDataError, getObservationHealth } = require('./observation-store')
const { buildRawSnapshot, buildSnapshot, defaultObservationPath, readObservations } = require('./metrics')

const defaultHost = process.env.OBSERVATORY_HOST || '127.0.0.1'
const defaultPort = Number(process.env.PORT || 3000)

const endpoints = [
  { path: '/', audience: 'public', description: 'API discovery' },
  { path: '/healthz', audience: 'public', description: 'Service and observation-source health' },
  { path: '/metrics', audience: 'public', description: 'Curated dashboard metrics' },
  { path: '/metrics/curated', audience: 'public', description: 'Curated dashboard metrics' },
  { path: '/metrics/raw', audience: 'admin', description: 'Raw normalized observations and metrics' },
  { path: '/metrics/history', audience: 'admin', description: 'Stored source observations' },
  { path: '/admin', audience: 'admin', description: 'Restricted diagnostics and curated metrics' }
]

function sendJson(res, status, payload, headers = {}) {
  const body = JSON.stringify(payload)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'x-content-type-options': 'nosniff',
    ...headers
  })
  res.end(body)
}

function requestLogger(req, status, error) {
  const entry = {
    event: 'http_request',
    method: req.method,
    path: new URL(req.url, 'http://localhost').pathname,
    status
  }

  if (error) {
    entry.errorCode = error.code || 'INTERNAL_ERROR'
  }

  console.error(JSON.stringify(entry))
}

function requireAdmin(req, res) {
  const access = checkAdminAccess(req)

  if (access.ok) {
    return true
  }

  const status = access.mode === 'disabled' ? 503 : 401
  sendJson(res, status, {
    ok: false,
    error: access.mode === 'disabled' ? 'ADMIN_DISABLED' : 'UNAUTHORIZED'
  }, status === 401 ? { 'www-authenticate': 'ObservatoryToken' } : {})
  requestLogger(req, status)
  return false
}

function createServer(options = {}) {
  const observationPath = options.observationPath || defaultObservationPath

  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost')
    const path = url.pathname.replace(/\/+$/, '') || '/'

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      sendJson(res, 405, { error: 'METHOD_NOT_ALLOWED' }, { allow: 'GET, HEAD' })
      requestLogger(req, 405)
      return
    }

    let status = 200

    try {
      if (path === '/') {
        sendJson(res, 200, {
          name: 'ai-contribution-observatory',
          status: 'experimental',
          endpoints
        }, { 'cache-control': 'no-store' })
      } else if (path === '/healthz') {
        const health = getObservationHealth(observationPath)
        status = health.ok ? 200 : 503
        sendJson(res, status, { service: health.ok ? 'ok' : 'degraded', ...health }, { 'cache-control': 'no-store' })
      } else if (path === '/metrics' || path === '/metrics/curated') {
        sendJson(res, 200, buildSnapshot({ filePath: observationPath }), { 'cache-control': 'public, max-age=60' })
      } else if (path === '/metrics/raw') {
        if (!requireAdmin(req, res)) return
        sendJson(res, 200, buildRawSnapshot({ filePath: observationPath }), { 'cache-control': 'no-store' })
      } else if (path === '/metrics/history') {
        if (!requireAdmin(req, res)) return
        sendJson(res, 200, { observations: readObservations(observationPath) }, { 'cache-control': 'no-store' })
      } else if (path === '/admin') {
        if (!requireAdmin(req, res)) return
        sendJson(res, 200, {
          ok: true,
          health: getObservationHealth(observationPath),
          snapshot: buildSnapshot({ filePath: observationPath })
        }, { 'cache-control': 'no-store' })
      } else {
        status = 404
        sendJson(res, status, { error: 'NOT_FOUND' })
      }
    } catch (error) {
      const status = error instanceof ObservationDataError ? 503 : 500
      sendJson(res, status, { error: error.code || 'INTERNAL_ERROR' })
      requestLogger(req, status, error)
      return
    }

    requestLogger(req, status)
  })
}

function startServer(options = {}) {
  const server = createServer(options)
  const port = options.port || defaultPort
  const host = options.host || defaultHost

  server.listen(port, host, () => {
    console.log(JSON.stringify({ event: 'observatory_listening', host, port }))
  })

  return server
}

if (require.main === module) {
  startServer()
}

module.exports = {
  createServer,
  endpoints,
  startServer
}
