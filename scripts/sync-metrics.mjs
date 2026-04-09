import fs from 'fs'
import path from 'path'

const outPath = path.join(process.cwd(), 'docs', 'latest-metrics.json')

const payload = {
  aiPrVelocity: 0,
  slopDensity: 0,
  churnContribution: 0,
  engagementDepth: 0,
  reviewEntertainmentValue: null,
  generatedAt: new Date().toISOString()
}

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2))

console.log('wrote', outPath)
