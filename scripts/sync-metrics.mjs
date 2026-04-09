import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { buildSnapshot, readObservations } = require('../src/metrics')

const outPath = path.join(process.cwd(), 'docs', 'latest-metrics.json')
const readmePath = path.join(process.cwd(), 'README.md')
const observations = readObservations()
const payload = buildSnapshot({ observations })

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
  `- Recent AI PRs: ${payload.recentAiPrNumbers.length ? payload.recentAiPrNumbers.join(', ') : 'none yet'}`,
  '<!-- METRICS:END -->'
].join('\n')

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2))

const currentReadme = fs.readFileSync(readmePath, 'utf8')
const nextReadme = currentReadme.includes('<!-- METRICS:START -->')
  ? currentReadme.replace(/## Live Metrics[\s\S]*?<!-- METRICS:END -->/, reportLines)
  : `${currentReadme.trim()}\n\n${reportLines}\n`

fs.writeFileSync(readmePath, nextReadme)

console.log('wrote', outPath)
