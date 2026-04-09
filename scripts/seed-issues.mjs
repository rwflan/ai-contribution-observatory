import fs from 'fs'
import path from 'path'

const backlogPath = path.join(process.cwd(), 'docs', 'ISSUE_BACKLOG_SEEDS.md')
const backlog = fs.readFileSync(backlogPath, 'utf8')
const issueLines = backlog
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line.startsWith('- '))
  .map((line) => line.replace(/^- /, ''))

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  issueCount: issueLines.length,
  issueLines
}, null, 2))
