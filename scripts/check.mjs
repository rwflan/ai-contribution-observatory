import { execFileSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const targets = [
  ...fs.readdirSync(path.join(process.cwd(), 'src')).filter((file) => file.endsWith('.js')).map((file) => path.join('src', file)),
  ...fs.readdirSync(path.join(process.cwd(), 'scripts')).filter((file) => file.endsWith('.mjs')).map((file) => path.join('scripts', file))
]

for (const target of targets) {
  execFileSync(process.execPath, ['--check', target], { stdio: 'inherit' })
}

console.log(`syntax check passed for ${targets.length} files`)
