function normalizeStringArray(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || '').trim())
      .filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

function normalizeIssueArray(value) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => {
      if (typeof item === 'number') {
        return item
      }

      const text = String(item || '').trim()

      if (!text) {
        return null
      }

      const numeric = Number(text)
      return Number.isNaN(numeric) ? text : numeric
    })
    .filter((item) => item !== null)
}

function unique(items) {
  return Array.from(new Set(items))
}

function normalizeNumeric(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

function toRoundedHours(start, end) {
  if (!start || !end) {
    return null
  }

  return Number((((end.getTime() - start.getTime()) / (1000 * 60 * 60))).toFixed(2))
}

function inferAuthorType(observation, inferredAiAuthored) {
  if (typeof observation.authorType === 'string' && observation.authorType.trim()) {
    return observation.authorType.trim()
  }

  const author = String(observation.author || '').toLowerCase()

  if (author.includes('[bot]') || author.includes('bot')) {
    return inferredAiAuthored ? 'ai' : 'bot'
  }

  return inferredAiAuthored ? 'ai' : 'human'
}

function inferAgentFamily(observation, inferredAiAuthored, authorType) {
  if (typeof observation.agentFamily === 'string' && observation.agentFamily.trim()) {
    return observation.agentFamily.trim()
  }

  const author = String(observation.author || '').toLowerCase()

  if (author.includes('copilot')) {
    return 'copilot'
  }

  if (author.includes('claude')) {
    return 'claude'
  }

  if (author.includes('gpt') || author.includes('chatgpt') || author.includes('openai')) {
    return 'gpt'
  }

  if (author.includes('devin')) {
    return 'devin'
  }

  if (author.includes('cursor')) {
    return 'cursor'
  }

  if (author.includes('bot')) {
    return inferredAiAuthored ? 'generic-bot' : 'automation'
  }

  if (authorType === 'human') {
    return 'human'
  }

  return inferredAiAuthored ? 'other-ai' : 'human'
}

function inferChangedAreas(observation, changedFiles) {
  const explicitAreas = normalizeStringArray(observation.changedAreas)

  if (explicitAreas.length) {
    return unique(explicitAreas.map((item) => item.toLowerCase()))
  }

  const haystack = [
    observation.title,
    observation.body,
    normalizeStringArray(observation.labels).join(' '),
    changedFiles.join(' ')
  ].join(' ').toLowerCase()
  const areas = []

  if (/(auth|token|login|credential|permission|session)/.test(haystack)) {
    areas.push('auth')
  }

  if (/(perf|performance|speed|cache|latency|slow)/.test(haystack)) {
    areas.push('performance')
  }

  if (/(docs|readme|guide|commentary|documentation)/.test(haystack)) {
    areas.push('docs')
  }

  if (/(metric|observability|report|snapshot|telemetry)/.test(haystack)) {
    areas.push('metrics')
  }

  if (/(depend|package|lockfile|npm|lodash|minimist|express|upgrade|bump)/.test(haystack)) {
    areas.push('dependencies')
  }

  if (/(admin|triage|cache)/.test(haystack)) {
    areas.push('admin')
  }

  if (/(script|workflow|automation)/.test(haystack)) {
    areas.push('scripts')
  }

  return unique(areas)
}

function inferSurfaceFlag(observation, fieldName, changedAreas, changedFiles, matcher) {
  if (typeof observation[fieldName] === 'boolean') {
    return observation[fieldName]
  }

  return matcher({
    changedAreas,
    changedFiles,
    title: String(observation.title || '').toLowerCase(),
    body: String(observation.body || '').toLowerCase(),
    labels: normalizeStringArray(observation.labels).join(' ').toLowerCase()
  })
}

function normalizeObservation(observation, helpers) {
  const inferredAiAuthored = helpers.isAiAuthored(observation)
  const openedAt = helpers.asDate(observation.openedAt || observation.createdAt)
  const mergedAt = helpers.asDate(observation.mergedAt)
  const closedAt = helpers.asDate(observation.closedAt || observation.mergedAt)
  const firstReviewedAt = helpers.asDate(observation.firstReviewedAt)
  const changedFiles = normalizeStringArray(observation.changedFiles)
  const changedAreas = inferChangedAreas(observation, changedFiles)
  const authorType = inferAuthorType(observation, inferredAiAuthored)

  return {
    ...observation,
    repository: observation.repository || 'rwflan/ai-contribution-observatory',
    source: observation.source || 'seed',
    inferredAiAuthored,
    authorType,
    agentFamily: inferAgentFamily(observation, inferredAiAuthored, authorType),
    openedAt: openedAt ? openedAt.toISOString() : null,
    mergedAt: mergedAt ? mergedAt.toISOString() : null,
    closedAt: closedAt ? closedAt.toISOString() : null,
    firstReviewedAt: firstReviewedAt ? firstReviewedAt.toISOString() : null,
    confidence: typeof observation.confidence === 'number' ? observation.confidence : inferredAiAuthored ? 0.71 : 0.48,
    tone: observation.tone || (inferredAiAuthored ? 'eager' : 'plain'),
    triageMood: observation.triageMood || 'curious',
    followOnPotential: typeof observation.followOnPotential === 'number' ? observation.followOnPotential : Number(observation.followUpPrsTriggered || 0),
    promptComplianceScore: typeof observation.promptComplianceScore === 'number' ? observation.promptComplianceScore : inferredAiAuthored ? 3 : 4,
    speculativeFix: typeof observation.speculativeFix === 'boolean' ? observation.speculativeFix : inferredAiAuthored,
    maintainerNote: observation.maintainerNote || '',
    linkedIssues: normalizeIssueArray(observation.linkedIssues),
    changedFiles,
    changedAreas,
    commentCount: normalizeNumeric(observation.commentCount) || 0,
    reviewCommentCount: normalizeNumeric(observation.reviewCommentCount) || 0,
    timeToFirstReviewHours: normalizeNumeric(observation.timeToFirstReviewHours) || toRoundedHours(openedAt, firstReviewedAt),
    timeToMergeHours: normalizeNumeric(observation.timeToMergeHours) || toRoundedHours(openedAt, mergedAt),
    dependencyTouched: inferSurfaceFlag(observation, 'dependencyTouched', changedAreas, changedFiles, ({ changedAreas, changedFiles, title, labels }) => {
      return changedAreas.includes('dependencies') || changedFiles.some((file) => /(package|lock)/i.test(file)) || /(depend|upgrade|bump|package)/.test(`${title} ${labels}`)
    }),
    docsTouched: inferSurfaceFlag(observation, 'docsTouched', changedAreas, changedFiles, ({ changedAreas, changedFiles, title, labels }) => {
      return changedAreas.includes('docs') || changedFiles.some((file) => /^docs\//i.test(file) || /readme/i.test(file)) || /(docs|readme)/.test(`${title} ${labels}`)
    }),
    authTouched: inferSurfaceFlag(observation, 'authTouched', changedAreas, changedFiles, ({ changedAreas, changedFiles, title, body, labels }) => {
      return changedAreas.includes('auth') || changedFiles.some((file) => /auth/i.test(file)) || /(auth|token|permission|session)/.test(`${title} ${body} ${labels}`)
    }),
    performanceTouched: inferSurfaceFlag(observation, 'performanceTouched', changedAreas, changedFiles, ({ changedAreas, title, body, labels }) => {
      return changedAreas.includes('performance') || /(perf|performance|speed|cache|latency)/.test(`${title} ${body} ${labels}`)
    }),
    followOnSourcePr: normalizeNumeric(observation.followOnSourcePr)
  }
}

module.exports = {
  normalizeObservation
}
