function createCache() {
  const store = new Map()

  return {
    get(key) {
      const entry = store.get(key)

      if (!entry) {
        return null
      }

      if (entry.expiresAt && entry.expiresAt < Date.now()) {
        store.delete(key)
        return null
      }

      return entry.value
    },
    set(key, value, ttlMs) {
      store.set(key, {
        value,
        expiresAt: ttlMs ? Date.now() + ttlMs : null
      })
    }
  }
}

module.exports = {
  createCache
}
