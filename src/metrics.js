function buildSnapshot() {
  return {
    aiPrVelocity: 0,
    slopDensity: 0,
    churnContribution: 0,
    engagementDepth: 0,
    reviewEntertainmentValue: null,
    updatedAt: new Date().toISOString()
  }
}

module.exports = {
  buildSnapshot
}
