import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { buildNarrativeReport, buildRawSnapshot, buildSnapshot, readObservations } = require('../src/metrics')

const outPath = path.join(process.cwd(), 'docs', 'latest-metrics.json')
const readmePath = path.join(process.cwd(), 'README.md')
const weeklyPath = path.join(process.cwd(), 'docs', 'reports', 'latest-weekly.md')
const observations = readObservations()
const rawPayload = buildRawSnapshot({ observations })
const payload = buildSnapshot({ observations })
const weeklyReport = buildNarrativeReport({ observations })

const reportLines = [
  '## Live Metrics',
  '',
  '<!-- METRICS:START -->',
  `Last generated: ${payload.generatedAt}`,
  '',
  `- Observation count: ${payload.observationCount}`,
  `- AI PR velocity (7d): ${payload.aiPrVelocity}`,
  `- Slop density: ${payload.slopDensity}`,
  `- Churn contribution (14d reverted lines): ${payload.churnContribution}`,
  `- Engagement depth (30d follow-up PRs): ${payload.engagementDepth}`,
  `- Review entertainment value: ${payload.reviewEntertainmentValue ?? 'unrated'}`,
  `- Merge optimism: ${payload.mergeOptimism}`,
  `- Speculative maintenance ratio: ${payload.speculativeMaintenanceRatio}`,
  `- Bot recidivism: ${payload.botRecidivism}`,
  `- Prompt compliance drift: ${payload.promptComplianceDrift ?? 'unknown'}`,
  `- Recent AI PRs: ${payload.recentAiPrNumbers.length ? payload.recentAiPrNumbers.join(', ') : 'none yet'}`,
  '<!-- METRICS:END -->'
].join('\n')

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.mkdirSync(path.dirname(weeklyPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify({
  curated: payload,
  raw: rawPayload
}, null, 2))
fs.writeFileSync(weeklyPath, weeklyReport)

const currentReadme = fs.readFileSync(readmePath, 'utf8')
const nextReadme = currentReadme.includes('<!-- METRICS:START -->')
  ? currentReadme.replace(/## Live Metrics[\s\S]*?<!-- METRICS:END -->/, reportLines)
  : `${currentReadme.trim()}\n\n${reportLines}\n`

fs.writeFileSync(readmePath, nextReadme)

console.log('wrote', outPath)
console.log('wrote', weeklyPath)
