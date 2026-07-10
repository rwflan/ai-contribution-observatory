const crypto = require('crypto')

function extractToken(req) {
  const headerToken = req.headers['x-observatory-token']
  return typeof headerToken === 'string' ? headerToken : ''
}

function tokensMatch(provided, expected) {
  const providedBuffer = Buffer.from(provided)
  const expectedBuffer = Buffer.from(expected)

  return providedBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(providedBuffer, expectedBuffer)
}

function checkAdminAccess(req) {
  const expected = process.env.OBSERVATORY_ADMIN_TOKEN
  const token = extractToken(req)

  if (!expected) {
    return { ok: false, mode: 'disabled' }
  }

  return {
    ok: tokensMatch(token, expected),
    mode: token ? 'provided-token' : 'missing-token'
  }
}

module.exports = {
  checkAdminAccess
}
