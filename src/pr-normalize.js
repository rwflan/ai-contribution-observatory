function normalizeObservation(observation, helpers) {
  const inferredAiAuthored = helpers.isAiAuthored(observation)
  const openedAt = helpers.asDate(observation.openedAt || observation.createdAt)
  const mergedAt = helpers.asDate(observation.mergedAt)
  const closedAt = helpers.asDate(observation.closedAt || observation.mergedAt)

  return {
    ...observation,
    inferredAiAuthored,
    openedAt: openedAt ? openedAt.toISOString() : null,
    mergedAt: mergedAt ? mergedAt.toISOString() : null,
    closedAt: closedAt ? closedAt.toISOString() : null,
    confidence: typeof observation.confidence === 'number' ? observation.confidence : inferredAiAuthored ? 0.71 : 0.48,
    tone: observation.tone || (inferredAiAuthored ? 'eager' : 'plain'),
    triageMood: observation.triageMood || 'curious',
    followOnPotential: typeof observation.followOnPotential === 'number' ? observation.followOnPotential : Number(observation.followUpPrsTriggered || 0),
    promptComplianceScore: typeof observation.promptComplianceScore === 'number' ? observation.promptComplianceScore : inferredAiAuthored ? 3 : 4,
    speculativeFix: typeof observation.speculativeFix === 'boolean' ? observation.speculativeFix : inferredAiAuthored,
    maintainerNote: observation.maintainerNote || ''
  }
}

module.exports = {
  normalizeObservation
}
