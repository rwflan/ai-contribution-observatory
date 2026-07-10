const fs = require('fs')

class ObservationDataError extends Error {
  constructor(message, options = {}) {
    super(message)
    this.name = 'ObservationDataError'
    this.code = options.code || 'OBSERVATION_DATA_INVALID'
    this.cause = options.cause
  }
}

function validateObservation(observation, index) {
  if (!observation || typeof observation !== 'object' || Array.isArray(observation)) {
    throw new ObservationDataError(`Observation ${index} must be an object`)
  }

  if (observation.number !== undefined && !Number.isFinite(Number(observation.number))) {
    throw new ObservationDataError(`Observation ${index}.number must be numeric when provided`)
  }

  for (const field of ['labels', 'linkedIssues', 'changedFiles', 'changedAreas']) {
    if (observation[field] !== undefined && !Array.isArray(observation[field]) && typeof observation[field] !== 'string') {
      throw new ObservationDataError(`Observation ${index}.${field} must be an array or comma-separated string`)
    }
  }

  return observation
}

function parseObservations(raw, source = 'observation file') {
  let parsed

  try {
    parsed = JSON.parse(raw)
  } catch (error) {
    throw new ObservationDataError(`Could not parse ${source} as JSON`, { cause: error })
  }

  if (!Array.isArray(parsed)) {
    throw new ObservationDataError(`${source} must contain a JSON array`)
  }

  return parsed.map(validateObservation)
}

function readObservationsFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return []
  }

  try {
    return parseObservations(fs.readFileSync(filePath, 'utf8'), filePath)
  } catch (error) {
    if (error instanceof ObservationDataError) {
      throw error
    }

    throw new ObservationDataError(`Could not read ${filePath}`, { cause: error })
  }
}

function writeObservationsAtomically(filePath, observations) {
  const validated = parseObservations(JSON.stringify(observations), 'generated observations')
  const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`

  try {
    fs.writeFileSync(temporaryPath, `${JSON.stringify(validated, null, 2)}\n`, 'utf8')
    fs.renameSync(temporaryPath, filePath)
  } catch (error) {
    if (fs.existsSync(temporaryPath)) {
      fs.unlinkSync(temporaryPath)
    }

    throw new ObservationDataError(`Could not atomically write ${filePath}`, { cause: error })
  }
}

function getObservationHealth(filePath) {
  try {
    const observations = readObservationsFile(filePath)
    const stat = fs.existsSync(filePath) ? fs.statSync(filePath) : null

    return {
      ok: true,
      observationCount: observations.length,
      sourceUpdatedAt: stat ? stat.mtime.toISOString() : null
    }
  } catch (error) {
    return {
      ok: false,
      code: error.code || 'OBSERVATION_DATA_INVALID'
    }
  }
}

module.exports = {
  ObservationDataError,
  getObservationHealth,
  parseObservations,
  readObservationsFile,
  writeObservationsAtomically
}
