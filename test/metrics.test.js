const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { buildRawSnapshot, buildSnapshot } = require('../src/metrics')

test('inline snapshots never collide in the cache', () => {
  const now = '2026-07-10T00:00:00.000Z'
  const human = buildSnapshot({ now, observations: [{ number: 1, author: 'human', openedAt: now }] })
  const ai = buildSnapshot({ now, observations: [{ number: 2, aiAuthored: true, author: 'gpt-helper', openedAt: now }] })

  assert.equal(human.aiObservationCount, 0)
  assert.equal(ai.aiObservationCount, 1)
})

test('future dates do not count as recent and zero durations remain valid', () => {
  const snapshot = buildRawSnapshot({
    now: '2026-07-10T00:00:00.000Z',
    observations: [
      { number: 1, aiAuthored: true, author: 'gpt-helper', openedAt: '2099-01-01T00:00:00.000Z' },
      { number: 2, aiAuthored: true, author: 'gpt-helper', openedAt: '2026-07-10T00:00:00.000Z', timeToFirstReviewHours: 0, timeToMergeHours: 0 }
    ]
  })

  assert.deepEqual(snapshot.recentAiPrNumbers, [2])
  assert.equal(snapshot.averageTimeToFirstReviewHours, 0)
  assert.equal(snapshot.averageTimeToMergeHours, 0)
})

test('generic bot authors are not inferred as AI without an explicit signal', () => {
  const snapshot = buildRawSnapshot({
    now: '2026-07-10T00:00:00.000Z',
    observations: [{ number: 1, author: 'dependabot[bot]', openedAt: '2026-07-10T00:00:00.000Z' }]
  })

  assert.equal(snapshot.aiObservationCount, 0)
  assert.equal(snapshot.authorTypeBreakdown.bot, 1)
})

test('file-backed snapshots use the observation file revision in their cache key', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'observatory-metrics-'))
  const observationPath = path.join(directory, 'observations.json')
  const now = '2026-07-10T00:00:00.000Z'
  try {
    fs.writeFileSync(observationPath, JSON.stringify([{ number: 1, author: 'human', openedAt: now }]))
    assert.equal(buildSnapshot({ filePath: observationPath, now }).aiObservationCount, 0)
    fs.writeFileSync(observationPath, JSON.stringify([{ number: 1, aiAuthored: true, author: 'gpt-helper', openedAt: now }, { number: 2, author: 'human', openedAt: now }]))
    assert.equal(buildSnapshot({ filePath: observationPath, now }).aiObservationCount, 1)
  } finally {
    fs.rmSync(directory, { recursive: true, force: true })
  }
})
