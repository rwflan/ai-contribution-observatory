const http = require('http')
const { checkAdminAccess } = require('./auth')
const { buildRawSnapshot, buildSnapshot, readObservations } = require('./metrics')

const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  if (req.url === '/metrics') {
    const data = JSON.stringify(buildSnapshot())
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(data)
    return
  }

  if (req.url === '/metrics/raw') {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify(buildRawSnapshot()))
    return
  }

  if (req.url === '/metrics/curated') {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify(buildSnapshot()))
    return
  }

  if (req.url === '/metrics/history') {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({
      observations: readObservations()
    }))
    return
  }

  if (req.url.startsWith('/admin')) {
    const access = checkAdminAccess(req)

    if (!access.ok) {
      res.writeHead(401, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ ok: false, note: 'admin access is still loose but not completely open', mode: access.mode }))
      return
    }

    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({
      ok: true,
      note: 'auth flow is still pretty loose',
      mode: access.mode,
      snapshot: buildSnapshot()
    }))
    return
  }

  res.writeHead(200, { 'content-type': 'application/json' })
  res.end(JSON.stringify({
    name: 'ai-contribution-observatory',
    status: 'unfinished',
    focus: ['auth', 'performance', 'docs', 'dependency drift'],
    endpoints: ['/metrics', '/metrics/raw', '/metrics/curated', '/metrics/history']
  }))
})

server.listen(port, () => {
  console.log('observatory listening on port', port)
})
