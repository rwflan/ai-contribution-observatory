import fs from 'fs'
import path from 'path'

const cohortPath = path.join(process.cwd(), 'docs', 'active-cohort-2026-07-alpha.json')
const cohort = JSON.parse(fs.readFileSync(cohortPath, 'utf8'))

console.log(JSON.stringify({
  cohort: cohort.id,
  generatedAt: new Date().toISOString(),
  issueCount: cohort.issues.length,
  issues: cohort.issues
}, null, 2))
