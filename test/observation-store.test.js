const fs = require('fs')
const os = require('os')
const path = require('path')
const test = require('node:test')
const assert = require('node:assert/strict')
const { ObservationDataError, parseObservations, readObservationsFile, writeObservationsAtomically } = require('../src/observation-store')

test('observation store validates malformed payloads and writes valid payloads atomically', () => {
  assert.throws(() => parseObservations('{not-json'), ObservationDataError)
  assert.throws(() => parseObservations('{}'), ObservationDataError)
  assert.throws(() => parseObservations('[{"number":"not-a-number"}]'), ObservationDataError)

  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'observatory-store-'))
  const destination = path.join(directory, 'observations.json')
  try {
    writeObservationsAtomically(destination, [{ number: 1, title: 'valid' }])
    assert.deepEqual(readObservationsFile(destination), [{ number: 1, title: 'valid' }])
  } finally {
    fs.rmSync(directory, { recursive: true, force: true })
  }
})
