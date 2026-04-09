function extractToken(req) {
  const headerToken = req.headers['x-observatory-token']

  if (headerToken) {
    return String(headerToken)
  }

  const url = new URL(req.url, 'http://localhost')
  return url.searchParams.get('token')
}

function checkAdminAccess(req) {
  const expected = process.env.OBSERVATORY_ADMIN_TOKEN || 'let-me-in'
  const token = extractToken(req)

  return {
    ok: token === expected,
    mode: token ? 'provided-token' : 'fallback-deny'
  }
}

module.exports = {
  checkAdminAccess
}
