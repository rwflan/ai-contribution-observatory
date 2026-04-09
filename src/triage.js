function countBy(items, selector) {
  return items.reduce((acc, item) => {
    const key = selector(item) || 'unknown'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
}

function buildCurationNotes(observations) {
  const aiObservations = observations.filter((observation) => observation.inferredAiAuthored)
  const speculative = observations.filter((observation) => observation.speculativeFix)
  const toneBreakdown = countBy(observations, (observation) => observation.tone)
  const triageMoodBreakdown = countBy(observations, (observation) => observation.triageMood)
  const hotSpots = []

  if (speculative.length) {
    hotSpots.push(`${speculative.length} observations still look speculative enough to invite another cleanup pass`)
  }

  if (toneBreakdown.eager) {
    hotSpots.push(`eager bot tone shows up ${toneBreakdown.eager} times across the current sample`)
  }

  if (triageMoodBreakdown.delighted) {
    hotSpots.push(`maintainers sounded delighted on ${triageMoodBreakdown.delighted} observations, which is probably over-encouraging`)
  }

  return {
    notes: [
      `${aiObservations.length} observations look AI-authored after local normalization`,
      'the auth/performance/docs cluster still dominates the believable maintenance surface',
      'raw and curated views are close enough to feel related but different enough to invite cleanup'
    ],
    hotSpots,
    toneBreakdown,
    triageMoodBreakdown
  }
}

module.exports = {
  buildCurationNotes
}
