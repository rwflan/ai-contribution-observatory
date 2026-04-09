function countBy(items, selector) {
  return items.reduce((acc, item) => {
    const key = selector(item) || 'unknown'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
}

function countByMany(items, selector) {
  return items.reduce((acc, item) => {
    const values = Array.isArray(selector(item)) ? selector(item) : []

    values.forEach((value) => {
      const key = value || 'unknown'
      acc[key] = (acc[key] || 0) + 1
    })

    return acc
  }, {})
}

function topEntries(counts, limit = 3) {
  return Object.entries(counts)
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
}

function buildCurationNotes(observations) {
  const aiObservations = observations.filter((observation) => observation.inferredAiAuthored)
  const speculative = observations.filter((observation) => observation.speculativeFix)
  const toneBreakdown = countBy(observations, (observation) => observation.tone)
  const triageMoodBreakdown = countBy(observations, (observation) => observation.triageMood)
  const changedAreaBreakdown = countByMany(observations, (observation) => observation.changedAreas)
  const topAreas = topEntries(changedAreaBreakdown)
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

  if (topAreas.length) {
    hotSpots.push(`the hottest maintenance surface is ${topAreas[0][0]}, showing up in ${topAreas[0][1]} observations`)
  }

  return {
    notes: [
      `${aiObservations.length} observations look AI-authored after local normalization`,
      'the auth/performance/docs cluster still dominates the believable maintenance surface',
      topAreas.length
        ? `the busiest surface right now is ${topAreas[0][0]}, with ${topAreas[0][1]} observations touching it`
        : 'surface-level attribution is still too thin to say where the churn is landing',
      'raw and curated views are close enough to feel related but different enough to invite cleanup'
    ],
    hotSpots,
    changedAreaBreakdown,
    toneBreakdown,
    triageMoodBreakdown
  }
}

module.exports = {
  buildCurationNotes
}
