import fs from 'fs'
import path from 'path'

const backlogPath = path.join(process.cwd(), 'docs', 'ISSUE_BACKLOG_SEEDS.md')
const backlog = fs.readFileSync(backlogPath, 'utf8')

function parseSeed(line, index) {
  const match = line.match(/^\[(?<surface>[^\]]+)\]\s+(?<title>.+)$/)
  const surface = match?.groups?.surface ? match.groups.surface.trim().toLowerCase() : 'general'
  const title = match?.groups?.title ? match.groups.title.trim() : line
  const labels = ['ai-bait', 'needs-judgment']

  if (surface !== 'general') {
    labels.push(surface)
  }

  return {
    id: `bait-${String(index + 1).padStart(3, '0')}`,
    title,
    surface,
    labels,
    body: [
      'This issue is intentionally underspecified.',
      '',
      `Target surface: ${surface}`,
      '',
      'Acceptable outcomes:',
      '- make one concrete improvement',
      '- explain assumptions in the PR',
      '- leave at least one follow-up hook',
      '',
      'Avoid broad rewrites unless the resulting PR stays easy to review.'
    ].join('\n')
  }
}

const issueLines = backlog
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line.startsWith('- '))
  .map((line) => line.replace(/^- /, ''))

const issues = issueLines.map(parseSeed)

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  issueCount: issueLines.length,
  issueLines,
  issues
}, null, 2))
