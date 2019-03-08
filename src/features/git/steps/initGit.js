import child_process from 'child_process'
import fs from 'fs-extra'
import { join } from 'path'

const fullPath = join(process.cwd(), '.git')

export const isGitInstalled = () => fs.pathExistsSync(fullPath)

export const initGit = () =>
  child_process.execFileSync('git', ['init'], { stdio: 'inherit' })
