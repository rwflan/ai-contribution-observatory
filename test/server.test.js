const fs = require('fs')
const http = require('http')
const os = require('os')
const path = require('path')
const test = require('node:test')
const assert = require('node:assert/strict')
const { createServer } = require('../src/server')

function request(port, requestPath, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port, path: requestPath, method: options.method || 'GET', headers: options.headers }, (res) => {
      let body = ''
      res.setEncoding('utf8')
      res.on('data', (chunk) => { body += chunk })
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: body ? JSON.parse(body) : null }))
    })
    req.on('error', reject)
    req.end()
  })
}

async function withServer(options, callback) {
  const server = createServer(options)
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  try {
    return await callback(server.address().port)
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
}

test('routes use the parsed pathname and reject unsupported methods', async () => {
  await withServer({}, async (port) => {
    const metrics = await request(port, '/metrics?probe=1')
    const post = await request(port, '/metrics', { method: 'POST' })
    const unknown = await request(port, '/administrator')

    assert.equal(metrics.status, 200)
    assert.ok('observationCount' in metrics.body)
    assert.equal(post.status, 405)
    assert.equal(post.headers.allow, 'GET, HEAD')
    assert.equal(unknown.status, 404)
  })
})

test('admin-only routes are disabled without a configured header token', async () => {
  const prior = process.env.OBSERVATORY_ADMIN_TOKEN
  delete process.env.OBSERVATORY_ADMIN_TOKEN
  try {
    await withServer({}, async (port) => {
      assert.equal((await request(port, '/metrics/raw')).status, 503)
      assert.equal((await request(port, '/admin?token=let-me-in')).status, 503)
    })
  } finally {
    if (prior === undefined) delete process.env.OBSERVATORY_ADMIN_TOKEN
    else process.env.OBSERVATORY_ADMIN_TOKEN = prior
  }
})

test('admin-only routes require the configured header token', async () => {
  const prior = process.env.OBSERVATORY_ADMIN_TOKEN
  process.env.OBSERVATORY_ADMIN_TOKEN = 'test-admin-token'
  try {
    await withServer({}, async (port) => {
      assert.equal((await request(port, '/metrics/raw?token=test-admin-token')).status, 401)
      const allowed = await request(port, '/metrics/raw', { headers: { 'x-observatory-token': 'test-admin-token' } })
      assert.equal(allowed.status, 200)
      assert.ok(Array.isArray(allowed.body.observations))
    })
  } finally {
    if (prior === undefined) delete process.env.OBSERVATORY_ADMIN_TOKEN
    else process.env.OBSERVATORY_ADMIN_TOKEN = prior
  }
})

test('unreadable observation data degrades without crashing the service', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'observatory-test-'))
  const observationPath = path.join(directory, 'observations.json')
  fs.writeFileSync(observationPath, '{broken', 'utf8')
  try {
    await withServer({ observationPath }, async (port) => {
      assert.equal((await request(port, '/healthz')).status, 503)
      assert.equal((await request(port, '/metrics')).status, 503)
    })
  } finally {
    fs.rmSync(directory, { recursive: true, force: true })
  }
})
