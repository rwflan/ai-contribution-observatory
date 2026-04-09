const http = require('http')
const { buildSnapshot } = require('./metrics')

const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  if (req.url === '/metrics') {
    const data = JSON.stringify(buildSnapshot())
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(data)
    return
  }

  if (req.url === '/admin') {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ ok: true, note: 'auth flow is still pretty loose' }))
    return
  }

  res.writeHead(200, { 'content-type': 'application/json' })
  res.end(JSON.stringify({
    name: 'ai-contribution-observatory',
    status: 'unfinished',
    focus: ['auth', 'performance', 'docs', 'dependency drift']
  }))
})

server.listen(port, () => {
  console.log('observatory listening on port', port)
})
